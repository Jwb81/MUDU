const mysql = require('mysql');
let connection;

if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(JAWSDB_URL);
} else {
    connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'beer_tinder'
    });
}

connection.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }

    console.log(`Connected to db with id: ${connection.threadId}`)
})

module.exports = connection;