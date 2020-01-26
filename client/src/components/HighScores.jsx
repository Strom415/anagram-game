import React from 'react';

const columns = ['name', 'score', 'longest']

const HighScores = ({ highscores, showHighScores, toggleHighScores }) => (
  <div className={showHighScores ? 'modal' : 'hideModal'} onClick={toggleHighScores}>
    <div className='modalHighScores'>
      <table>
        <tbody>
          <tr className='highScoreTableHeader'>
            <th className='rankHeader'></th>
            <th className='nameHeader'>Name</th>
            <th className='scoreHeader'>Score</th>
            <th className='longestWordHeader'>Longest word</th>
          </tr>
          {
            highscores.map((row, i) => (
              <tr className={'row' + i} key={i}>
                <td className={'rank highScoreRow'}>{i + 1}</td>
                {
                  columns.map((col, i) => (
                    <td className={`${col} highScoreRow`} key={i}>{row[col]}</td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  </div>
);

export default HighScores;