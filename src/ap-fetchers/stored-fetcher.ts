import { Connection, sql } from '@databases/pg'
import IAbstractFetcher from 'commune-common/ap-fetchers/abstract-fetcher'
import HttpFetcher from 'commune-common/ap-fetchers/http-fetcher'
import AuthedHttpFetcher from './authed-fetcher'
import { IObject } from 'commune-common/definitions/interfaces'
import { IDbActor } from '../interfaces/db-objects'

export async function normalizeObject(db: Connection, aso: any): Promise<any> {
    for (const key in aso) {
        if (Object.keys(aso[key]).includes("@context") && typeof aso[key] === 'object' && aso[key].id) {
            try {
                const obj = normalizeObject(db, aso[key])
                await db.query(sql`INSERT INTO objects (data) VALUES (${aso[key]})`)
            } finally {
                aso[key] = aso[key].id
            }
        }
    }
    return aso
}

export default class StoredFetcher implements IAbstractFetcher {
    constructor(private db: Connection, private actor?: IDbActor) { }

    async getById(id: string): Promise<IObject> {
        const httpFetcher = this.actor ? new AuthedHttpFetcher(this.actor) : new HttpFetcher()
        const aso = await httpFetcher.getById(id)
        const normalized = await normalizeObject(this.db, aso)
        await this.db.query(sql`INSERT INTO objects (data) VALUES (${normalized})`)
        return normalized
    }
}
