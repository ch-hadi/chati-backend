export function getUniqueECardNumber(prefix = null) {
  let randomNumber =
    Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
  let timestamp = Date.now().toString();
  let randomID = timestamp + randomNumber.toString();
  if (randomID.length > 16) {
    randomID = randomID.substring(randomID.length - 16);
  } else if (randomID.length < 16) {
    randomID = randomID.padStart(16, '0');
  }
  return prefix ? prefix + randomID : randomID;
}
