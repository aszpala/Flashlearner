const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'data.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Błąd przy połączeniu z bazą danych:', err.message);
    } else {
        console.log('Połączono z bazą danych SQLite.');
    }
});




module.exports = db;