import { Interval } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { Inject, Injectable } from '@nestjs/common'
import { TriggerRepository } from 'app/Repositories/TriggerRepository'
import { TelegrafCollection } from 'app/Services/Collections/TelegrafCollection'

@Injectable()
export class CronService {
  @Inject(ConfigService) private configService: ConfigService
  @Inject(TriggerRepository) private triggerRepository: TriggerRepository
  @Inject(TelegrafCollection) private telegrafCollection: TelegrafCollection

  async mountPayload(type, triggers) {
    const options = {
      from: 'LinkApi Notifications',
      url: type,
      name: 'Cron',
      details: triggers,
    }

    await this.telegrafCollection.sendMessage(options)
  }

  @Interval(60000)
  async verifyTriggers() {
    console.log('rodando')
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

    if (
      triggersLength.numberOfQueued >=
      this.configService.get('notifications.triggersQueued')
    ) {
      await this.mountPayload('Triggers Queued', triggersLength)
    }

    if (
      triggersLength.numberOfRunning >=
      this.configService.get('notifications.triggersRunning')
    ) {
      await this.mountPayload('Triggers Running', triggersLength)
    }
  }
}
