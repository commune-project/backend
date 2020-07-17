import { IObject, isActivity, IActivity } from 'commune-common/definitions/interfaces'
import { Connection } from '@databases/pg'

import { BaseInboxHandler, TBaseInboxHandler } from './inbox-handlers/base'
import { CheckLocalHandler } from './inbox-handlers/check-local'
import { checkActorFactory } from './inbox-handlers/check-actor'
import { IAuthContext } from '../interfaces/context'


class InboxHandler {
    constructor(private db: Connection, private ctx: IAuthContext) { }
    async handle(data: IObject): Promise<any> {
        if (isActivity(data)) {
            const handlerList: TBaseInboxHandler[] = [
                CheckLocalHandler,
                checkActorFactory(this.ctx)
            ]
            const handlerChain: BaseInboxHandler | null = handlerList.reverse().reduce((previous: BaseInboxHandler | null, current: TBaseInboxHandler) => {
                // @ts-ignore
                return new current(this.db, previous)
            }, null)
            if (handlerChain) {
                return await handlerChain.handle(data)
            } else {
                return {}
            }
        }
    }
}

export { BaseInboxHandler, InboxHandler }