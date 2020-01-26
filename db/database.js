const { Client } = require('pg');
const client = new Client({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "anagrams",
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

client.query(`CREATE TABLE highscores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20),
  score SMALLINT,
  longest VARCHAR(9),
  date BIGINT
)`, () => console.log('highscore table created'));

const showTable = (sendData) => {
  client.query('SELECT * from highscores', (err, result) => {         
    sendData(result)
  });
}

const insertScore = (data, sendData) => {
  console.log('score inserted')
  client.query(`INSERT INTO highscores (name, score, longest, date) VALUES('${data.name}', ${data.score}, '${data.longest.word}', ${data.date})`, () => {
    sendData('response')
  });
}

const updateScore = (data, sendData) => {
  client.query(`UPDATE highscores
    SET name = '${data.name}',
        score = ${data.score},
        longest = '${data.longest.word}',
        date = ${data.date}
    WHERE id = ${data.id}`,
    () => { sendData('score updated') });
}

module.exports.showTable = showTable;
module.exports.insertScore = insertScore;
module.exports.updateScore = updateScore;