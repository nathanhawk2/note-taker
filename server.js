const express = require('express');
const path = require('path');
const fs = require('fs');
const { readAndAppend, readFromFile } = require('./utils/fsUtils');
const { parse } = require('path');

const app = express();
const PORT = process.env.any || 3001;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    readFromFile('db/db.json', 'utf8')
    .then((notes) => {
        let parsedNotes;
        try {
            parsedNotes = [].concat(JSON.parse(notes));
        } catch (err) {
            parsedNotes = [];
        }
        return parsedNotes;
    })
    .then((notes) => { return res.json(notes)})
    .catch ((err) => res.status(500).json(err))
});



app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
});