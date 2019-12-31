import React from 'react';

const Timer = ({ round, startTimer, timer }) => (
  <div id='timerWrapper'>
    <button 
      className={round === 'pre' ? '' : 'noHover'}
      id='start'
      onClick={startTimer}>{round === 'pre' && `Start round`}
    </button>
    <div id='timer'>{timer}</div>
  </div>
);

export default Timer;