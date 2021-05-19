import App from 'providers/ApplicationProvider'

import { HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'

/*
|--------------------------------------------------------------------------
| Kernel
|--------------------------------------------------------------------------
|
| Kernel is the imports from AppModule, all of the external modules that
| needs to be inside of NestJS IoC, will be exported in this Array.
|
*/

export default [
  ScheduleModule.forRoot(),
  ConfigModule.forRoot(App.configs),
  HttpModule.register(App.configs.http),
  MongooseModule.forRoot(
    App.configs.database.v4.url,
    App.configs.database.v4.options,
  ),
  MongooseModule.forRoot(
    App.configs.database.v5.url,
    App.configs.database.v5.options,
  ),
  MongooseModule.forRoot(
    App.configs.database.metrics.url,
    App.configs.database.metrics.options,
  ),
]
