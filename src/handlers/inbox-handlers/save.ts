import { IObject, isActivity, IActivity } from 'commune-common/definitions/interfaces'
import { sql } from '@databases/pg'

import { BaseInboxHandler } from './base'

export class SaveActivityHandler extends BaseInboxHandler {
    async handle(data: IActivity): Promise<IActivity> {
        this.db.query(sql`INSERT INTO objects (data) VALUES (${data})`)
        return data
    }
}

export class DiscardActivityHandler extends BaseInboxHandler {
    async handle(data: IActivity): Promise<IActivity> {
        return data
    }
}