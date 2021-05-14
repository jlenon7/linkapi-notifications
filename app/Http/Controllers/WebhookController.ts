import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Inject, Post, Query } from '@nestjs/common'
import { TelegrafCollection } from 'app/Services/Collections/TelegrafCollection'

@Controller('/webhooks')
@ApiTags('Webhook')
export class WebhookController {
  @Inject(TelegrafCollection) private telegrafCollection: TelegrafCollection

  @Post('telegram/uptimeRobot')
  async telegram(@Body() body: any, @Query() queries: any) {
    body = {
      text: body.text,
      url: queries.monitorURL,
      details: queries.alertDetails,
      name: queries.monitorFriendlyName,
    }

    return this.telegrafCollection.sendMessage(body)
  }
}
