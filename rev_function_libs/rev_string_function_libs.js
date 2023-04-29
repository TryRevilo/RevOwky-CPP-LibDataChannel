import {LoremIpsum} from 'lorem-ipsum';

import {revGetRandInteger} from './rev_gen_helper_functions';

export function revRemoveLinebreaks(revStr) {
  return revStr.replace(/(\r\n|\n|\r)/gm, '');
}

export const revGenLoreumIpsumText = ({
  revMinWordsPerSentence = 7,
  revMaxWordsPerSentence = 100,
  revMinSentences = 1,
  revMaxSentences = 1,
}) => {
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: revMaxSentences,
      min: revMinSentences,
    },
    wordsPerSentence: {
      max: revGetRandInteger(revMinWordsPerSentence, revMaxWordsPerSentence),
      min: revGetRandInteger(1, revMinWordsPerSentence),
    },
  });

  return lorem.generateSentences(revGetRandInteger(1, 5));
};

export const revGenRandString = revLength => {
  let revResult = '';
  let revCharacters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=\\|,<.>/?';
  let revCharactersLength = revCharacters.length;
  for (let i = 0; i < revLength; i++) {
    revResult += revCharacters.charAt(
      Math.floor(Math.random() * revCharactersLength),
    );
  }

  return revResult;
};

export const revIsStringEqual = (revString1, revString2) => {
  return revString1 && revString2 && revString1.localeCompare(revString2) == 0;
};

export const revRemoveAllWhiteSpaces = revStr => {
  if (!revStr) {
    return '';
  }

  revStr = revStr.replace(/\s/g, '');
  return revStr;
};

export const revStringEmpty = revString => {
  return (
    !revString || !revString.length || revRemoveAllWhiteSpaces(revString) == ''
  );
};

export const revRemoveLineBreaks = revHTMLString => {
  if (!revHTMLString) {
    return '';
  }

  revHTMLString = revHTMLString.replace(/<p>/g, ' ');
  revHTMLString = revHTMLString.replace(/<br>/g, ' ');
  revHTMLString = revHTMLString.replace(/<\/p>/g, ' ');

  revHTMLString = revHTMLString.replace(/  /g, ' ');

  return revHTMLString;
};

export const revEscapeHtml = revUnsafe => {
  return revUnsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const revIsEmptyHTML = revHTMLString => {
  if (!revHTMLString) {
    return true;
  }

  revHTMLString = revHTMLString.replace(/(\r\n|\n|\r)/gm, '');

  revHTMLString = revHTMLString.replace(/<p>/g, '');
  revHTMLString = revHTMLString.replace(/<br>/g, '');
  revHTMLString = revHTMLString.replace(/<\/p>/g, '');

  return (
    !revHTMLString || !revHTMLString.length || revStringEmpty(revHTMLString)
  );
};

export const revTruncateString = (revStr, revLen, revIncludeHellipse) => {
  if (revStringEmpty(revStr)) {
    return '';
  }

  let revHellipse = ' . . .';

  if (revIncludeHellipse == false) {
    revHellipse = '';
  }

  return revStr.length > revLen
    ? revStr.substr(0, revLen - 1) + revHellipse
    : revStr;
};

export const revGetRawHTML = revStr => {
  revStr = revStr.replace(/&/gi, '&amp;');
  revStr = revStr.replace(/</gi, '&lt;');

  return revStr;
};
