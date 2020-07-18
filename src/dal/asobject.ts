import { IObject } from "commune-common/definitions/interfaces";
import { Connection, sql } from "@databases/pg"

export async function insertObject(db: Connection, aso: IObject): Promise<void> {
    await db.query(sql`INSERT INTO objects (data) VALUES (${aso})`)
}