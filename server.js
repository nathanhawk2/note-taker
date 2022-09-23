// setting up global variables
const express = require('express');
const path = require('path');
const fs = require('fs');
const { readAndAppend, readFromFile } = require('./utils/fsUtils');
const { parse } = require('path');

const app = express();
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
            let parsedNotes;
            try {
                parsedNotes = [].concat(JSON.parse(notes));
            } catch (err) {
                parsedNotes = [];
            }
            return parsedNotes;
        })
        .then((notes) => { return res.json(notes) })
        .catch((err) => res.status(500).json(err))
});

// save button
app.post('/api/notes', (req, res) => {
    const data = getData('/db/d.json');
    const providedTerm = req.body.term.toLowerCase();

    const found = data.find(item => item.term.toLowerCase() === providedTerm);

    if (!found) {
        data.push(req.body);
    }

    readAndAppend('/db/terms.json', JSON.stringify(data, null, 2));
    res.json(data);
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