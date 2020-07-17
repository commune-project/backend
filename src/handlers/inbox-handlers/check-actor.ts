import { IActor, isActor, IActivity } from 'commune-common/definitions/interfaces'
import { Connection, sql } from '@databases/pg'

import { BaseInboxHandler } from './base'
import { IAuthContext } from '../../interfaces/context'
import * as asobject from 'commune-common/components/asobject'

export function checkActorFactory(ctx: IAuthContext) {
    return class CheckActorHandler extends BaseInboxHandler {
        constructor(db: Connection, successor: BaseInboxHandler) {
            super(db, successor)
        }

        async handle(data: IActivity): Promise<IActivity> {
            try {
                const actorId = asobject.getId(data)
                if (!ctx.account || ctx.account.id !== actorId) {
                    throw new Error("Not Authenticated")
                }
                data.actor = actorId
                return await this.successor.handle(data)
            } catch (err) {
                throw err
            }
        }
    }
}