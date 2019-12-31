import React from 'react';

const DefinitionBar = ({ dictionaryData }) => (
  <div id='dictionaryData'>
    <span id='word'>{dictionaryData.word}</span>
    <span id='category'>{dictionaryData.category}</span>
    <span id='definition'>{dictionaryData.definition}</span>
  </div>
);

export default DefinitionBar;
