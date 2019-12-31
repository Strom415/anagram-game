import React from 'react';

const EntryForm = ({ addEntry, entry, handleChange, round }) => (
  <form id='entryForm'>
    <input
      autoComplete='off'
      disabled={round === 'post' ? 'disabled' : ''}
      id='input'
      onChange={handleChange}
      type='text'
      value={entry}
    />
    <button
      className={round === 'post' ? 'noHover' : ''}
      id='addEntry'
      onClick={addEntry}>
    </button>
  </form>
);

export default EntryForm;