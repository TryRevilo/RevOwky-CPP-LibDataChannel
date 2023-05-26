import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-fetch-blob';

import {revGetServerData_JSON} from '../components/rev_libs_pers/rev_server/rev_pers_lib_read';

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

export function revGetRandInteger(min = 1, max = 1000) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function revIsEmptyJSONObject(obj) {
  if (obj == undefined || obj == null || typeof obj !== 'object') {
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
    if (v === '0') {
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
  let filename = revFile.name;
  let revFileType = filename.slice(
    (Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1,
  );

  return revFileType;
};

export const revGetFileObjectSubType = revFile => {
  let revFileType = revGetFileType(revFile);

  if (!revFileType) {
    return;
  }

  let revEntitySubType;

  switch (revFileType) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      revEntitySubType = 'rev_file';
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
      revEntitySubType = 'rev_video';
      break;

    case 'mp3':
      revEntitySubType = 'rev_audio';
      break;

    default:
      revEntitySubType = 'rev_file';
  }

  return revEntitySubType;
};

export const revSetInterval = (revElementID, revCallback) => {
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

export const revSetIntervalBoolean = (revBooleanCallback, revCallback) => {
  let checkExist = setInterval(function () {
    if (revBooleanCallback()) {
      revCallback();
      clearInterval(checkExist);
    }
  }, 100);
};

export const revFormatDate = (date, format, utc) => {
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

export const revPingServer = revVarArgs => {
  let revInterval = revVarArgs.revInterval;
  let revIP = revVarArgs.revIP;
  let revCallBack = revVarArgs.revCallBack;

  let intervalId;
  let counter = 0;
  const maxPings = 1; // Change this to the number of pings you want to make

  const pingServer = () => {
    revGetServerData_JSON(revIP, revRetData => {
      console.log('>>> revRetData ' + JSON.stringify(revRetData));

      if (
        !revIsEmptyJSONObject(revRetData) &&
        !revIsEmptyVar(revRetData.revData)
      ) {
        console.log('>>> Server is up !');
        clearInterval(intervalId);
        return revCallBack({revServerStatus: 200});
      }

      if (counter === maxPings) {
        console.log('>>> Server is DOWN !');

        clearInterval(intervalId);
        revCallBack({revServerStatus: 'Network Request Failed'});
      }

      counter = counter + 1;
    });
  };

  // Ping the server every 5 seconds
  intervalId = setInterval(pingServer, revInterval);
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
