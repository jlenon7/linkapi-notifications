import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
const Telegraf = require('telegraf')

@Injectable()
export class TelegrafCollection {
  private envs: any
  private telegram: any

  constructor(private configService: ConfigService) {
    this.envs = this.configService.get('http.services.telegram')
    this.telegram = new Telegraf.Telegram(this.envs.token)
  }

  async sendMessage(options: any) {
    const text = `<b>From:</b> ${options.from}\n<b>Name:</b> ${options.name}\n<b>Details:</b> ${options.details}\n<b>URL/Queue:</b> ${options.url}`

    return this.telegram.sendMessage(this.envs.chatId, text, {
      parse_mode: 'HTML',
    })
  }
}
