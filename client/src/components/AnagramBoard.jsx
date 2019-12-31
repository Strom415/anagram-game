import React from 'react';

const AnagramBoard = ({ activeAnagram, activeTab, anagrams, handleAnagramClick }) => (
  <div id='anagramBoard'>
    {
      anagrams[activeTab].map((anagram, i) =>
        <div
          className={`anagram ${anagram == activeAnagram ? 'activeAnagram' : ''}`}
          key={i}
          onClick={handleAnagramClick}>
          {anagram}
        </div>)
    }
  </div>
);

export default AnagramBoard;