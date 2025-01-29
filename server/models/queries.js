const db = require('../config/db_config.js')
const bcrypt = require('bcrypt')

const isValid = async (email, password) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Users WHERE email = ?;', [email], (error, results) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            if (results.length === 0) return resolve(false);

            const user = results[0];
            bcrypt.compare(password, user.password_hash, (err, isMatch) => {
                if (err) return reject(err);
                resolve(isMatch);
            });
        });
    });
};
const signUser = async (name, email, password, role) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO Users(name,email,password_hash,role) VALUES(?,?,?,?);',
                [name, email, passwordHash, role],
                (error, results) => {
                    if (error) {
                        console.log(error);
                        return reject(false);
                    }
                    resolve(true);
                });
        });
    } catch (error) {
        console.log(error);
        return false;
    }
};
module.exports = { isValid, signUser };