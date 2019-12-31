import React from 'react';

const EntryList = ({ entries }) => (
  <div id='entryList'>
    {entries.map((entry, i) => <div className={entry.class} key={i}>{entry.word}</div>)}
  </div>
);

export default EntryList;