import { IObject, isActivity, IActivity } from 'commune-common/definitions/interfaces'
import * as asobject from 'commune-common/components/asobject'
import { sql } from '@databases/pg'

import { BaseInboxHandler } from './base'
import mixedFetcher from '../../ap-fetchers/mixed-fetcher'
import { insertObject } from '../../dal/asobject'

export class NormalizeObjectHandler extends BaseInboxHandler {
    async handle(data: IActivity): Promise<IActivity> {
        if (!asobject.isDomainEqual(data, data.object)) {
            throw new Error("Domain not match")
        } else if (typeof data.object === 'string') {
            await mixedFetcher(data.object, this.db)
        } else {
            try {
                await insertObject(this.db, data.object)
            } finally {
                if (data.object.id) {
                    data.object = data.object.id
                }
            }
        }
        return await this.successor.handle(data)
    }
}
