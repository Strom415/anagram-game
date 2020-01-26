import React from 'react';

const EntryForm = ({ addEntry, entry, handleChange, round }) => (
  <div>
    {round !== 'pre' && <form id='entryForm'>
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
        Add
      </button>
    </form>}
  </div>
);

export default EntryForm;