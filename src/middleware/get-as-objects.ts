import Koa from 'koa'
import { Connection, sql } from '@databases/pg'


function mdwGetASObject(db: Connection) {
    return async function returnGetASObject(ctx: Koa.BaseContext, next: () => Promise<any>) {
        if (!ctx.accepts('application/ld+json; profile="https://www.w3.org/ns/activitystreams"')
            && !ctx.accepts('application/activity+json')) {
            await next()
        }
        try {
            const protocol = 'https'
            const url = `${protocol}://${ctx.host}${ctx.path}`
            const aso = await db.query(sql`SELECT "data" FROM objects WHERE "data"->>'id'=${url}`)
            if (aso.length === 0) {
                throw new Error("not found")
            }
            ctx.body = aso[0].data
            if (ctx.body.internal) {
                delete ctx.body.internal
            }
        } catch (err) {
            ctx.body = {"error": "not found"}
            ctx.status = 404
        }
    }
}

export default mdwGetASObject