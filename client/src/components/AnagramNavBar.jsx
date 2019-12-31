import React from 'react';

const AnagramNavBar = ({ activeTab, anagrams, displayTab }) => (
  <div id='anagramNavBar'>
    {
      Array.from(Array(8)).map((tabs, i) =>
        <div
          className={`anagramTab ${activeTab == i + 2 ? 'active' : ''} ${anagrams[i + 2].length ? '' : 'empty'}`}
          id={'tab' + (i + 2)}
          key={i}
          onClick={displayTab}>
          {i + 2}
        </div>)
    }
  </div>
);

export default AnagramNavBar;