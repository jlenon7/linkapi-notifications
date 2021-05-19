import { Injectable } from '@nestjs/common'
import { Collection, Connection } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { ApiRequestContract } from '@secjs/core/contracts'

@Injectable()
export class TriggerRepository {
  protected v4Model: Collection
  protected v5Model: Collection

  constructor(
    @InjectConnection('v4') private v4Connection: Connection,
    @InjectConnection('v5') private v5Connection: Connection,
  ) {
    this.v4Model = this.v4Connection.collection('triggers')
    this.v5Model = this.v5Connection.collection('triggers')
  }

  async getOne(version?: string, id?: string, options?: ApiRequestContract) {
    let model = this.v5Model

    if (version === 'v4') {
      model = this.v4Model
    }

    if (id) {
      return model.findOne({ id })
    }

    if (options && options.where) {
      return model.findOne(options.where)
    }

    return model.findOne({})
  }

  async count(version?: string, options?: ApiRequestContract) {
    let model = this.v5Model

    if (version === 'v4') {
      model = this.v4Model
    }

    if (options && options.where) {
      return model.countDocuments(options.where)
    }

    return model.countDocuments()
  }

  async getAll(version?: string, options?: ApiRequestContract) {
    let model = this.v5Model

    if (version === 'v4') {
      model = this.v4Model
    }

    if (options && options.where) {
      return model.find(options.where).toArray()
    }

    return model.find().toArray()
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async aggregate(version?: string, options?: object[]) {
    let model = this.v5Model

    if (version === 'v4') {
      model = this.v4Model
    }

    if (options && options.length) {
      return model.aggregate(options).toArray()
    }

    return model.aggregate().toArray()
  }
}
