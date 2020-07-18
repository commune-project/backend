import connect, { sql, ConnectionPool } from '@databases/pg'
import { authUsernamePassword } from 'commune-backend/handlers/auth'
import { insertObject } from 'commune-backend/dal/asobject'
import { USERS } from '../fixtures/user'
import { IObject } from 'commune-common/definitions/interfaces'


describe('User authentication', () => {
    let db: ConnectionPool
    beforeAll(async () => {
        db = await connect(process.env["DATABASE_URL"])
        await insertObject(db, USERS["misaka4e21"] as IObject)
    })
    test("Can authenticate with pbkdf2", async () => {
        const passwordHash = "600eb3c2888627c982d8b55f46a050fee3b1491bdf80dab8bb87669d08e04f5c:123456"
        await db.query(sql`UPDATE actors SET data=jsonb_set(data, '{internal, passwordHash}', to_jsonb(${passwordHash}::text)) WHERE data->>'preferredUsername'='misaka4e21' AND data#>>'{internal,domain}'='mc1.msknet.localdomain'`)
        expect(await authUsernamePassword(db, "misaka4e21", "mc1.msknet.localdomain", "123456")).not.toBe({})
    })

    test("Can authenticate with bcrypt", async () => {
        const passwordHash = "$2b$10$04NXbcF3SzdkDaERfPNx6O.LeB5shsysm8dEDGGmzpNb4agKypW4G"
        await db.query(sql`UPDATE actors SET data=jsonb_set(data, '{internal, passwordHash}', to_jsonb(${passwordHash}::text)) WHERE data->>'preferredUsername'='misaka4e21' AND data#>>'{internal,domain}'='mc1.msknet.localdomain'`)
        expect(await authUsernamePassword(db, "misaka4e21", "mc1.msknet.localdomain", "123456")).not.toBe({})
    })
    afterAll(async () => {
        await db.query(sql`DELETE FROM objects`)
        await db.dispose()
    })
})

