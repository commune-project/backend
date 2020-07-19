export = {
    dbConnectOptions: process.env["DATABASE_URL"]? process.env["DATABASE_URL"] : {
        database: process.env["PGDATABASE"],
        user: process.env["PGUSER"],
        password: process.env["PGPASSWORD"],
        host: process.env["PGHOST"]
    },
    sessionKeys: ['YB85p1LTm8Wh+AlFsIvoVPQDxi2QDZAdl5']
}