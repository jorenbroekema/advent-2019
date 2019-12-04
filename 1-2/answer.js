/**
 * Fuel problem extended
 */
import data from '../1-1/data.js';

const calcFuel = mass => {
  let sum = 0;

  // Inner recursive function, so we can keep track of our sum outside of it
  const _calcFuel = _mass => {
    const fuel = Math.floor(_mass / 3) - 2;
    if (fuel > 0) {
      sum += fuel;
      return _calcFuel(fuel);
    }
  };
  _calcFuel(mass);

  return sum;
};

const totalFuel = data.reduce((acc, value) => {
  return acc + calcFuel(value);
}, 0);

console.log(totalFuel);
