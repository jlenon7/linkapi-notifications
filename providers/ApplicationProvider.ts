import Log from 'start/debug'

import * as glob from 'glob'
import * as path from 'path'

export class ApplicationProvider {
  static pipes: any[] = []
  static configs: any = {}
  static services: any[] = []
  static httpGuards: any[] = []
  static httpMiddlewares: any[] = []
  static httpControllers: any[] = []

  get configs() {
    return {
      isGlobal: true,
      load: [() => ApplicationProvider.configs],
      ...ApplicationProvider.configs,
    }
  }

  get controllers() {
    return ApplicationProvider.httpControllers
  }

  get middlewares() {
    return ApplicationProvider.httpMiddlewares
  }

  get providers() {
    let providers = [
      ...ApplicationProvider.pipes,
      ...ApplicationProvider.services,
      ...ApplicationProvider.httpGuards,
    ]

    providers = providers.filter(provider => {
      if (!provider.prototype.onlyFromImports) return provider
    })

    return providers
  }

  constructor() {
    this.bootPipes()
    this.bootServices()
    this.bootHttpGuards()
    this.bootHttpMiddlewares()
    this.bootHttpControllers()
    this.bootConfigs()
  }

  bootPipes() {
    const fileExt = '.ts'
    const filePath = 'app/Pipes'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        Log.main(`🔩 Ignoring ${fileName}`)

        return
      }

      Log.main(`🔩 Boot ${fileName}`)
      ApplicationProvider.pipes.push(Class)
    })
  }

  bootConfigs() {
    const fileExt = '.ts'
    const filePath = 'config'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      Log.main(`🔗 Boot ${fileName}`)
      ApplicationProvider.configs[
        fileName
      ] = require(`../${replacedPath}`).default
    })
  }

  bootServices() {
    const fileExt = '.ts'
    const filePath = 'app/Services'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        Log.main(`🔧 Ignoring ${fileName}`)

        return
      }

      Log.main(`🔧 Boot ${fileName}`)
      ApplicationProvider.services.push(Class)
    })
  }

  bootHttpGuards() {
    const fileExt = '.ts'
    const filePath = 'app/Http/Guards'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        Log.main(`🛡️  Ignoring ${fileName}`)

        return
      }

      Log.main(`🛡️  Boot ${fileName}`)
      ApplicationProvider.httpGuards.push(Class)
    })
  }

  bootHttpMiddlewares() {
    const fileExt = '.ts'
    const filePath = 'app/Http/Middlewares'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        Log.main(`📎 Ignoring ${fileName}`)

        return
      }

      Log.main(`📎 Boot ${fileName}`)
      ApplicationProvider.httpMiddlewares.push({
        middleware: Class,
        routes: Class.routes,
      })
    })
  }

  bootHttpControllers() {
    const fileExt = '.ts'
    const filePath = 'app/Http/Controllers'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function(file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        Log.main(`🚪 Ignoring ${fileName}`)

        return
      }

      Log.main(`🚪 Boot ${fileName}`)
      ApplicationProvider.httpControllers.push(Class)
    })
  }
}

export default new ApplicationProvider()
