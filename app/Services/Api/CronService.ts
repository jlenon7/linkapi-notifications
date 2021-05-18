import * as moment from 'moment'

import { Interval } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { Inject, Injectable } from '@nestjs/common'
import { TriggerRepository } from 'app/Repositories/TriggerRepository'
import { TelegrafCollection } from 'app/Services/Collections/TelegrafCollection'
import { TriggerMetricRepository } from '../../Repositories/TriggerMetricRepository'

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

  get aggregate() {
    const params = {
      deleted: false,
      default: false,
      isActive: true,
      status: 'RUNNING',
      developmentJob: { $in: [false, null] },
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
                $subtract: [new Date(), '$updatedAt'],
              },
              60000,
            ],
          },
          hours: {
            $divide: [
              {
                $subtract: [new Date(), '$updatedAt'],
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

    triggersLength.numberOfQueued = await this.triggerRepository.count({
      where: {
        status: 'QUEUED',
      },
    })

    triggersLength.numberOfRunning = await this.triggerRepository.count({
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

    const triggers = await this.triggerRepository.aggregate(this.aggregate)

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

      await this.mountPayload('Triggers no result', trigger)
    }
  }
}
