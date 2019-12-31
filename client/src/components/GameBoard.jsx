import React from 'react';

const GameBoard = ({ letters }) => (
  <div id='gameBoard'>
    {
      Array.from(Array(9)).map((square, i) =>
        <div className='letterSquare' key={i}> 
          {letters[i]}
        </div>)
    }
  </div>
);

export default GameBoard;