const { createPool } = require("mysql2/promise")

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "daranhu1_app",
})

// const pool = createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: 'users'
// })

module.exports = pool
