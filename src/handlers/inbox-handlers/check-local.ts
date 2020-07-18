import { IObject, isActivity, IActivity } from 'commune-common/definitions/interfaces'
import { sql } from '@databases/pg'

import { BaseInboxHandler } from './base'

export class CheckLocalHandler extends BaseInboxHandler {
    async handle(data: IActivity): Promise<IActivity> {
        const count = (await this.db.query(sql`SELECT COUNT(data) FROM activities WHERE data->>'id'=${data.id}`))[0].count
        if (count===0) {
            return await this.successor.handle(data)
        } else {
            throw new Error('Already exists')
        }
    }
}
