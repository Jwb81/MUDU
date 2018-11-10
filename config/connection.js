const mysql = require('mysql');
const setup = require('./setup');

let connection;

if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(JAWSDB_URL);
} else {
    connection = mysql.createConnection(setup.localDB);
}

connection.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }

    console.log(`Connected to db with id: ${connection.threadId}`)
})

module.exports = connection;