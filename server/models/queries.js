const db = require('../config/db_config.js')

const isValid = (email, password) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Users WHERE email = ? AND password_hash = ?;', [email, password], (error, results) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            resolve(results.length != 0);
        });
    });
};

module.exports = { isValid };