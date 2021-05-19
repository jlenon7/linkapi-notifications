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
  v4: {
    url: `${Env('V4_DB_CONNECTION', 'mongodb+srv')}://${Env(
      'V4_DB_USERNAME',
      'root',
    )}:${Env('V4_DB_PASSWORD', 'root')}@${Env(
      'V4_DB_HOST',
      'cluster0.uagp0.mongodb.net',
    )}/${Env('V4_DB_DATABASE', 'mongodb')}?${Env('V4_DB_OPTIONS', '')}`,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      connectionName: 'v4',
    } as MongooseModuleOptions,
    schemas: ApplicationProvider.models as ModelDefinition[],
  },

  v5: {
    url: `${Env('V5_DB_CONNECTION', 'mongodb+srv')}://${Env(
      'V5_DB_USERNAME',
      'root',
    )}:${Env('V5_DB_PASSWORD', 'root')}@${Env(
      'V5_DB_HOST',
      'cluster0.uagp0.mongodb.net',
    )}/${Env('V5_DB_DATABASE', 'mongodb')}?${Env('V5_DB_OPTIONS', '')}`,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      connectionName: 'v5',
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
