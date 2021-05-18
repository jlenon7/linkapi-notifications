import Env from '@secjs/env'

export default {
  triggersQueued: Env({ name: 'TRIGGERS_QUEUED', type: 'number' }, 50),
  triggersRunning: Env({ name: 'TRIGGERS_RUNNING', type: 'number' }, 300),
}
