const mysql = require('mysql');
var dbConn = mysql.createConnection({
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6639966',
    password: 'KEhDT2nnJz',
    database: 'sql6639966'
});
dbConn.connect()
module.exports = {
    dbConn
}