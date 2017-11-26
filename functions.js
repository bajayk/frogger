function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandom() {
  return Math.random();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}