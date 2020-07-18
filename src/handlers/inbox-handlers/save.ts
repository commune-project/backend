import { IObject, isActivity, IActivity } from 'commune-common/definitions/interfaces'
import { sql } from '@databases/pg'

import { BaseInboxHandler } from './base'
import { insertObject } from '../../dal/asobject'

export class SaveActivityHandler extends BaseInboxHandler {
    async handle(data: IActivity): Promise<IActivity> {
        await insertObject(this.db, data)
        return data
    }
}

export class DiscardActivityHandler extends BaseInboxHandler {
    async handle(data: IActivity): Promise<IActivity> {
        return data
    }
}