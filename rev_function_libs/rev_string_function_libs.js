export function revRemoveLinebreaks(revStr) {
  return revStr.replace(/(\r\n|\n|\r)/gm, '');
}

export function revIsEmptyJSONObject(obj) {
  if (obj == undefined) {
    return true;
  }

  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return !obj || JSON.stringify(obj) === JSON.stringify({});
}
