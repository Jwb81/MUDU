const mysql = require('mysql');

let connection;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL)
} else {
  const setup = require('./setup');
  connection = mysql.createConnection(setup.localDB);
}

// // Make connection
// connection.connect(function (err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack)
//     return
//   }
//   console.log('connected as id' + connection.threadId)
// })

// Export connection for ORM to use
module.exports = connection;