import {
  Body,
  Controller,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'
import { ApiKeyGuard } from 'app/Http/Guards/ApiKeyGuard'
import { TelegrafCollection } from 'app/Services/Collections/TelegrafCollection'

@ApiTags('Webhook')
@UseGuards(ApiKeyGuard)
@Controller('/webhooks')
export class WebhookController {
  @Inject(TelegrafCollection) private telegrafCollection: TelegrafCollection

  @Post('cloudAmqp')
  async cloudAmqp(@Body() body: any) {
    const options = {
      from: 'CloudAmqp',
      url: body.hostname,
      name: body.appname,
      details: body,
    }

    delete options.details.appname
    delete options.details.hostname

    return this.telegrafCollection.sendMessage(options)
  }

  @Post('uptimeRobot')
  async uptimeRobot(@Query() queries: any) {
    const options = {
      from: 'UptimeRobot',
      url: queries.monitorURL,
      name: queries.monitorFriendlyName,
      details: queries,
    }

    delete options.details.monitorURL
    delete options.details.monitorFriendlyName

    return this.telegrafCollection.sendMessage(options)
  }
}
