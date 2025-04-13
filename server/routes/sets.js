var express = require('express');
var router = express.Router();
const db = require('../database/db.js');


// --------- GET PUBLIC SETS --------- //
router.get('/sets/public', async function (req, res) {
    try {
        const query = 'SELECT * FROM sets WHERE status = \'public\'';
        db.all(query, [], (err, rows) => {

            if(err)             {  res.status(500).send('Bład baza');  return; }
            if(rows.length===0) {  console.log('Brak setów');                             }

            res.status(200).json(rows);
        });
    } catch (err)
    { res.status(500).send('Błąd'); }
});


// --------- GET FLASHCARDS FROM SET --------- //
router.get('/list/:setId', async function (req, res) {
    const { setId } = req.params;
    try {
        const setQuery = 'SELECT * FROM sets WHERE id = ?';

        db.get(setQuery, [setId], (err, setRow) => {   //db.get pojedynczy rekord a db.all wiele

            if (err)     {  res.status(500).send('Błąd bazy');          return; }
            if (!setRow) {  res.status(404).send('Brak takiego setu');  return; }

            const flashcardsQuery = 'SELECT * FROM flashcards WHERE set_id = ?';

            db.all(flashcardsQuery, [setId], (err, flashcardsRows) => {

                if (err) {  res.status(500).send('Bład bazy');  return; }
                setRow.flashcards = flashcardsRows;
                res.status(200).json(setRow);

            });
        });
    } catch (err)
    {res.status(500).send('Błąd');}
});



// --------- ADD SET --------- //
router.post('/sets', async (req, res) => {
    const { setName, setLanguage, setTranslation, setStatus, user_id } = req.body;
    try {
        const query = 'INSERT INTO sets (name, language, translation, status, user_id) VALUES (?, ?, ?, ?, ?)';
        db.run(query, [setName, setLanguage, setTranslation, setStatus, user_id], function(err) {           //db.run do insert update delete zmiany bazy

            if (err) {  res.status(500).send('Błąd bazy');   return; }
            res.status(201).json({ setId: this.lastID });

        });
    } catch (err)
    { res.status(500).send('Błąd bazy'); }
});



// --------- DELETE SET IT'S FLASHCARDS AND POINTS --------- //
router.delete('/delete/set/:setId', async function (req, res) {
    const { setId } = req.params;
    try {
        const checkQuery = 'SELECT * FROM sets WHERE id = ?';
        db.get(checkQuery, [setId], (err, row) => {

            if (err)  {  res.status(500).send('Bład bazy');          return; }
            if (!row) {  res.status(404).send('Brak takiego setu');  return; }


            const deleteFlashcardsQuery = 'DELETE FROM flashcards WHERE set_id = ?';
            db.run(deleteFlashcardsQuery, [setId], function(err) {

                if (err) { res.status(500).send('Błąd bazy'); return;}


                const deleteUserSetsQuery = 'DELETE FROM user_sets WHERE set_id = ?';
                db.run(deleteUserSetsQuery, [setId], function(err) {

                    if (err) { res.status(500).send('Błąd bazy'); return; }


                    const deleteSetQuery = 'DELETE FROM sets WHERE id = ?';
                    db.run(deleteSetQuery, [setId], function(err) {

                        if (err) { res.status(500).send('Błąd bazy'); return; }
                        res.status(200).send('set usuniety');
                    });
                });
            });
        });
    } catch (err) {res.status(500).send('Błąd');}
});




// --------- ADD FLASHCARD --------- //
router.post('/flashcard/:setId', async (req, res) => {
    const { setId } = req.params;
    const { word, translation } = req.body;
    try {
        const query = 'INSERT INTO flashcards (set_id, word, translation) VALUES (?, ?, ?)';

        await db.run(query, [setId, word, translation]);

        res.status(201).send('Utworzono fiszke');
    } catch (err)
    { res.status(500).send('Błąd bazy'); }
});


// --------- DELETE FLASHCARD --------- //
router.delete('/delete/:flashcardId', async (req, res) => {
    const { flashcardId } = req.params;
    try {
        const query = 'DELETE FROM flashcards WHERE id = ?';
        db.run(query, [flashcardId], function(err) {

            if (err)              { res.status(500).send('Błąd bazy');  return;             }
            if (this.changes > 0) { res.status(200).send('Usunieto fiszke'); }
            else                  { res.status(404).send('Brak takiej fiszki');            }

        });
    } catch (err)
    {res.status(500).send('Błąd');}
});



module.exports = router;