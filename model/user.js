const db = require('../untils/db')
const crypto = require('crypto');
function getUsers() {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT users.id,users.username,users.balance,users.role FROM users WHERE role=?',[1], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function login(username) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT * FROM users WHERE `username`=?',[username], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function register(username,password) {
    return new Promise((resolve, reject) => {
        var currentTime = new Date();
        
        var apikey = crypto.createHash('md5').update(username + currentTime + password + ".s").digest('hex')
        db.dbConn.query('INSERT INTO users (username,password,apikey,balance) VALUES (?,?,?,?)',[username,password,apikey,'0'], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function requireUser(id){
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT * FROM users WHERE `id`=?',[id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function updateUser(id,balance){
    return new Promise((resolve, reject) => {
        db.dbConn.query('UPDATE users SET balance = ? WHERE `id`=?',[balance,id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function updatePassUser(id,newpass){
    return new Promise((resolve, reject) => {
        db.dbConn.query('UPDATE users SET password = ? WHERE `id`=?',[newpass,id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function getUserApiKey(apikey) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT * FROM users WHERE apikey=?',[apikey], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function getUserApiKeyAdmin(apikey) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT * FROM users WHERE apikey=? AND role=?',[apikey,2], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function getUserApiKeyAdmin(apikey) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT * FROM users WHERE apikey=? AND role=?',[apikey,2], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
module.exports = {
    getUsers,
    login,
    register,
    requireUser,
    getUserApiKey,
    getUserApiKeyAdmin,
    updateUser,
    updatePassUser
}