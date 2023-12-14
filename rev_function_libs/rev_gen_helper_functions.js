import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';

import {revGetServerData_JSON} from '../components/rev_libs_pers/rev_server/rev_pers_lib_read';

import {NativeModules, Platform} from 'react-native';
import {revStringEmpty} from './rev_string_function_libs';

// Function to get the absolute file path
export const revGetFileAbsolutePath = async uri => {
  let revRetVal = null;

  try {
    let revFileStats = await RNFetchBlob.fs.stat(uri);
    revRetVal = revFileStats.path;
  } catch (error) {
    console.log('***error -revGetFileAbsolutePath', error);

    revRetVal = null;
  }

  return revRetVal;
};

export const revGetFileNameFromPath = revPath => {
  return revPath.match(/[^/]+$/)[0];
};

export const revGetFileExtension = revPath => {
  return revPath.match(/\.[^.]+$/)?.[0];
};

export const revReadFileAsBinaryString = async (revFilePath, revEncoding) => {
  try {
    let revContent = await RNFS.readFile(revFilePath, revEncoding); // 'ascii' encoding reads the file as binary string
    return revContent;
  } catch (error) {
    console.error('Error reading file:', error.message);
    return null;
  }
};

export function revGetRandInteger(min = 1, max = 1000) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function revIsEmptyJSONObject(obj) {
  if (revIsEmptyVar(obj) || typeof obj !== 'object') {
    return true;
  }

  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return !obj || JSON.stringify(obj) === JSON.stringify({});
}

export const revIsEmptyVar = v => {
  let type = typeof v;

  if (type === 'undefined') {
    return true;
  }

  if (type === 'boolean') {
    return !v;
  }

  if (v === null) {
    return true;
  }

  if (v === undefined) {
    return true;
  }

  if (v instanceof Array) {
    if (v.length < 1) {
      return true;
    }
  } else if (type === 'string') {
    if (v.length < 1) {
      return true;
    }
  } else if (type === 'object') {
    if (Object.keys(v).length < 1) {
      return true;
    }
  } else if (type === 'number') {
    if (v === 0) {
      return true;
    }
  }

  return false;
};

export const revGetFileType = revFile => {
  if (revIsEmptyJSONObject(revFile) || !('name' in revFile)) {
    return null;
  }

  let filename = revFile.name;
  let revFileType = filename.slice(
    (Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1,
  );

  return revFileType;
};

export const revGetFileObjectSubType = revFile => {
  let revFileType = revGetFileType(revFile);

  if (revStringEmpty(revFileType)) {
    return;
  }

  let revSubType;

  switch (revFileType) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      revSubType = 'rev_image';
      break;

    case 'mp4':
    case 'MOV':
    case 'WMV':
    case 'AVI':
    case 'AVCHD':
    case 'FLV':
    case 'F4V':
    case 'SWF':
    case 'MKV':
    case 'mkv':
    case 'WEBM':
    case 'HTML5':
    case 'MPEG-2':
      revSubType = 'rev_video';
      break;

    case 'mp3':
      revSubType = 'rev_audio';
      break;

    default:
      revSubType = 'rev_file';
  }

  return revSubType;
};

export var revCurrDelayedTime = async ({revTimeDelay = 10} = {}) => {
  return await revTimeoutAsync({
    revTimeDelay,
    revCallback: () => new Date().getTime(),
  });
};

export var revTimeoutAsync = async ({revTimeDelay = 10, revCallback} = {}) => {
  let revTimeoutPromise = new Promise(resolve => {
    setTimeout(function () {
      resolve(revCallback());
    }, revTimeDelay);
  });

  return await revTimeoutPromise;
};

export var revSetInterval = (revElementID, revCallback) => {
  if (!revElementID) {
    console.log('ERR -> !revElementID : -> ' + revElementID);
    return;
  }

  let checkExist = setInterval(function () {
    if ($('#' + revElementID) && $('#' + revElementID).length) {
      revCallback();
      clearInterval(checkExist);
    }
  }, 100);
};

export var revSetIntervalBoolean = (revBooleanCallback, revCallback) => {
  let checkExist = setInterval(function () {
    if (revBooleanCallback()) {
      revCallback();
      clearInterval(checkExist);
    }
  }, 100);
};

export var revFormatDate = (date, format, utc) => {
  var MMMM = [
    '\x00',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  var MMM = [
    '\x01',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  var dddd = [
    '\x02',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  var ddd = ['\x03', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function ii(i, len) {
    var s = i + '';
    len = len || 2;
    while (s.length < len) s = '0' + s;
    return s;
  }

  var y = utc ? date.getUTCFullYear() : date.getFullYear();
  format = format.replace(/(^|[^\\])yyyy+/g, '$1' + y);
  format = format.replace(/(^|[^\\])yy/g, '$1' + y.toString().substr(2, 2));
  format = format.replace(/(^|[^\\])y/g, '$1' + y);

  var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
  format = format.replace(/(^|[^\\])MMMM+/g, '$1' + MMMM[0]);
  format = format.replace(/(^|[^\\])MMM/g, '$1' + MMM[0]);
  format = format.replace(/(^|[^\\])MM/g, '$1' + ii(M));
  format = format.replace(/(^|[^\\])M/g, '$1' + M);

  var d = utc ? date.getUTCDate() : date.getDate();
  format = format.replace(/(^|[^\\])dddd+/g, '$1' + dddd[0]);
  format = format.replace(/(^|[^\\])ddd/g, '$1' + ddd[0]);
  format = format.replace(/(^|[^\\])dd/g, '$1' + ii(d));
  format = format.replace(/(^|[^\\])d/g, '$1' + d);

  var H = utc ? date.getUTCHours() : date.getHours();
  format = format.replace(/(^|[^\\])HH+/g, '$1' + ii(H));
  format = format.replace(/(^|[^\\])H/g, '$1' + H);

  var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
  format = format.replace(/(^|[^\\])hh+/g, '$1' + ii(h));
  format = format.replace(/(^|[^\\])h/g, '$1' + h);

  var m = utc ? date.getUTCMinutes() : date.getMinutes();
  format = format.replace(/(^|[^\\])mm+/g, '$1' + ii(m));
  format = format.replace(/(^|[^\\])m/g, '$1' + m);

  var s = utc ? date.getUTCSeconds() : date.getSeconds();
  format = format.replace(/(^|[^\\])ss+/g, '$1' + ii(s));
  format = format.replace(/(^|[^\\])s/g, '$1' + s);

  var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
  format = format.replace(/(^|[^\\])fff+/g, '$1' + ii(f, 3));
  f = Math.round(f / 10);
  format = format.replace(/(^|[^\\])ff/g, '$1' + ii(f));
  f = Math.round(f / 10);
  format = format.replace(/(^|[^\\])f/g, '$1' + f);

  var T = H < 12 ? 'AM' : 'PM';
  format = format.replace(/(^|[^\\])TT+/g, '$1' + T);
  format = format.replace(/(^|[^\\])T/g, '$1' + T.charAt(0));

  var t = T.toLowerCase();
  format = format.replace(/(^|[^\\])tt+/g, '$1' + t);
  format = format.replace(/(^|[^\\])t/g, '$1' + t.charAt(0));

  var tz = -date.getTimezoneOffset();
  var K = utc || !tz ? 'Z' : tz > 0 ? '+' : '-';
  if (!utc) {
    tz = Math.abs(tz);
    var tzHrs = Math.floor(tz / 60);
    var tzMin = tz % 60;
    K += ii(tzHrs) + ':' + ii(tzMin);
  }
  format = format.replace(/(^|[^\\])K/g, '$1' + K);

  var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
  format = format.replace(new RegExp(dddd[0], 'g'), dddd[day]);
  format = format.replace(new RegExp(ddd[0], 'g'), ddd[day]);

  format = format.replace(new RegExp(MMMM[0], 'g'), MMMM[M]);
  format = format.replace(new RegExp(MMM[0], 'g'), MMM[M]);

  format = format.replace(/\\(.)/g, '$1');

  return format;
};

export const revFormatLongDate = revLongDate => {
  if (!revLongDate || parseInt(revLongDate) < 1) {
    return ' ( !TimE uNsET ) ';
  }

  return revFormatDate(
    new Date(parseInt(revLongDate)),
    'dddd h:mmtt d MMM yyyy',
  );
};

/** REV START ARR FUNCS */

export const revGetElementArrElement = (revArr, revVal) => {
  let revArrElement;

  for (let i = 0; i < revArr.length; i++) {
    if (revArr[i] == revVal) {
      revArrElement = revArr[i];
      break;
    }
  }

  return revArrElement;
};

export const revArrIncludesElement = (revArr, revVal) => {
  let revIncludesElement = false;

  for (let i = 0; i < revArr.length; i++) {
    if (revArr[i] == revVal) {
      revIncludesElement = true;
      break;
    }
  }

  return revIncludesElement;
};

export const revIsDuplicateInArr = (revArr, revElement) => {
  let revDuplicatesArr = [];

  for (let i = 0; i < revArr.length; i++) {
    let revCurrVal = revArr[i];

    if (revCurrVal.localeCompare(revElement) == 0) {
      revDuplicatesArr.push(revCurrVal);
    }
  }

  return revDuplicatesArr.length > 1;
};

export const revRemoveArrElement = (revArr, revVal) => {
  let revRemovedVal;

  let i = 0;
  while (i < revArr.length) {
    if (revArr[i] == revVal) {
      revRemovedVal = revArr.splice(i, 1);
      {
        continue;
      }
    }

    ++i;
  }

  return revRemovedVal;
};

export const revJSONArrContains_NameId = (
  revJSONArr,
  revKey,
  revNameIdCheck,
) => {
  revNameIdCheck = revNameIdCheck + '';

  let revInJSONArr = false;

  if (revIsEmptyVar(revJSONArr)) {
    return revInJSONArr;
  }

  for (let i = 0; i < revJSONArr.length; i++) {
    let revCurrItem = revJSONArr[i];

    if (revIsEmptyJSONObject(revCurrItem)) {
      continue;
    }

    let revCurrItemKey = revCurrItem[revKey] + '';

    if (revCurrItemKey && revCurrItemKey.localeCompare(revNameIdCheck) == 0) {
      revInJSONArr = true;
      break;
    }
  }

  return revInJSONArr;
};

export const revArraysEqual = (a, b) => {
  return a.length === b.length && a.every((value, index) => value === b[index]);
};

export const revPingServer = (revVarArgs = {}) => {
  const {revInterval = 5000, revIP = '', revMaxPings = 3} = revVarArgs;

  if (revIsEmptyVar(revIP)) {
    return Promise.resolve({revErr: 'revIP empty'});
  }

  let revCounter = 0;

  return new Promise((resolve, reject) => {
    const revPing = async () => {
      revCounter++;

      let revRetData = await revGetServerData_JSON(revIP);

      if (!revIsEmptyJSONObject(revRetData)) {
        if (!revIsEmptyVar(revRetData.revData)) {
          // Clear the interval once the server is up
          clearInterval(revIntervalId);
          resolve({revServerStatus: 200});
        } else {
          clearInterval(revIntervalId);
          resolve({revServerStatus: 'Network Request Failed'});
        }
      } else if (revCounter >= revMaxPings) {
        // Clear the interval when max pings are reached
        clearInterval(revIntervalId);
        resolve({revServerStatus: 'Network Request Failed'});
      }

      revCounter += 1;
    };

    // Set up a recurring ping every pingInterval
    const revIntervalId = setTimeout(async () => {
      await revPing();
    }, revInterval);
  });
};

export const revIsLocalFilePathOrUrl = string => {
  return (
    string.startsWith('/') ||
    string.startsWith('./') ||
    string.startsWith('../') ||
    /^[a-zA-Z]:\\/.test(string) ||
    /^(file|data):/.test(string)
  );
};

export const revHexToRgba = (hex, opacity) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const revGenerateVideoThumbnail = async revParams => {
  try {
    if (Platform.OS === 'android') {
      const thumbnailUri =
        await NativeModules.RevMediaFunctionsHelperModule.revGetVideoThumbnail(
          revParams,
        );
      return thumbnailUri;
    } else {
      // Handle other platforms (iOS, etc.) if necessary
      throw new Error('Unsupported platform');
    }
  } catch (error) {
    console.error('Error retrieving thumbnail:', error);
    throw error;
  }
};

// Detect free variables `exports`.
var freeExports = typeof exports == 'object' && exports;

// Detect free variable `module`.
var freeModule =
  typeof module == 'object' &&
  module &&
  module.exports == freeExports &&
  module;

// Detect free variable `global`, from Node.js or Browserified code, and use
// it as `root`.
var freeGlobal = typeof global == 'object' && global;
if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
  root = freeGlobal;
}

/*--------------------------------------------------------------------------*/

var InvalidCharacterError = function (message) {
  this.message = message;
};
InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

var error = function (message) {
  // Note: the error messages used throughout this file match those used by
  // the native `atob`/`btoa` implementation in Chromium.
  throw new InvalidCharacterError(message);
};

var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// http://whatwg.org/html/common-microsyntaxes.html#space-character
var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

// `decode` is designed to be fully compatible with `atob` as described in the
// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
// The optimized base64-decoding algorithm used is based on @atk’s excellent
// implementation. https://gist.github.com/atk/1020396
export var revDecode = function (input) {
  input = String(input).replace(REGEX_SPACE_CHARACTERS, '');
  var length = input.length;

  if (length % 4 == 0) {
    input = input.replace(/==?$/, '');
    length = input.length;
  }

  if (
    length % 4 == 1 ||
    // http://whatwg.org/C#alphanumeric-ascii-characters
    /[^+a-zA-Z0-9/]/.test(input)
  ) {
    error(
      'Invalid character: the string to be decoded is not correctly encoded.',
    );
  }

  var bitCounter = 0;
  var bitStorage;
  var buffer;
  var output = '';
  var position = -1;

  while (++position < length) {
    buffer = TABLE.indexOf(input.charAt(position));
    bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
    // Unless this is the first of a group of 4 characters…
    if (bitCounter++ % 4) {
      // …convert the first 8 bits to a single ASCII character.
      output += String.fromCharCode(
        0xff & (bitStorage >> ((-2 * bitCounter) & 6)),
      );
    }
  }

  return output;
};
