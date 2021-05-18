import Env from '@secjs/env'
import { ApplicationProvider } from 'providers/ApplicationProvider'
import { ModelDefinition, MongooseModuleOptions } from '@nestjs/mongoose'

export default {
  /*
  |--------------------------------------------------------------------------
  | MongoDb
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for Mongo database.
  |
  | npm i --save mongoose
  |
  */
  mongo: {
    url: `${Env('DB_CONNECTION', 'mongodb+srv')}://${Env(
      'DB_USERNAME',
      'root',
    )}:${Env('DB_PASSWORD', 'root')}@${Env(
      'DB_HOST',
      'cluster0.uagp0.mongodb.net',
    )}/${Env('DB_DATABASE', 'mongodb')}?${Env('DB_OPTIONS', '')}`,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      connectionName: 'main',
    } as MongooseModuleOptions,
    schemas: ApplicationProvider.models as ModelDefinition[],
  },

  metrics: {
    url: `${Env('METRIC_DB_CONNECTION', 'mongodb+srv')}://${Env(
      'METRIC_DB_USERNAME',
      'root',
    )}:${Env('METRIC_DB_PASSWORD', 'root')}@${Env(
      'METRIC_DB_HOST',
      'cluster0.uagp0.mongodb.net',
    )}/${Env('METRIC_DB_DATABASE', 'mongodb')}?${Env('METRIC_DB_OPTIONS', '')}`,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      connectionName: 'metric',
    } as MongooseModuleOptions,
    schemas: ApplicationProvider.models as ModelDefinition[],
  },
}
