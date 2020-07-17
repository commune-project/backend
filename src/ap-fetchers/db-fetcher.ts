import { IObject } from "commune-common/definitions/interfaces"
import IAbstractFetcher, { CannotFetchError } from "commune-common/ap-fetchers/abstract-fetcher"
import { Connection, sql } from '@databases/pg'

export default class DbFetcher implements IAbstractFetcher {
    constructor(private db: Connection) { }

    async getById(id: string): Promise<IObject> {
        try {
            const rows = await this.db.query(sql`SELECT data FROM objects WHERE data->>'id'=${id}`)
            if (rows.length === 1) {
                return rows[0].data
            } else {
                throw new CannotFetchError(id)
            }
        } catch (err) {
            throw new CannotFetchError(id, ...err)
        }
    }
}