export function revGetRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
