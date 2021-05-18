import 'start/env'
import * as helmet from 'helmet'
import * as rateLimit from 'express-rate-limit'
import ApplicationProvider from 'providers/ApplicationProvider'

import { AppModule } from 'app/AppModule'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule } from '@nestjs/swagger'
import { AllExceptionFilter } from 'app/Http/Filters/AllExceptionFilter'
import { ResponseInterceptor } from 'app/Http/Interceptors/ResponseInterceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const Config: ConfigService = app.get(ConfigService)

  app.use(helmet())
  app.enableCors(Config.get('cors'))
  app.use(rateLimit(Config.get('ratelimit')))
  app.setGlobalPrefix(Config.get('app.prefix'))
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new AllExceptionFilter(Config))

  SwaggerModule.setup(
    `${Config.get('app.prefix')}/swagger`,
    app,
    SwaggerModule.createDocument(app, Config.get('swagger')),
  )

  await app.listen(Config.get('app.port'))
  ApplicationProvider.clearMemory()
}

bootstrap().catch()
