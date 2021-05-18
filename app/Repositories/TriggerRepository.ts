import { Injectable } from '@nestjs/common'
import { Collection, Connection } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { ApiRequestContract } from '@secjs/core/contracts'
import { PaginationContract } from '@secjs/core/contracts/PaginationContract'

@Injectable()
export class TriggerRepository {
  protected Model: Collection

  constructor(@InjectConnection('main') private connection: Connection) {
    this.Model = this.connection.collection('triggers')
  }

  async getOne(id?: string, options?: ApiRequestContract) {
    if (id) {
      return this.Model.findOne({ id })
    }

    if (options.where) {
      return this.Model.findOne(options.where)
    }

    return this.Model.findOne({})
  }

  async count(options?: ApiRequestContract) {
    if (options.where) {
      return this.Model.countDocuments(options.where)
    }

    return this.Model.countDocuments()
  }

  async getAll(options?: ApiRequestContract) {
    if (options.where) {
      return this.Model.find(options.where).toArray()
    }

    return this.Model.find().toArray()
  }
}
