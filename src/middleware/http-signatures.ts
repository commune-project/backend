import { Connection, sql } from '@databases/pg'
const httpSignature = require('http-signature')

import { IDbActor } from '../interfaces/db-objects'
import { IAuthContext } from '../interfaces/context'

import mixedFetcher from '../ap-fetchers/mixed-fetcher'
import { isActor } from 'commune-common/definitions/interfaces'

function mdwAuthHttpSignatures(db: Connection) {
    return async function(ctx: IAuthContext, next: () => Promise<any>) {
        try {
            const parsed = httpSignature.parseRequest(ctx.req)
            const actors: any[] = await db.query(sql`SELECT data FROM actors WHERE data->'publicKey'->>'id'=${parsed.keyId}`)
            if (actors.length === 1) {
                if (httpSignature.verifySignature(parsed, actors[0].publicKey.publicKeyPem)) {
                    ctx.account = actors[0].data
                }
            } else if (actors.length === 0) {
                const actorId = (parsed.keyId as string).split('#', 2)[0]
                const actor = await mixedFetcher(actorId, db)
                if (isActor(actor)) {
                    if (httpSignature.verifySignature(parsed, actor.publicKey.publicKeyPem)) {
                        ctx.account = actor
                    }
                }
            }
        } finally {
            return await next()
        }
    }
}

export default mdwAuthHttpSignatures