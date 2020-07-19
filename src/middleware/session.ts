import { Connection, sql } from '@databases/pg'
const httpSignature = require('http-signature')

import { IDbActor } from '../interfaces/db-objects'
import { IAuthContext } from '../interfaces/context'

import { isActor } from 'commune-common/definitions/interfaces'

function mdwAuthHttpSignatures(db: Connection) {
    return async function(ctx: IAuthContext, next: () => Promise<any>) {
        try {
            const actors = await db.query(sql`SELECT data FROM actors WHERE data->>'id'=${ctx.session.account_ap_id}`)
            if (actors.length === 1) {
                ctx.account = actors[0].data
            }
        } finally {
            return await next()
        }
    }
}

export default mdwAuthHttpSignatures