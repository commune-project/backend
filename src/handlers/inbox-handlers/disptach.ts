import { IObject, isActivity, IActivity } from 'commune-common/definitions/interfaces'
import { sql } from '@databases/pg'

import { BaseInboxHandler } from './base'
import { SaveActivityHandler, DiscardActivityHandler } from './save'
import { NormalizeObjectHandler } from './normalize-object'

export class DispatchHandler extends BaseInboxHandler {
    async handle(data: IActivity): Promise<IActivity> {
        const saveHandler = new SaveActivityHandler(this.db, null)
        const discardHandler = new DiscardActivityHandler(this.db, null)
        const dispatcher_table: { [type: string]: BaseInboxHandler} = {
            "Create": new NormalizeObjectHandler(this.db, saveHandler)
/*
            "Create": NormalizeObjectHandler(successor=save),
            "Like": LikeOrAnnounceHandler(successor=save),
            "Announce": LikeOrAnnounceHandler(successor=save),
            "Undo": UndoHandler(successor=discard),
            "Follow": FollowHandler(successor=save),
            "Accept": AcceptHandler(successor=discard),            */
        }
        return await dispatcher_table[data.type.toString()].handle(data)
    }
}
