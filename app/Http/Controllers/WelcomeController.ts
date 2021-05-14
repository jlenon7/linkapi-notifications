import { promisify } from 'util'
import { ApiTags } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { Controller, Get } from '@nestjs/common'

const exec = promisify(require('child_process').exec)

@Controller()
@ApiTags('Welcome')
export class WelcomeController {
  constructor(private configService: ConfigService) {}

  @Get(['', '/welcome'])
  async welcome() {
    let commit = 'Not a repository'

    try {
      commit = (await exec('git rev-parse HEAD'))['stdout'].replace('\n', '')
    } catch (error) {
      console.log('Not a repository')
    }

    return {
      commit,
      greeting: `Welcome to ${this.configService.get<string>('app.name')}!`,
      domain: this.configService.get<string>('app.name'),
      prefix: this.configService.get<string>('app.prefix'),
      version: this.configService.get<string>('app.version'),
    }
  }
}
