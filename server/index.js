const express = require('express');
const path = require('path');
const wd = require('word-definition');
const db = require('../db/index.js');
const hs = require('../db/database.js');
const app = express();
const port = process.env.PORT || 3090;
const dictionary = new db.Dictionary('./db/dictionary-max-9.txt');

app.use(express.static(path.resolve(__dirname, '../public/dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/anagrams/', (req, res) => {
  db.findEnglishAnagrams(req.query.letters, dictionary, (anagrams) => res.end(JSON.stringify(anagrams)));
});

app.get('/definition/', (req, res) => {
  wd.getDef(req.query.word, 'en', null, def => res.end(JSON.stringify(def)));
});

app.get('/highscores', (req, res) => {
  hs.showTable(scores => res.end(JSON.stringify(scores)));
});

app.post('/insertscore', (req, res) => {
  console.log('score', req.body);
  hs.insertScore(req.body, () => res.end());
});

app.post('/updatescore', (req, res) => {
  console.log('score', req.body);
  hs.updateScore(req.body, () => res.end());
});

app.listen(port, console.log(`listening on port ${port}`));
