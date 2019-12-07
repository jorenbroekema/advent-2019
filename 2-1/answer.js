/**
 * Opcode problem
 *
 * Codes:
 *  1 => take sum of integers that are located at
 *       index <opcodeIndex+1> and <opcodeIndex+2>
 *       and set value at <opcodeIndex+3> to this sum
 *
 *  2 => multipy integers that are located at
 *       index <opcodeIndex+1> and <opcodeIndex+2>
 *       and set value at <opcodeIndex+3> to this result
 *
 * 99 => terminate the program
 */
import data from './data.js';

const opCode = (arr) => {
  let index = 0;

  const _evaluate = (i) => {
    switch (arr[i]) {
      case 1:
        arr[arr[i + 3]] = arr[arr[i + 1]] + arr[arr[i + 2]];
        break;
      case 2:
        arr[arr[i + 3]] = arr[arr[i + 1]] * arr[arr[i + 2]];
        break
      case 99:
        return;
      default: {
        console.error('something went wrong!');
        return;
      }
    }
    return _evaluate(i + 4);
  }
  _evaluate(index);

  return arr[0];
};

console.log(opCode(data));
