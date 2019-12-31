const fs = require('fs');

function Dictionary(file) {
  const words = fs.readFileSync(file, 'utf8').split('\n');
  words.forEach((word) => this[word.trim()] = 1);
}

const  findAnagrams = (dictionary, letters) => {
  const anagrams = new Set();

  const recurse = (ana, str) => {
    if (ana.length > 1 && dictionary[ana]) anagrams.add(ana);

    for (let i = 0; i < str.length; i++) {
      recurse(ana + str[i], str.slice(0, i) + str.slice(i + 1));
    }
  };

  recurse('', letters);

  return Array.from(anagrams);
};

const sortAnagrams = anagrams => {
  const sorted = {};
  anagrams = anagrams.sort();

  for (let i = 2; i <= 9; i++) { 
    sorted[i] = []; 
  }

  anagrams.forEach(anagram => sorted[anagram.length].push(anagram));
  return sorted;
};

const findEnglishAnagrams = (letters, dictionary, callback) => {
  const anagrams = findAnagrams(dictionary, letters);
  callback(sortAnagrams(anagrams));
};
  
module.exports.findEnglishAnagrams = findEnglishAnagrams;
module.exports.Dictionary = Dictionary;
