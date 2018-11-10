// Set up MySQL connection
var mysql = require('mysql')
var connection
// is this supposed to use the JAWSDB_URL????
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL)
} else {
  connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'beer-tinder'
  })
};

// Make connection
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack)
    return
  }
  console.log('connected as id' + connection.threadId)
})

// Export connection for ORM to use
module.exports = connection
