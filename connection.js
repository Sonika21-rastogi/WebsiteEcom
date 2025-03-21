const mysql = require('mysql');

const conne = mysql.createConnection({
    'host':'localhost',
    'user':'root',
    'password':'',
    'database':'ecomm_db'
});

module.exports = conne;
