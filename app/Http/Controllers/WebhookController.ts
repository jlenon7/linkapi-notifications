import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Inject, Post, Query } from '@nestjs/common'
import { TelegrafCollection } from 'app/Services/Collections/TelegrafCollection'

@Controller('/webhooks')
@ApiTags('Webhook')
export class WebhookController {
  @Inject(TelegrafCollection) private telegrafCollection: TelegrafCollection

  @Post('cloudAmqp')
  async cloudAmqp(@Body() body: any) {
    const options = {
      from: 'CloudAmqp',
      url: body.hostname,
      details: JSON.stringify(body.options),
      name: body.appname,
    }

    return this.telegrafCollection.sendMessage(options)
  }

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
