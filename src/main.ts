import Koa from 'koa'
import Router from 'koa-router'
import koaJson from 'koa-json'
import koaBodyParser from 'koa-bodyparser'
import koaSession from 'koa-session'

import connect from '@databases/pg'

import mdwGetASObject from './middleware/get-as-objects'
import mdwAuthHttpSignatures from './middleware/http-signatures'

import getRouter from './routes'

const db = connect({
    database: process.env["PGDATABASE"],
    user: process.env["PGUSER"],
    password: process.env["PGPASSWORD"],
    host: process.env["PGHOST"]
})

const app = new Koa()

app.use(koaJson())
app.use(koaBodyParser())

app.keys = ['YB85p1LTm8Wh+AlFsIvoVPQDxi2QDZAdl5']
app.use(koaSession(app))

app.use(mdwAuthHttpSignatures(db))

const router = getRouter(db)
app.use(router.routes()).use(router.allowedMethods())
app.use(mdwGetASObject(db))

app.listen(3000)