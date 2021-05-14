// import Env from '@secjs/env'
import { HttpModuleOptions } from '@nestjs/common'
import Env from '@secjs/env'

export default {
  /*
  |--------------------------------------------------------------------------
  | Http timeout
  |--------------------------------------------------------------------------
  |
  | Each request has a maximum time limit of five milliseconds
  |
  */
  timeout: 10000,

  /*
  |--------------------------------------------------------------------------
  | Max redirects
  |--------------------------------------------------------------------------
  |
  | The maximum of redirections that a request can do
  |
  */
  maxRedirects: 5,

  /*
  |--------------------------------------------------------------------------
  | Default services
  |--------------------------------------------------------------------------
  |
  | Default services token for communication.
  |
  */
  services: {
    telegram: {
      chatId: Env('TELEGRAM_CHAT_ID', '12345'),
      token: Env('TELEGRAM_TOKEN', '12345'),
    },
  },
} as HttpModuleOptions
