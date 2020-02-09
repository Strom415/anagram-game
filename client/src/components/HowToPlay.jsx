import React from 'react';

const scoringKey = [[2, 0], [3, 1], [4, 1], [5, 2], [6, 3], [7, 5], [8, 11], [9, 18]];

const HowToPlay = ({ showHowToPlay, toggleHowToPlay }) => (
  <div className={showHowToPlay ? 'modal' : 'hideModal'} onClick={toggleHowToPlay}>
    <div className='modalHowToPlay'>
      <h1>You're given 9 letters</h1>
      <h1>Find as many English words as you can in 60 seconds</h1>
      <p className={'rules'}>No letter may be used more often than it appears on the board</p>
      <h1 id='scoringHeader'>Scoring</h1>
      <table className='scoringTable'>
        <tbody>
          <tr>
            <th className={'wordLengthHeader'}>word length</th>
            <th></th>
            <th className={'scoreHeader'}>points</th>
          </tr>
          {
            scoringKey.map((pair, i) => (
              <tr key={i}>
                <td className={'wordLengthCol'}>{pair[0]}</td>
                <td>-</td>
                <td className={'scoreCol'}>{pair[1]}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <span id='word'>anagram</span>
      <span id='category'>noun</span>
      <span id='definition'>a word made by transposing the letters of another word</span>
    </div>
  </div>
);

export default HowToPlay;
