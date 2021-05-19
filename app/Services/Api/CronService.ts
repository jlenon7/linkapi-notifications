import * as moment from 'moment'

import { Interval } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { Inject, Injectable } from '@nestjs/common'
import { TriggerRepository } from 'app/Repositories/TriggerRepository'
import { TelegrafCollection } from 'app/Services/Collections/TelegrafCollection'
import { TriggerMetricRepository } from 'app/Repositories/TriggerMetricRepository'

@Injectable()
export class CronService {
  @Inject(ConfigService)
  private configService: ConfigService

  @Inject(TriggerRepository)
  private triggerRepository: TriggerRepository

  @Inject(TelegrafCollection)
  private telegrafCollection: TelegrafCollection

  @Inject(TriggerMetricRepository)
  private triggerMetricRepository: TriggerMetricRepository

  aggregate(version?: string) {
    const params = {
      deleted: false,
      default: false,
      isActive: true,
      status: 'RUNNING',
      developmentJob: { $in: [false, null] },
    }

    let startDate = '$updatedAt'

    if (version === 'v4') {
      startDate = '$startedAt'
    }

    return [
      {
        $match: params,
      },
      {
        $lookup: {
          from: 'subscribers',
          let: {
            subscriber: '$subscriber',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', '$$subscriber'],
                    },
                    {
                      $eq: ['$LinkApi', false],
                    },
                    {
                      $eq: ['$deleted', false],
                    },
                  ],
                },
              },
            },
          ],
          as: 'subscriber',
        },
      },
      {
        $lookup: {
          from: 'tenants',
          let: {
            tenant: '$tenant',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', '$$tenant'],
                    },
                    {
                      $eq: ['$deleted', false],
                    },
                  ],
                },
              },
            },
          ],
          as: 'tenant',
        },
      },
      {
        $unwind: {
          path: '$subscriber',
        },
      },
      {
        $unwind: {
          path: '$tenant',
        },
      },
      {
        $project: {
          _id: 1,
          subscriber: '$subscriber.fullname',
          name: '$name',
          tenant: '$tenant.title',
          minutes: {
            $divide: [
              {
                $subtract: [new Date(), startDate],
              },
              60000,
            ],
          },
          hours: {
            $divide: [
              {
                $subtract: [new Date(), startDate],
              },
              3600000,
            ],
          },
        },
      },
      {
        $match: {
          minutes: {
            $gte: 30,
          },
        },
      },
      {
        $sort: {
          minutes: -1,
        },
      },
    ]
  }

  async mountPayload(type, triggers) {
    const options = {
      from: 'LinkApi Notifications',
      url: type,
      name: 'Cron',
      details: triggers,
    }

    await this.telegrafCollection.sendMessage(options)
  }

  async getTriggersLength() {
    const triggersLength = {
      numberOfQueued: 0,
      numberOfRunning: 0,
    }

    triggersLength.numberOfQueued = await this.triggerRepository.count('v5', {
      where: {
        status: 'QUEUED',
      },
    })

    triggersLength.numberOfRunning = await this.triggerRepository.count('v5', {
      where: {
        status: 'RUNNING',
      },
    })

    return triggersLength
  }

  @Interval(60000)
  async verifyTriggers() {
    const { numberOfQueued, numberOfRunning } = await this.getTriggersLength()

    const maxNumberOfQueued = this.configService.get(
      'notifications.triggersQueued',
    )

    if (numberOfQueued >= maxNumberOfQueued) {
      await this.mountPayload('Triggers Queued', {
        numberOfQueued,
        numberOfRunning,
      })
    }

    const maxNumberOfRunning = this.configService.get(
      'notifications.triggersRunning',
    )

    if (numberOfRunning >= maxNumberOfRunning) {
      await this.mountPayload('Triggers Running', {
        numberOfQueued,
        numberOfRunning,
      })
    }

    const startDate = moment()
      .subtract(30, 'minutes')
      .format()
    const endDate = moment()
      .add(10, 'minutes')
      .format()

    this.v4TriggersTasks(startDate, endDate)
    this.v5TriggersTasks(startDate, endDate)
  }

  async v4TriggersTasks(startDate, endDate) {
    const version = 'v4'

    const triggers = await this.triggerRepository.aggregate(
      version,
      this.aggregate(version),
    )

    for (const trigger of triggers) {
      const options = {
        where: {
          'trigger._id': trigger._id,
          updatedAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      }

      const metrics = await this.triggerMetricRepository.getAll(options)

      if (!metrics.length) {
        return
      }

      await this.mountPayload('V4 Triggers without result', {
        trigger: trigger,
        metrics: metrics.length,
      })
    }
  }

  async v5TriggersTasks(startDate, endDate) {
    const triggers = await this.triggerRepository.aggregate(
      'v5',
      this.aggregate('v5'),
    )

    for (const trigger of triggers) {
      const options = {
        where: {
          'trigger._id': trigger._id,
          updatedAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      }

      const metrics = await this.triggerMetricRepository.getAll(options)

      if (!metrics.length) {
        return
      }

      await this.mountPayload('V5 Triggers without result', {
        trigger: trigger,
        metrics: metrics.length,
      })
    }
  }
}
