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

  async sendMessage(body: any) {
    console.log(body)

    const text = JSON.stringify(body)

    return this.telegram.sendMessage(this.envs.chatId, text)
  }
}
