import React from 'react';
import Timer from './Timer'

const NavBar = ({ reset, round, handleStart, timer, toggleHighScores, toggleHowToPlay }) => (
  <div>
    <button className='navBarButton' id='howItWorks' onClick={toggleHowToPlay}>How to play</button>
    <Timer reset={reset} round={round} handleStart={handleStart} timer={timer} />
    <button className='navBarButton' id='highScores' onClick={toggleHighScores}>Leaderboard</button>
  </div>
);

export default NavBar;