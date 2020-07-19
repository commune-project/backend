import { sql } from '@databases/pg'
import { IObject } from 'commune-common/definitions/interfaces'
import { insertObject } from 'commune-backend/dal/asobject'
import { USERS } from '../fixtures/user'
import { createExampleCorrect } from '../fixtures/create'

import request from 'supertest'
import { getDb, closeDb } from 'commune-backend/dal/db'

const db = getDb()

beforeAll(async () => {
    await insertObject(db, USERS["misaka4e21"] as IObject)
    await insertObject(db, createExampleCorrect as IObject)
})

import app from 'commune-backend/app'

test('Can get correct ASObject', async () => {
    const response = await request(app.callback())
        .get(new URL(createExampleCorrect.id).pathname)
        .set({
            "Host": USERS.misaka4e21.internal.domain,
            "Accept": 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
        })
    expect(response.status).toBe(200)
    expect(JSON.parse(response.text).id).toBe(createExampleCorrect.id)
})

test('Cannot get incorrect ASObject', async () => {
    const response = await request(app.callback())
        .get(new URL(createExampleCorrect.id).pathname)
        .set({
            "Host": USERS.misaka4e21.internal.domain.replace("mc1", "mc2"),
            "Accept": 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
        })
    expect(response.status).toBe(404)
    expect(JSON.parse(response.text)).toEqual({ "error": "not found" })
})

afterAll(async () => {
    await db.query(sql`DELETE FROM objects`)
    await closeDb()
})