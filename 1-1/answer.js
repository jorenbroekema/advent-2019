/**
 * Fuel problem
 */
import data from './data.js';

const totalFuel = data.reduce(
  (sum, value) => sum + (Math.floor(value / 3) - 2),
  0
);

console.log(totalFuel);
