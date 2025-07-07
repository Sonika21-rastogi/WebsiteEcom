const mysql = require('mysql');

const conne = mysql.createConnection({
    'host':process.env.HOST,
    'user':process.env.USER,
    'password':process.env.PASSWORD,
    'database':process.env.DATABEASE,
});

module.exports = conne;
