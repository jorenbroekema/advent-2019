import data from './data.js';
import permutations from './permutations.js';

// pos --> 0 means hundreds, 1 thousands, 2 ten-thousands etc.
const getParamMode = (instr, pos) => {
  const paramArr = instr.substring(0, instr.length - 2).split('');
  return parseInt(paramArr[paramArr.length - 1 - pos], 10) || 0;
}

const opCode = (arr, phaseSetting, inputInt) => {
  let output;
  let phaseSettingUsed = false;
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
    let jump = false;

    // console.log(`opcode ${opcode} with the following parameters:`);
    // console.log(parameters);

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
        if (phaseSettingUsed) {
          arr[parameters[0].param] = inputInt;
        } else {
          arr[parameters[0].param] = phaseSetting;
          phaseSettingUsed = true;
        }
      }
        break;
      case 4:
        amountOfInstrValues = 2;
        if (parameters[0].mode === 0) {
          output = arr[parameters[0].param];
        } else {
          output = parameters[0].param;
        }

        // console.log(`OUTPUT TEST: ${output}`);
        if (output !== 0) {
          // console.log('this is either really bad, followed by 99 opcode || End ||, in that case we have diagnostic code :D!');
        }
        break;
      case 5: {
        amountOfInstrValues = 3;
        const paramA = parameters[0].mode === 0 ? arr[parameters[0].param] : parameters[0].param;
        if (paramA !== 0) {
          const paramB = parameters[1].mode === 0 ? arr[parameters[1].param] : parameters[1].param;
          jump = paramB;
        }
      }
        break;
      case 6: {
        amountOfInstrValues = 3;
        const paramA = parameters[0].mode === 0 ? arr[parameters[0].param] : parameters[0].param;
        if (paramA === 0) {
          const paramB = parameters[1].mode === 0 ? arr[parameters[1].param] : parameters[1].param;
          jump = paramB;
        }
      }
        break;
      case 7: {
        amountOfInstrValues = 4;
        const paramA = parameters[0].mode === 0 ? arr[parameters[0].param] : parameters[0].param;
        const paramB = parameters[1].mode === 0 ? arr[parameters[1].param] : parameters[1].param;
        const paramC = parameters[2].param;
        if (paramA < paramB) {
          arr[paramC] = 1;
        } else {
          arr[paramC] = 0;
        }
      }
        break;
      case 8: {
        amountOfInstrValues = 4;
        const paramA = parameters[0].mode === 0 ? arr[parameters[0].param] : parameters[0].param;
        const paramB = parameters[1].mode === 0 ? arr[parameters[1].param] : parameters[1].param;
        const paramC = parameters[2].param;
        if (paramA === paramB) {
          arr[paramC] = 1;
        } else {
          arr[paramC] = 0;
        }
      }
        break;
      case 99:
        // console.log('|| End ||');
        return output;
      default: {
        console.error('something went wrong!');
        return;
      }
    }

    if (jump) {
      return _evaluate(jump);
    }
    return _evaluate(i + amountOfInstrValues);
  }
  _evaluate(0);

  return output;
};

const maxThrusterOutput = (sequences) => {
  let bestOutput = null;
  sequences.forEach((sequence) => {
    let output = 0;
    sequence.forEach((num) => {
      const amplifierResult = opCode(data, num, output);
      output = amplifierResult;
    });

    if (output > bestOutput) {
      bestOutput = output;
    }
  });

  return bestOutput;
}

const sequences = permutations([0, 1, 2, 3, 4]);
console.log(maxThrusterOutput(sequences));