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
    let text = ''

    const json = JSON.stringify(options.details, null, 2)

    text += `*From:* ${options.from}\n`
    text += `*Name:* ${options.name}\n`
    text += `*URL/Queue:* ${options.url}\n`
    text += `*Details:* \`\`\`json ${json}\`\`\``

    return this.telegram.sendMessage(this.envs.chatId, text, {
      parse_mode: 'MarkdownV2',
    })
  }
}
