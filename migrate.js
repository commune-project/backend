const connect = require("@databases/pg")
const db = connect(process.env["DATABASE_URL"])

const fs = require("fs")
const sql = fs.readFileSync("database.sql").toString()

db.query(connect.sql(sql)).then(()=>{
    console.error("migrated")
}).catch((err) => {
    console.error(err)
})
