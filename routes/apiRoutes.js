const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

//read and write to the db.json file
const readAndWriteFile = (file, data, res) => {
  fs.writeFile(file, JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error writing to file' });
    }
    res.json(data);
  });
};

router.get('/notes', (req, res) => {
  fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading notes data' });
    }
    res.json(JSON.parse(data));
  });
});

// POST Route for a new note
router.post('/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = Math.floor(Math.random() * 1000000).toString();

  fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading notes data' });
    }
    const notes = JSON.parse(data);
    notes.push(newNote);
    readAndWriteFile(path.join(__dirname, '../db/db.json'), notes, res);
  });
});

// DELETE Route 
router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading notes data' });
    }
    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== noteId);
    readAndWriteFile(path.join(__dirname, '../db/db.json'), notes, res);
  });
});

module.exports = router;
