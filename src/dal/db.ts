import config from '../config'
import connect, { ConnectionPool } from '@databases/pg'

let db: ConnectionPool | null = connect(config.dbConnectOptions)

process.on("exit", () => {
    db?.dispose()
})

export {
    db
}

export async function closeDb(): Promise<void> {
    await db?.dispose()
    db = null
}

export function getDb(): ConnectionPool {
    if (!db) {
        db = connect(config.dbConnectOptions)
    }
    return db
}