import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest()

    const apiKey = request.query.apiKey

    if (apiKey !== '') {
      throw new ForbiddenException('API_KEY')
    }

    return true
  }
}
