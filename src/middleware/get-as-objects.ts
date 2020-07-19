import Koa from 'koa'
import { Connection, sql } from '@databases/pg'
import DbFetcher from 'commune-backend/ap-fetchers/db-fetcher'


function mdwGetASObject(db: Connection) {
    const dbFetcher = new DbFetcher(db)
    return async function returnGetASObject(ctx: Koa.BaseContext, next: () => Promise<any>) {
        if (!ctx.accepts('application/ld+json; profile="https://www.w3.org/ns/activitystreams"')
            && !ctx.accepts('application/activity+json')) {
            await next()
        }
        try {
            const protocol = 'https'
            const url = `${protocol}://${ctx.host}${ctx.path}`
            ctx.body = await dbFetcher.getById(url)
            if (ctx.body.internal) {
                delete ctx.body.internal
            }
        } catch (err) {
            ctx.body = { "error": "not found" }
            ctx.status = 404
        }
    }
}

export default mdwGetASObject