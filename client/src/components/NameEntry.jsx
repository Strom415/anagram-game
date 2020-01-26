import React from 'react';

const NameEntry = ({ updateDatabase, handleUserNameChange, showNameEntry, username }) => (
  <div className={showNameEntry ? 'modal' : 'hideModal'}>
    <div className={'modalNameEntry'}>
      <h1 id='highScoreHeader'>High Score!</h1>
      <form>
        <span>name: </span>
        <input
          autoComplete='off'
          id='nameInput'
          maxLength='14'
          onChange={handleUserNameChange}
          type='text'
          value={username} />
        <button
          id='highScoreButton'
          onClick={updateDatabase}>
          OK
        </button>
      </form>
    </div>
  </div>
);

export default NameEntry;