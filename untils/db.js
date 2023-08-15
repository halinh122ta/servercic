const mysql = require('mysql');
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'appload'
});
dbConn.connect()
module.exports = {
    dbConn
}