import { ApiTags } from '@nestjs/swagger'
import { Controller, Inject, Post, Query } from '@nestjs/common'
import { TelegrafCollection } from 'app/Services/Collections/TelegrafCollection'

@Controller('/webhooks')
@ApiTags('Webhook')
export class WebhookController {
  @Inject(TelegrafCollection) private telegrafCollection: TelegrafCollection

  @Post('uptimeRobot')
  async uptimeRobot(@Query() queries: any) {
    const options = {
      from: 'UptimeRobot',
      url: queries.monitorURL,
      details: queries.alertDetails,
      name: queries.monitorFriendlyName,
    }

    return this.telegrafCollection.sendMessage(options)
  }
}
