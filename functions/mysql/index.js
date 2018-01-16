const mysql = require('mysql2')

export default async function query({sql, params}) {
  try {
    const connection = connect()
    const [rows, fields] = await connection.execute(sql, ...params)
    return {rows, fields}
  } catch (err) {
    return { error: err.toString() }
  }
}

let _connection

function connect() {
  if (_connection) return false
  _connection = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}