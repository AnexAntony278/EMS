const db = require('../config/db_config');

const isValidUser = (email, password) => {
    try {
        const query = 'SELECT * from users where email= ? AND password_hash= ? ;';
        db.query(query, [email, password], (error, results, fields) => {
            if (results.length === 0) {
                return false
            } else return true;
        });
    } catch (err) {
        console.error('Database query error:', err);
        return false;
    }
};

module.exports.isValidUser = isValidUser;
