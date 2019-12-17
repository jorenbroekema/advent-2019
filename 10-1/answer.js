import data from './data.js';

const multiArr = data.split('\n').map(r => r.split(''));
const checkPosition = (arr, posX, posY) => {
  const linesOfSight = new Map();
  const setLineOfSight = (key, x, y) => {
    if (linesOfSight.has(key)) {
      linesOfSight.set(key, [...linesOfSight.get(key), `${x},${y}`]);
    } else {
      linesOfSight.set(key, [`${x},${y}`]);
    }
  };

  arr.forEach((row, i) => {
    row.forEach((column, j) => {
      if (column === '#') {
        const hypo = Math.sqrt(Math.pow(posY - i, 2) + Math.pow(posX - j, 2));
        const atan =
          Math.round(
            Math.atan((posY - i) / (posX - j)) * (180 / Math.PI) * 1000,
          ) / 1000;
        const asin =
          Math.round(Math.asin((posY - i) / hypo) * (180 / Math.PI) * 1000) /
          1000;

        if (!isNaN(atan) && !isNaN(asin)) {
          // excludes itself
          if (Object.is(-0, atan)) {
            // treat -0 as actually different from +0
            setLineOfSight(`-${atan}|${asin}`, j, i);
          } else {
            setLineOfSight(`${atan}|${asin}`, j, i);
          }
        }
      }
    });
  });

  return linesOfSight.size;
};

let maxAsteroids = 0;
multiArr.forEach((row, i) =>
  row.forEach((column, j) => {
    if (column === '#') {
      const asteroidAmount = checkPosition(multiArr, j, i);
      if (asteroidAmount > maxAsteroids) {
        maxAsteroids = asteroidAmount;
      }
    }
  }),
);
console.log(maxAsteroids);
