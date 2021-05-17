import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common'

import { ConfigService } from '@nestjs/config'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  @Inject(ConfigService) private configService: ConfigService

  canActivate(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest()

    const apiKey = request.query.apiKey

    if (apiKey !== this.configService.get('app.apiKey')) {
      throw new ForbiddenException('API_KEY_ERROR')
    }

    return true
  }
}
