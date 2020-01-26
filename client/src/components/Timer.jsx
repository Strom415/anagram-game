import React from 'react';

const Timer = ({ round, handleStart, reset, timer }) => (
  <div id='timerWrapper'>
    <button 
      className={round === 'active' ? 'noHover' : ''}
      id='start'
      onClick={round === 'pre' && handleStart || reset}>{round === 'pre' && `Play` || round === 'post' && `New Game`}
    </button>
    <div id='timer'>{timer}</div>
  </div>
);

export default Timer;