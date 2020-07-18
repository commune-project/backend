import connect, {sql} from '@databases/pg'
import { insertObject } from 'commune-backend/dal/asobject'
import { InboxHandler } from 'commune-backend/handlers/inbox'
import { USERS } from '../fixtures/user'
import { IObject, IActor, IActivity } from 'commune-common/definitions/interfaces'
import { Context } from 'vm'
import { IAuthContext } from 'commune-backend/interfaces/context'

const db = connect(process.env["DATABASE_URL"])
const ctx = {
    account: USERS["misaka4e21"] as IActor,
    session: {
        account_ap_id: USERS["misaka4e21"].id
    }
}

const createExampleWrong = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "type": "Create",
    "id": "https://example.net/~mallory/87374",
    "actor": "https://example.net/~mallory",
    "object": {
      "id": "https://example.com/~mallory/note/72",
      "type": "Note",
      "attributedTo": "https://example.net/~mallory",
      "content": "This is a note",
      "published": "2015-02-10T15:04:55Z",
      "to": ["https://example.org/~john/"],
      "cc": ["https://example.com/~erik/followers",
             "https://www.w3.org/ns/activitystreams#Public"]
    },
    "published": "2015-02-10T15:04:55Z",
    "to": ["https://example.org/~john/"],
    "cc": ["https://example.com/~erik/followers",
           "https://www.w3.org/ns/activitystreams#Public"]
}

const createExampleCorrect = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "type": "Create",
    "id": `${USERS.misaka4e21.id}/87375`,
    "actor": USERS.misaka4e21.id,
    "object": {
      "id": `${USERS.misaka4e21.id}/note/73`,
      "type": "Note",
      "attributedTo": USERS.misaka4e21.id,
      "content": "This is a note",
      "published": "2015-02-10T15:04:55Z",
      "to": ["https://example.org/~john/"],
      "cc": ["https://example.com/~erik/followers",
             "https://www.w3.org/ns/activitystreams#Public"]
    },
    "published": "2015-02-10T15:04:55Z",
    "to": ["https://example.org/~john/"],
    "cc": ["https://example.com/~erik/followers",
           "https://www.w3.org/ns/activitystreams#Public"]
}

const handler = new InboxHandler(db, ctx as IAuthContext)

beforeAll(async () => {
    await insertObject(db, USERS["misaka4e21"] as IObject)
})

test("Can create notes", async ()=>{
    await handler.handle(createExampleCorrect as IActivity)
    const c_asa = (await db.query(sql`SELECT COUNT(*) FROM activities WHERE data->>'id'=${createExampleCorrect.id}`))[0].count
    const c_aso = (await db.query(sql`SELECT COUNT(*) FROM objects WHERE data->>'id'=${createExampleCorrect.object.id}`))[0].count
    expect(c_asa).toBe(1)
    expect(c_aso).toBe(1)
})

test("Cannot create wrong notes", async ()=>{
    await expect(handler.handle(createExampleWrong as IActivity)).rejects.toThrowError("Not Authenticated")
    const c_asa = (await db.query(sql`SELECT COUNT(data) FROM activities WHERE data->>'id'=${createExampleWrong.id}`))[0].count
    const c_aso = (await db.query(sql`SELECT COUNT(data) FROM objects WHERE data->>'id'=${createExampleWrong.object.id}`))[0].count
    expect(c_asa).toBe(0)
    expect(c_aso).toBe(0)
})

afterAll(async ()=> {
    await db.query(sql`DELETE FROM objects`)
    await db.dispose()
})