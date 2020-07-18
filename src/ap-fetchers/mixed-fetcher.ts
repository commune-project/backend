import { Connection } from '@databases/pg'
import CompositeFetcher from 'commune-common/ap-fetchers/composite-fetcher'

import {IDbActor} from '../interfaces/db-objects'

import DbFetcher from './db-fetcher'
import StoredFetcher from './stored-fetcher'
import { IObject } from 'commune-common/definitions/interfaces'

export default async function(id: string, db: Connection, actor?: IDbActor): Promise<IObject> {
    const dbFetcher = new DbFetcher(db)
    const storedFetcher = new StoredFetcher(db, actor)
    return await new CompositeFetcher([dbFetcher, storedFetcher]).getById(id)
}