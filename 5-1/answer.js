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

// pos --> 0 means hundreds, 1 thousands, 2 ten-thousands etc.
const getParamMode = (instr, pos) => {
  const paramArr = instr.substring(0, instr.length - 2).split('');
  return parseInt(paramArr[paramArr.length - 1 - pos], 10) || 0;
}

const opCode = (arr, inputInt) => {
  const _evaluate = (i) => {
    const instr = arr[i].toString();

    const opcode = parseInt(instr.substr(instr.length - 2, 2), 10); // last two chars

    const [paramOne, paramTwo, paramThree] = arr.slice(i + 1, i + 4);
    const parameters = [
      { param: parseInt(paramOne, 10), mode: getParamMode(instr, 0) },
      { param: parseInt(paramTwo, 10), mode: getParamMode(instr, 1) },
      { param: parseInt(paramThree, 10), mode: getParamMode(instr, 2) },
    ]

    let amountOfInstrValues = 4;

    console.log(`opcode ${opcode} with the following parameters:`);
    console.log(parameters);

    switch (opcode) {
      case 1: {
        const paramA = parameters[0].mode === 0 ? arr[parameters[0].param] : parameters[0].param;
        const paramB = parameters[1].mode === 0 ? arr[parameters[1].param] : parameters[1].param;
        arr[parameters[2].param] = paramA + paramB;
      }
        break;
      case 2: {
        const paramA = parameters[0].mode === 0 ? arr[parameters[0].param] : parameters[0].param;
        const paramB = parameters[1].mode === 0 ? arr[parameters[1].param] : parameters[1].param;
        arr[parameters[2].param] = paramA * paramB;
      }
        break;
      case 3: {
        amountOfInstrValues = 2;
        arr[parameters[0].param] = inputInt;
      }
        break;
      case 4:
        amountOfInstrValues = 2;

        let output;
        if (parameters[0].mode === 0) {
          output = arr[parameters[0].param];
        } else {
          output = parameters[0].param;
        }

        console.log(`OUTPUT TEST: ${output}`);
        if (output !== 0) {
          console.log('this is either really bad, followed by 99 opcode || End ||, in that case we have diagnostic code :D!');
        }
        break;
      case 99:
        console.log('|| End ||');
        return;
      default: {
        console.error('something went wrong!');
        return;
      }
    }
    return _evaluate(i + amountOfInstrValues);
  }
  _evaluate(0);

  return arr;
};

opCode(data, 1);
