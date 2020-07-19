import Koa from 'koa'
import Router from 'koa-router'
import koaJson from 'koa-json'
import koaBodyParser from 'koa-bodyparser'
import koaSession from 'koa-session'

import connect from '@databases/pg'

import mdwGetASObject from './middleware/get-as-objects'
import mdwAuthHttpSignatures from './middleware/http-signatures'

import getRouter from './routes'
import { getDb } from './dal/db'
import config from './config'

const db = getDb()

const app = new Koa()

app.use(koaJson())
app.use(koaBodyParser())

app.keys = config.sessionKeys
app.use(koaSession(app))

app.use(mdwAuthHttpSignatures(db))

const router = getRouter(db)
app.use(router.routes()).use(router.allowedMethods())
app.use(mdwGetASObject(db))

export = app