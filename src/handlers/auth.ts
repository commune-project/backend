import { Connection, sql } from '@databases/pg'
import { IDbActor } from '../interfaces/db-objects'

import crypto from 'crypto'
import bcrypt from 'bcrypt'

async function checkHash(password: string, passwordHash: string): Promise<boolean> {
    if (passwordHash.startsWith('$2a')) {
        return await bcrypt.compare(password, passwordHash)
    } else {
        const [hash, salt] = passwordHash.split(':')
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 64000, 32, 'sha256', (err, derivedKey) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(derivedKey.toString('hex') === hash)  // '3745e48...08d59ae'
                }
            })          
        })
    }
}

export async function authUsernamePassword(db: Connection, username: string, domain: string, password: string): Promise<IDbActor | null> {
    const actor = (await db.query(sql`SELECT data FROM actors WHERE data->>'preferredUsername'=${username} AND data->'internal'->>'domain'=${domain}`))[0].data
    if (await checkHash(password, actor.internal.passwordHash)) {
        return actor
    } else {
        return null
    }
}