import React from 'react';
import axios from 'axios';
import AnagramBoard from './AnagramBoard';
import AnagramNavBar from './AnagramNavBar';
import DefinitionBar from './DefinitionBar';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import GameBoard from './GameBoard';
import HighScores from './HighScores';
import HowToPlay from './HowToPlay';
import NavBar from './NavBar';
import NameEntry from './NameEntry'
import ScoreBar from './ScoreBar'
import letterPools from '../letterPools.js';
import mwkey from '../mwkey.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeAnagram: '',
      activeTab: 2,
      anagrams: {},
      dictionaryData: { definition: `Click on a word to see it's definition` },
      entry: '',
      highscores: [],
      entries: [],
      letters: [],
      longest: '',
      round: 'pre',
      score: 0,
      showHighScores: false,
      showHowToPlay: false,
      showNameEntry: false,
      timer: 6,
      updateId: undefined,
      username: '',
    };
  }

  componentDidMount = () => {
    this.getHighScores();
  }

  // NETWORK REQUESTS
  getAnagrams = letters => 
    axios.get('/anagrams', { params: { letters: letters.join('').toLowerCase() } })
      .then(res => this.setState({ anagrams: res.data }));
  

  getDefinition = e => {
    const word = e.target.textContent;
    axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${mwkey}`)
      .then(res => this.parseMWData(res, word));
  }

  getFallbackDefinition = word =>
    axios.get('/definition', { params: { word } })
      .then(res => this.parseWikiData(res));

  getHighScores = () =>
    axios.get('/highscores')
      .then(res => this.setState({ highscores: res.data.rows.sort(this.sortScores).reverse() }, () => { console.log(this.state.highscores) }));


  updateScore = entry => {
    // const { score, username } = this.state;
    // this.setState({ showNameEntry: false, showHighScores: true })
    axios.post('/updatescore', entry)
      .then(res => this.getHighScores());
    // e.preventDefault();
  }

  insertScore = entry => {
     axios.post('/insertscore', entry)
      .then(res => this.getHighScores());
  }
  
  // DEFINITION PARSING
  parseMWData = (res, word) => {
    if (res.data[0].shortdef && res.data[0].shortdef.length) {
      const { meta, fl, shortdef } = res.data[0];
      let definition = shortdef[0].slice(0, 210);
      if (definition.length === 210) definition = definition + '...';
      word = meta.id.split(':')[0];
      this.setState({ dictionaryData: { category: fl, definition, word } });
    } else {
      this.getFallbackDefinition(word);
    }
  }

  parseWikiData = res => {
    let { category, definition, word } = res.data;
    definition = definition === undefined ? `no definition found` : definition.slice(0, 210);
    if (definition.length === 210) definition = definition + `...`;
    if (word === `English` && res.config.params.word !== `English`) {
      definition = `no definition found`;
      category = ``;
      word = res.config.params.word;
    }
    this.setState({ dictionaryData: { category, definition, word } });
  }

  // GAME STATE
  handleStart = () => {
    if (this.state.round === 'pre') {
      const letters = this.generateLetters();
      this.setState( { round: 'active' });
      this.cycleLetters(letters, 20);
      this.getAnagrams(letters);
      this.focusInput();
    }
  }

  handleEnd = () => {
    clearInterval(this.intervalId);
    this.checkEntries();
    this.setActiveTab();
    this.setState({ round: 'post', entry: '' }, this.focusBoard);
  }

  reset = () => {
    clearInterval(this.intervalId);
    this.setState({
      round: 'pre',
      anagrams: {},
      dictionaryData: { definition: `Click on a word to see it's definition` },
      entries: [],
      letters: [],
      timer: 60,
    });
  }

  // TIMER
  tick = () => {
    const { timer } = this.state;
    if (timer === 1) this.handleEnd();
    this.setState({ timer: timer - 1 });
  }

  startTimer = () => this.intervalId = setInterval(this.tick, 1000);

  // LETTER GENERATION
  generateLetters = () => {
    let letters = [];

    while (letters.length < 9) {
      const count = this.countConsAndVows(letters)
      const type = Math.random() > .55 ? 'vowel' : 'consonant';
      if (!(count.vows === 5 && type === 'vowel') && 
          !(count.cons === 6 && type === 'consonant')) {
        const pool = type === 'vowel' ? letterPools.pools.vows : letterPools.pools.cons;
        letters = letters.concat(pool[Math.floor(Math.random() * pool.length)]);
      }
    }
    return letters;
  }

  cycleLetters = (letters, n, tempLetters) => {
    if (n > 0) {
      setTimeout(() => {
        const tempLetters = n === 1 ? letters : this.generateLetters();
        this.setState({ letters: tempLetters }, () => 
          { this.cycleLetters(letters, n - 1) });
      }, 20)
    } else {
      this.startTimer();
    }
  }

  countConsAndVows = (letters) => {
    const count = { vows: 0, cons: 0 };
    letters.forEach(letter => letterPools.weights.vows[letter] ? count.vows += 1 : count.cons +=1);
    return count;
  }
  
  // USER ENTRY
  focusInput = () => document.getElementById('input').focus();

  handleChange = e => this.setState({ entry: e.target.value });

  handleUserNameChange = e => this.setState({ username: e.target.value });

  addEntry = e => {
    let { entries, entry, round } = this.state;
    e.preventDefault();

    if (round === 'active') {
      entries = [{ word: entry.toLowerCase(), class: 'correct' }].concat(entries);
      this.setState({ entries, entry: '' });
    }
  }

  // ANAGRAM BOARD
  handleAnagramClick = e => {
    this.targetAnagram(e);
    this.getDefinition(e);
  }

  setActiveTab = () => {
    const { anagrams } = this.state;
    for (let i = 9; i >= 2; i--) {
      if (anagrams[i].length) {
        this.setState({ activeTab: i });
        return;
      }
    }
  }

  focusBoard = () => document.getElementById('anagramContainer').focus()

  targetAnagram = e => this.setState({ activeAnagram: e.target.textContent })

  displayTab = e => {
    if (!e.target.className.split(' ').includes('empty')) {
      this.setState({ activeTab: e.target.id[3] });
    }
  }

  switchTab = (e) => {
    let { activeTab, anagrams } = this.state;
    if (e.key === 'ArrowLeft' && activeTab > 2 && anagrams[activeTab - 1].length) {
      activeTab -= 1;
    }
    if (e.key === 'ArrowRight' && activeTab < 9 && anagrams[activeTab + 1].length) {
      activeTab += 1;
    }
    this.setState({ activeTab });
  }

  // SCORING
  checkEntries = () => {
    const { anagrams } = this.state;
    let { entries } = this.state;

    entries = entries.map(entry =>
      anagrams[entry.word.length] && anagrams[entry.word.length].includes(entry.word) ?
        { class: 'correct', word: entry.word } :
        { class: 'incorrect', word: entry.word });

    this.setState({ entries }, () => { 
      this.scoreRound();
      this.getLongestWord();
    });
  }

  getLongestWord = () => {
    const { entries } = this.state;
    const longest = entries
      .filter(entry => entry.class === 'correct')
      .sort((a, b) => b.word.length - a.word.length)[0];
    this.setState({ longest });
  }

  scoreRound = () => {
    let score = 0;
    let validWords = new Set();
    const pointSystem = {
      2: 0,
      3: 1,
      4: 1,
      5: 2,
      6: 3,
      7: 5,
      8: 11,
      9: 18,
    }
    
    this.state.entries.forEach(entry => {
      if (entry.class === 'correct') {
        if (!validWords.has(entry.word)) score += pointSystem[entry.word.length];
        validWords.add(entry.word);
      }
    });

    this.setState({ score }, this.isHighScore);
  }

  // LEADERBOARD
  focusUsernameEntry = () => {
    console.log('name input focused');
    console.log('input is', document.getElementById('nameInput'))
    document.getElementById('nameInput').focus();
  }

  isHighScore = () => {
    let { highscores, score } = this.state;
    const date = new Date().getTime();

    if (highscores.length < 10) {
      this.setState({ showNameEntry: true }, this.focusUsernameEntry);
      return;
    }

    highscores = highscores.concat({ score, date }).sort(this.sortScores);

    if (highscores[0].id !== undefined)
      this.setState({ showNameEntry: true, updateId: highscores[0].id }, this.focusUsernameEntry);

    console.log(highscores)
  }

  sortScores = (a, b) => {
      if (a.score > b.score) return 1;
      if (a.score < b.score) return -1;

      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
  }

  updateDatabase = e => {
    e.preventDefault();
    if (this.state.username.length > 0) {
      const { updateId } = this.state;
      const entry = this.makeDatabaseEntry(updateId);

      if (updateId) this.updateScore(entry);
      else this.insertScore(entry);

      this.setState({ showNameEntry: false, showHighScores: true });
    }
  }

  makeDatabaseEntry = (id) => {
    const { longest, score, username} = this.state;
    return { id, score, name: username, longest, date: new Date().getTime() };
  }

  // CONDITIONAL RENDERING
  toggleHighScores = () => this.setState({ showHighScores: !this.state.showHighScores });
  
  toggleHowToPlay = () => this.setState({ showHowToPlay: !this.state.showHowToPlay });

  render() {
    const { addEntry, addLetter, updateDatabase, autofill, displayTab, handleAnagramClick, handleChange, handleUserNameChange, reset, handleStart, switchTab, toggleHighScores, toggleHowToPlay } = this;
    const { activeAnagram, activeTab, anagrams, dictionaryData, entries, entry, highscores, letters, showNameEntry, round, score, showHighScores, showHowToPlay, timer, username } = this.state;
    return (
      <div id='gameContainer'>
        <div id='upperContainer'>
          <NavBar
            reset={reset}
            round={round}
            toggleHighScores={toggleHighScores}
            toggleHowToPlay={toggleHowToPlay}
            handleStart={handleStart}
            timer={timer} />
          <GameBoard
            letters={letters} />
          <HowToPlay 
            showHowToPlay={showHowToPlay}
            toggleHowToPlay={toggleHowToPlay} />
          <HighScores 
            highscores={highscores}
            showHighScores={showHighScores}
            toggleHighScores={toggleHighScores}/>
          <NameEntry
            updateDatabase={updateDatabase}
            showNameEntry={showNameEntry}
            handleUserNameChange={handleUserNameChange}
            username={username} />
        </div>
        <div id='middleContainer'>
          {round === 'post' && 
            <ScoreBar 
              score={score} />}
          {round === 'post' &&
            <DefinitionBar
              dictionaryData={dictionaryData} />}
        </div>
        <div id='bottomContainer'>
          <div id='entryContainer'>
            <EntryForm
              addEntry={addEntry}
              entry={entry}
              handleChange={handleChange}
              round={round} />
            <EntryList
              entries={entries} />
          </div>
          {round === 'post' &&
            <div id='anagramContainer' onKeyDown={switchTab} tabIndex='0'>
              <AnagramNavBar
                activeTab={activeTab}
                anagrams={anagrams}
                displayTab={displayTab} />
              <AnagramBoard
                activeAnagram={activeAnagram}
                activeTab={activeTab}
                anagrams={anagrams}
                handleAnagramClick={handleAnagramClick} />
            </div>}
        </div>
      </div>
    );
  }
}

export default App;
