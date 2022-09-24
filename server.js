// setting up global variables
const express = require('express');
const path = require('path');
const fs = require('fs');
const { readAndAppend, readFromFile } = require('./utils/fsUtils');
const { parse } = require('path');
// const noteNew = require('express').Router();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.port || 3001;


app.use(express.static('public'));

// landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// command to show notes on left hand side of screen
app.get('/api/notes', (req, res) => {
    readFromFile('db/db.json', 'utf8')
        .then((notes) => {
            let leftNotes;
            try {
                leftNotes = [].concat(JSON.parse(notes));
            } catch (err) {
                leftNotes = [];
            }
            return leftNotes;
        })
        .then((notes) => { return res.json(notes) })
        .catch((err) => res.status(500).json(err))
});

// save button
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    console.log(req.body)

    if (req.body) {
        const newNote = {
            title,
            text,
        };
        readAndAppend(newNote, './db/db.json');
        res.json('Note added succesfully!');
    } else {
        res.json('Did not add note');
    };
});

// existing note shown function
app.get('/api/notes', (req, res) => {

});

// write icon button going back to blank note function
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/assets/notes.html'))
});


app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
});