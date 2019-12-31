import React from 'react';
import axios from 'axios';
import AnagramBoard from './AnagramBoard';
import AnagramNavBar from './AnagramNavBar';
import DefinitionBar from './DefinitionBar';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import GameBoard from './GameBoard';
import LetterGenerator from './LetterGenerator';
import NavBar from './NavBar';
import Timer from './Timer';
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
      entries: [],
      letters: [],
      round: 'pre',
      score: 0,
      timer: 12,
    };
  }

  //network requests
  getAnagrams = () => {
    const letters = this.state.letters.join('').toLowerCase();

    axios.get('/anagrams', { params: { letters } })
      .then(res => this.setState({ anagrams: res.data }), () => { console.log(this.state.anagrams) })
      .catch(err => console.log(err));
  }

  getDefinition = e => {
    const word = e.target.textContent;
    axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${mwkey}`)
      .then(res => this.parseMWData(res, word))
      .catch(err => console.log(err));
  }

  parseMWData = (res, word) => {
    if (res.data[0].shortdef && res.data[0].shortdef.length) {
      const { meta, fl, shortdef } = res.data[0];
      let definition = shortdef[0].slice(0, 210);
      if (definition.length === 210) definition = definition + '...';
      word = meta.id.split(':')[0];
      this.setState({ dictionaryData: { category: fl, definition, word } });
    } else {
      this.getWikiDefinition(word);
    }
  }

  getWikiDefinition = word => {
    axios.get('/definition', { params: { word } })
      .then(res => this.parseWikiData(res))
      .catch(err => console.log(err));
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

  // gameboard functions
  addLetter = (e, autofill) => {
    let { letters } = this.state;
    const count = this.countConsAndVows();
    
    if (letters.length < 9) {
      if (!(count.vows === 5 && e.target.id === 'vowel') && 
          !(count.cons === 6 && e.target.id === 'consonant')) {
        const pool = e.target.id === 'vowel' ? letterPools.pools.vows : letterPools.pools.cons;
        letters = letters.concat(pool[Math.floor(Math.random() * pool.length)]);
      }
      this.setState({ letters }, autofill);
    }
  }

  countConsAndVows = () => {
    const { letters } = this.state;
    const count = { vows: 0, cons: 0 };
    letters.forEach(letter => letterPools.weights.vows[letter] ? count.vows += 1 : count.cons +=1);
    return count;
  }

  autofill = () => {
    const type = Math.random() > .55 ? 'vowel' : 'consonant';
    this.addLetter({ target: { id: type } }, this.autofill);
  }

  // user entry functions
  handleChange = e => this.setState({ entry: e.target.value });

  addEntry = e => {
    let { entries, entry, round } = this.state;
    e.preventDefault();

    if (round === 'active') {
      entries = [{ word: entry.toLowerCase(), class: 'correct' }].concat(entries);
      this.setState({ entries, entry: '' });
    }
  }

  // scoring functions
  checkEntries = () => {
    const { anagrams } = this.state;
    let { entries } = this.state;

    entries = entries.map(entry =>
      anagrams[entry.word.length] && anagrams[entry.word.length].includes(entry.word) ?
        { class: 'correct', word: entry.word } :
        { class: 'incorrect', word: entry.word });

    this.setState({ entries }, this.scoreRound);
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

    this.setState({ score });
  }

  // anagram board functions
  handleAnagramClick = e => {
    this.targetAnagram(e);
    this.getDefinition(e);
  }

  setActiveTab = () => {
    const { anagrams } = this.state;
    for (let i = 9; i >=2; i--) {
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
    if (e.key === 'ArrowLeft' && activeTab > 2 && anagrams[activeTab - 1].length) activeTab -= 1;
    if (e.key === 'ArrowRight' && activeTab < 9 && anagrams[activeTab + 1].length) activeTab += 1;
    this.setState({ activeTab });
  }

  // timer functions
  focusInput = () => document.getElementById('input').focus()

  endRound = () => {
    clearInterval(this.intervalId);
    this.checkEntries();
    this.setActiveTab();
    this.setState({ round: 'post', entry: '' }, this.focusBoard);
  }

  tick = () => {
    const { timer } = this.state;
    if (timer === 1) this.endRound();
    this.setState({ timer: timer - 1 });
  }

  startTimer = () => {
    const { letters, round } = this.state;
    if (round === 'pre' && letters.length === 9) {
      this.focusInput();
      this.getAnagrams();
      this.intervalId = setInterval(this.tick, 1000);
      this.setState({ round: 'active' });
    }
  }

  reset = () => {
    clearInterval(this.intervalId);
    this.setState({
      round: 'pre',
      anagrams: {},
      definition: { definition: `Click on a word to see it's definition` },
      entries: [],
      letters: [],
      timer: 60,
    });
  }

  render() {
    const { addEntry, addLetter, autofill, displayTab, handleAnagramClick, handleChange, reset, startTimer, switchTab } = this;
    const { activeAnagram, activeTab, anagrams, dictionaryData, entries, entry, letters, round, timer } = this.state;
    return (
      <div id='gameContainer'>
        <div id='upperContainer'>
          <NavBar
            reset={reset} />
          <GameBoard
            letters={letters} />
          <LetterGenerator
            addLetter={addLetter}
            autofill={autofill}
            round={round} />
          <Timer
            round={round}
            startTimer={startTimer}
            timer={timer} />
        </div>
        <div id='middleContainer'>
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
