var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {checkPassword, checkEmail, checkUserExists} = require("./validation");
const { ACCESS_TOKEN_SECRET } = process.env;


// --------- LOGIN --------- //
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = ?`;
  db.get(query, [username], (err, row) => {

    if (err) {
      console.error('Błąd bazy:', err);
      return res.status(500).send('Błąd bazy');}

    if (!row) {
      return res.status(401).send('Zły login lub hasło');}


    const isBecrypt = row.password.startsWith('$2a$'); //prefix becrypta
    if (isBecrypt) {
          if (!bcrypt.compareSync(password, row.password)) { return res.status(401).send('Zły login lub hasło'); }
    }else {
          if (password !== row.password)                   { return res.status(401).send('Zły login lub hasło'); }
    }

    const token = jwt.sign({ user_id: row.id, username: row.username }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, userId: row.id });

  });
});

// --------- REGISTER --------- //
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!checkPassword(password)) {
    return res.status(400).send('Hasło ma mieć litere znak specjalny i cyfrę oraz składać się z 8+ znaków !');}

  if (!checkEmail(email)) {
    return res.status(400).send('Zła składania maila');}

  try {
    const userExists = await checkUserExists(username, email);

    if (userExists) {
      return res.status(400).send('Taki użytkownik już jest w bazie.'); }

    const hashedPassword = bcrypt.hashSync(password, 10); //becrypt


    const query = `INSERT INTO users (username, email, password, type) VALUES (?, ?, ?, 'user')`;
    db.run(query, [username, email, hashedPassword], function(err) {

      if (err) {  res.status(500).send('Błąd bazy');              }
      else     {  res.status(201).send('Rejestracja się powiodła!');}

    });
  } catch (err)
  {  res.status(500).send('Błąd bazy');  }
});


// --------- GET USER BY USERNAME --------- //
router.get('/api/users/:username', (req, res) => {
  const { username } = req.params;
  const query = `SELECT username, email FROM users WHERE username = ?`;

  db.get(query, [username], (err, row) => {

    if (err)      {  res.status(500).send('Błąd bazy');}
    else if (row) {  res.status(200).json(row);                   }
    else          {  res.status(404).send('Brak usera');}

  });
});

// --------- GET USER BY ID --------- //
router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM users WHERE id = ?`;

  db.get(query, [id], (err, row) => {

    if (err) {      res.status(500).send('Błąd bazy'); }
    else if (row) { res.status(200).json(row);                    }
    else {          res.status(404).send('Brak usera'); }

  });
});

// --------- GIVE USER POINTS --------- //
router.post('/:id/points', (req, res) => {
  //const { setId } = req.params;
  const { points, userId, total, lastUpdated ,setId} = req.body;

  const selectQuery = `SELECT * FROM user_sets WHERE user_id = ? AND set_id = ?`;
  const insertQuery = `INSERT INTO user_sets (user_id, set_id, points, total, last_updated) VALUES (?, ?, ?, ?, ?)`;
  const updateQuery = `UPDATE user_sets SET points = ?, total = ?, last_updated = ? WHERE user_id = ? AND set_id = ?`;

  db.get(selectQuery, [userId, setId], (err, row) => {

    if (err) {return res.status(500).send('Błąd bazy'); }
    if (row) {
      db.run(updateQuery, [points, total, lastUpdated, userId, setId], function(err) {

        if (err) {  res.status(500).send('Błąd bazy');        }
        else     {  res.status(200).send('Punkty przyznane'); }

      });
    } else {
      db.run(insertQuery, [userId, setId, points, total, lastUpdated], function(err) {

        if (err) {res.status(500).send('Błąd bazy');}
        else {res.status(201).send('Punkty przyznane');}

      });
    }
  });
});

// --------- GET USERS POINTS --------- //
router.get('/:id/getpoints', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM user_sets WHERE user_id = ?`;

  db.all(query, [id], (err, rows) => {

    if (err) { return res.status(500).send('Błąd bazy'); }
    if (rows.length === 0) {return res.status(404).send('Brak setow dla tego usera');}

    res.status(200).json(rows);
  });
});


// --------- GET USERS SETS --------- //
router.get('/userssets/:id', (req, res) => {
  const { id } = req.params;
  const userQuery = `SELECT * FROM users WHERE id = ?`;
  const setsQuery = `SELECT * FROM sets WHERE user_id = ?`;

  db.get(userQuery, [id], (err, userRow) => {

    if (err)      {  res.status(500).send('Błąd bazy');    return;   }
    if (!userRow) {  res.status(404).send('Brak usera');   return;   }

    db.all(setsQuery, [id], (err, setsRows) => {

      if (err) {  res.status(500).send('Błąd bazy');   return;   }

      res.status(200).json({ user: userRow, sets: setsRows });

    });
  });
});

module.exports = router;

