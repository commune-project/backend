import Router from 'koa-router'
import { InboxHandler } from './handlers/inbox'
import { authUsernamePassword } from './handlers/auth'
import { Connection, sql } from '@databases/pg'
import { IAuthContext } from './interfaces/context'

function getRouter(db: Connection): Router {
    const router = new Router()
    router.get('/.well-known/webfinger', async (ctx) => {
        try {
            const resource: string = ctx.query.resource
            let actor
            if (resource.startsWith("acct:")) {
                const fullname = resource.split(':', 2)[1]
                const [username, domain] = fullname.split('@', 2)
                actor = (await db.query(sql`SELECT data FROM actors WHERE data->>'preferredUsername'=${username} AND data->'internal'->>'domain'=${domain}`))[0].data
            } else if (resource.startsWith("https:")) {
                actor = (await db.query(sql`SELECT data FROM actors WHERE data->>'id'=${resource}`))[0].data
            }
            ctx.body = {
                "subject": `acct:${actor.username}@${actor.internal.domain}`,
                "links": [
                    {
                        "rel": "self",
                        "type": "application/activity+json",
                        "href": actor.id
                    },
                    {
                        "rel": "http://webfinger.net/rel/profile-page",
                        "type": "text/html",
                        "href": actor.url ? actor.url : actor.id
                    }

                ]
            }
        } catch (err) {
            ctx.body = { "error": err.message }
            ctx.status = 404
        }
    })

    router.post("/inbox", async (ctx) => {
        try {
            if ("id" in ctx.request.body) {
                await new InboxHandler(db, ctx).handle(ctx.request.body)
            }
            ctx.body = {}
        } catch (e) {
            ctx.body = { "error": e.message }
            ctx.status = 500
        }
    })

    router.post("/api/commune/auth/sign-in", async (ctx: IAuthContext) => {
        try {
            const username = ctx.request.body?.username
            const domain = ctx.request.host
            const password = ctx.request.body?.password
            const account = await authUsernamePassword(db, username, domain, password)
            if (account) {
                ctx.account = account
                ctx.session.account_ap_id = account.id
            } else {
                ctx.account = undefined
                ctx.session.account_ap_id = undefined
                throw Error("Please check your username or password.")
            }
        } catch (e) {
            ctx.body = { "error": "Please check your username or password." }
            ctx.status = 403
        }
    })

    router.post("/api/commune/auth/sign-out", async (ctx: IAuthContext) => {
        ctx.account = undefined
        ctx.session.account_ap_id = undefined
    })

    return router
}

export default getRouter