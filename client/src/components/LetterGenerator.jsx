import React from 'react';

const buttons = { vowel: 'Vowel', consonant: 'Consonant', fillBoard: 'Autopick' }

const LetterGenerator = ({ addLetter, autofill, round }) => (
  <div id='letterGenerator'>
    <div
      className='lgButton'
      id='addLetterTab'>Add
    </div>
    {
      Object.keys(buttons).map((key, i) =>
        <button
          className={`lgButton ${round === 'pre' ? '' : 'noHover'}`}
          id={key}
          key={i}
          onClick={key === 'fillBoard' ? autofill : addLetter}>
          {buttons[key]}
        </button>)
    }
  </div>
);



export default LetterGenerator;