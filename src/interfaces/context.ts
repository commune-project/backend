import { ExtendableContext } from 'koa'
import { IDbActor } from './db-objects'

export interface IAuthContext extends ExtendableContext {
    account?: IDbActor
    session?: any
}