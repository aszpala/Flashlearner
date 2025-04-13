const db = require('../database/db.js');

function checkPassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

function checkEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

async function checkUserExists(username, email) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE username = ? OR email = ?`;
        db.get(query, [username, email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(!!row);
            }
        });
    });
}

module.exports = { checkPassword, checkUserExists,checkEmail };