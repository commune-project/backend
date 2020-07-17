import { Connection } from '@databases/pg'
import { IActivity } from 'commune-common/definitions/interfaces'

export abstract class BaseInboxHandler {
    constructor(protected db: Connection, protected successor: BaseInboxHandler) { }

    abstract async handle(data: IActivity): Promise<IActivity>
}

export type TBaseInboxHandler = new (db: Connection, successor: BaseInboxHandler) => BaseInboxHandler
