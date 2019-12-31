import React from 'react';

const NavBar = ({ reset }) => (
  <div>
    <button className='navBar' id='newGame' onClick={reset}>New game</button>
  </div>
);

export default NavBar;