/**
 * Opcode problem
 *
 * Codes:
 *  1 => take sum of integers that are located at
 *       index <opcodeIndex+1> and <opcodeIndex+2>
 *       and set value at <opcodeIndex+3> to this sum
 *
 *  2 => multiply integers that are located at
 *       index <opcodeIndex+1> and <opcodeIndex+2>
 *       and set value at <opcodeIndex+3> to this result
 *
 * 99 => terminate the program
 */
import data from '../2-1/data.js';

const main = (data, desiredOutput) => {
  let nounCount = 0;
  let verbCount = 0;

  const tryOpCode = (data, noun, verb) => {
    // Initialize memory
    const arr = [...data];
    arr[1] = noun;
    arr[2] = verb;

    const instruction = (instrPointer) => {
      switch (arr[instrPointer]) {
        case 1:
          arr[arr[instrPointer + 3]] = arr[arr[instrPointer + 1]] + arr[arr[instrPointer + 2]];
          break;
        case 2:
          arr[arr[instrPointer + 3]] = arr[arr[instrPointer + 1]] * arr[arr[instrPointer + 2]];
          break
        case 99:
          // End of opCode! Terminate
          return;
        default: {
          console.error('something went wrong!');
          return;
        }
      }
      return instruction(instrPointer + 4);
    }
    instruction(0);

    // Found the pair! Terminate
    if (arr[0] === desiredOutput) {
      return { noun, verb };
    }

    if (nounCount < 99) {
      nounCount++;
    }

    if (nounCount >= 99) {
      nounCount = 0;
      verbCount++;
    }

    return tryOpCode(data, nounCount, verbCount);
  };

  return tryOpCode(data, nounCount, verbCount);
}

const { noun, verb } = main(data, 19690720);
console.log(100 * noun + verb);
