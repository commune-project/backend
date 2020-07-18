import { Connection } from '@databases/pg'
import { IActivity } from 'commune-common/definitions/interfaces'

interface IInboxHandler {
    handle(data: IActivity): Promise<IActivity>
}

export abstract class BaseInboxHandler implements IInboxHandler {
    protected successor: IInboxHandler
    constructor(protected db: Connection, successor: BaseInboxHandler | null) {
        if (successor) {
            this.successor = successor
        } else {
            this.successor = {
                async handle(data: IActivity): Promise<IActivity> {
                    return data
                }
            }
        }
    }

    abstract async handle(data: IActivity): Promise<IActivity>
}

export type TBaseInboxHandler = new (db: Connection, successor: BaseInboxHandler) => BaseInboxHandler
