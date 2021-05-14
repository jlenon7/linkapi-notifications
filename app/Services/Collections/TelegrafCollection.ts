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
    const text = `**From:** ${options.from}\n**Name:** ${options.name}\n**Details:** ${options.details}\n**URL/Queue:** ${options.url}\n`

    return this.telegram.sendMessage(this.envs.chatId, text)
  }
}
