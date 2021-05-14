import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Inject, Post, Query } from '@nestjs/common'
import { TelegrafCollection } from 'app/Services/Collections/TelegrafCollection'

@Controller('/webhooks')
@ApiTags('Webhook')
export class WebhookController {
  @Inject(TelegrafCollection) private telegrafCollection: TelegrafCollection

  @Post('telegram')
  async telegram(@Body() body: any, @Query() queries: any) {
    console.log(queries)
    return this.telegrafCollection.sendMessage(body)
  }
}
