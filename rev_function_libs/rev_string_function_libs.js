import {LoremIpsum} from 'lorem-ipsum';

import {revGetRandInteger} from './rev_gen_helper_functions';

export function revRemoveLinebreaks(revStr) {
  return revStr.replace(/(\r\n|\n|\r)/gm, '');
}

export const revReplaceWiteSpaces = (revString, revReplacement) => {
  return revString.replace(/\s+/g, revReplacement);
};

export const revRemoveAllWhiteSpaces = revStr => {
  if (!revStr) {
    return '';
  }

  revStr = revStr.replace(/\s/g, '');
  return revStr;
};

export const revSplitStringToArray = revStr => {
  revStr = revRemoveLinebreaks(revStr);
  return revStr.split(/\s+/);
};

export const revConvertNumberToDecimal = num => {
  const str = num.toString();
  const length = str.length;
  let result = '';

  if (length <= 3) {
    // If the number has 3 digits or less, return the number itself
    result = str;
  } else if (length <= 6) {
    // If the number has 4 to 6 digits, convert it to thousands (K)
    result = str.substr(0, length - 3) + '.' + str.substr(length - 3, 1) + 'K';
  } else {
    // If the number has more than 6 digits, convert it to millions (M)
    result = str.substr(0, length - 6) + '.' + str.substr(length - 6, 1) + 'M';
  }

  return result;
};

export const revGenLoreumIpsumText = ({
  revMaxCharCount = 100,
  revMinWordsPerSentence = 7,
  revMaxWordsPerSentence = 12,
  revMinSentences = 1,
  revMaxSentences = 2,
} = {}) => {
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: revMaxSentences,
      min: revMinSentences,
    },
    wordsPerSentence: {
      max: revGetRandInteger(revMinWordsPerSentence, revMaxWordsPerSentence),
      min: revGetRandInteger(1, revMinWordsPerSentence),
    },
    maxCharCount: revMaxCharCount,

    // count: 1, // Number of "words", "sentences", or "paragraphs"
    format: 'plain', // "plain" or "html"
    // paragraphLowerBound: 3,  // Min. number of sentences per paragraph.
    // paragraphUpperBound: 7,  // Max. number of sentences per paragarph.
    // random: Math.random, // A PRNG function
    // sentenceLowerBound: 5,   // Min. number of words per sentence.
    // sentenceUpperBound: 15,  // Max. number of words per sentence.
    // suffix: '\n', // Line ending, defaults to "\n" or "\r\n" (win32)
    units: 'sentences', // paragraph(s), "sentence(s)", or "word(s)"
    // words: [], // Array of words to draw from
  });

  return lorem.generateSentences(revGetRandInteger(1, revMaxSentences));
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

export const revStringEmpty = revString => {
  return (
    !revString ||
    !revString.length ||
    revString == null ||
    revRemoveAllWhiteSpaces(revString) == ''
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
    ? revStr.substr(0, revLen) + revHellipse
    : revStr;
};

export const revCompareStrings = (revStr1, revStr2) => {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });
  return collator.compare(revStr1, revStr2);
};

export const revGetRawHTML = revStr => {
  revStr = revStr.replace(/&/gi, '&amp;');
  revStr = revStr.replace(/</gi, '&lt;');

  return revStr;
};

export const revGetFilePathType_ = revStr => {
  const filePathRegex = /^(?:[a-z]+:)?\/\/[^\s]+$/i;
  const revURLRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  const revContentUriRegex = /^content:[/][/][^\s]+$/i;

  if (filePathRegex.test(revStr)) {
    return 'rev_local_file_path';
  } else if (revURLRegex.test(revStr)) {
    return 'rev_url';
  } else if (revContentUriRegex.test(revStr)) {
    return 'rev_content_uri';
  } else {
    return 'rev_unknown';
  }
};

const checkPathType = path => {
  if (path.startsWith('file://')) {
    if (path.startsWith('file:///')) {
      return 'Local File Path';
    } else {
      return 'Content URI';
    }
  } else if (path.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)) {
    return 'URL';
  } else if (path.startsWith('/')) {
    return 'Local File Path';
  } else {
    return 'Unknown';
  }
};

export const revGetPathType = revPath => {
  const revContentUriRegex = /^content:\/\/[^/]+$/;
  const revLocalFilePathRegex = /^(\/|(file:\/\/\/)|(file:\/{4}\/))/;
  const revURLRegex = /^(https?|ftp):\/\/[^/]+/;

  if (revContentUriRegex.test(revPath)) {
    return 'rev_content_uri';
  } else if (revLocalFilePathRegex.test(revPath)) {
    return 'rev_local_file_path';
  } else if (revURLRegex.test(revPath)) {
    return 'rev_url';
  } else {
    return 'rev_unknown';
  }
};

export const revExtractDomainParts = revURL => {
  const revParsedUrl = new URL(revURL);
  const revProtocol = revParsedUrl.protocol.replace(':', '');
  const revSubdomain = revParsedUrl.hostname.split('.')[0];
  const revDomain = revParsedUrl.hostname.replace(`${revSubdomain}.`, '');
  const revPath = revParsedUrl.pathname;

  return {revProtocol, revSubdomain, revDomain, revPath};
};

export const revIsValidURL = revURL => {
  const revPattern = new RegExp(
    '^((http|https)://)?([a-z0-9]+([-.][a-z0-9]+)*.[a-z]{2,})(:[0-9]{2,5})?(/.*)?$',
    'i',
  );
  return revPattern.test(revURL);
};
