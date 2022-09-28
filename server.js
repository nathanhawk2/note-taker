// setting up global variables
const express = require('express');
const path = require('path');
const fs = require('fs');
const { readAndAppend, readFromFile, writeToFile } = require('./utils/fsUtils');
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
    const { title, text, noteId } = req.body;
    console.log(req.body)

    if (req.body) {
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            id: Math.floor(Math.random() * 200),
        };
        readAndAppend(newNote, './db/db.json');
        res.json('Note added succesfully!');
    } else {
        res.json('Did not add note');
    };
});

// existing note shown function
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'))
    db = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))
    res.json(db)
});

// goes back to homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// write icon button going back to blank note function
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/assets/notes.html'))
});

// delete note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((notes) => notes.id !== noteId);
            writeToFile('./db/db.json', result);
            res.json(`Note ${noteId} has been deleted`)
        });
});

app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
});