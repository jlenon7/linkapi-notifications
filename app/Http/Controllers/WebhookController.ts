import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Inject, Post } from '@nestjs/common'
import { TelegrafCollection } from 'app/Services/Collections/TelegrafCollection'

@Controller('/webhooks')
@ApiTags('Webhook')
export class WebhookController {
  @Inject(TelegrafCollection) private telegrafCollection: TelegrafCollection

  @Post('telegram')
  async telegram(@Body() body: any) {
    return this.telegrafCollection.sendMessage(body)
  }
}
