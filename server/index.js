const express = require('express');
const path = require('path');
const wd = require('word-definition');
const db = require('../db/index.js');
const app = express();
const port = process.env.PORT || 3087;
const dictionary = new db.Dictionary('./db/dictionary-max-9.txt');

app.use(express.static(path.resolve(__dirname, '../public/dist')));

app.get('/anagrams/', (req, res) => {
  db.findEnglishAnagrams(req.query.letters, dictionary, (anagrams) => res.end(JSON.stringify(anagrams)));
});

app.get('/definition/', (req, res) => {
  wd.getDef(req.query.word, 'en', null, def => res.end(JSON.stringify(def)));
});

app.listen(port, console.log(`listening on port ${port}`));
