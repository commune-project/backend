import { IObject, isActivity, IActivity } from 'commune-common/definitions/interfaces'
import * as asobject from 'commune-common/components/asobject'
import { sql } from '@databases/pg'

import { BaseInboxHandler } from './base'
import mixedFetcher from '../../ap-fetchers/mixed-fetcher'

export class NormalizeObjectHandler extends BaseInboxHandler {
    async handle(data: IActivity): Promise<IActivity> {
        if (!asobject.isDomainEqual(data, data.object)) {
            throw new Error("Domain not match")
        } else if (typeof data.object === 'string') {
            mixedFetcher(data.object, this.db)
        } else {
            try {
                this.db.query(sql`INSERT INTO objects (data) VALUES (${data.object})`)
            } finally {
                data.object = data.object.id
            }
        }
        return data
    }
}
