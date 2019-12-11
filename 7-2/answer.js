import data from '../7-1/data.js';
import permutations from '../7-1/permutations.js';

const maxThrusterOutput = (sequences) => {
  let bestThrustSignal = 0;
  sequences.forEach(sequence => {
    const amps = sequence.map(num => new Amplifier([...data], num));
    const thrust = getThrust(amps);
    if (thrust > bestThrustSignal) {
      bestThrustSignal = thrust;
    }
  });
  return bestThrustSignal;
}

const getThrust = (amps) => {
  let latestThrustAmount = 0;
  const loopAmps = (amps, output = 0) => {
    amps.forEach(amp => {
      output = amp.getOutput(output);
    });

    if (!amps[amps.length - 1].halted) {
      latestThrustAmount = output;
      return loopAmps(amps, output);
    }
  };
  loopAmps(amps);
  return latestThrustAmount;
}

/**
 * Switched to OOP based because it became important to manage own state for:
 * - Instruction pointer
 * - Intcode data
 * - Phase setting (and whether it was used as input instruction already)
 * - Whether its intcode program run has reached a halted state
 */
class Amplifier {
  constructor(data, phase) {
    this.data = data;
    this.instrPointer = 0;
    this.phase = phase;
    this.halted = false;
    this.phaseUsed;
  }

  getOutput(input) {
    return this.opCode(this.data, this.phase, input);
  }

  getParamMode(instr, pos) {
    const paramArr = instr.substring(0, instr.length - 2).split('');
    return parseInt(paramArr[paramArr.length - 1 - pos], 10) || 0;
  }

  opCode(arr, phase, inputInt) {
    let output;
    const _evaluate = (i) => {
      this.instrPointer = i;
      const instr = arr[i].toString();

      const opcode = parseInt(instr.substr(instr.length - 2, 2), 10); // last two chars

      const [paramOne, paramTwo, paramThree] = arr.slice(i + 1, i + 4);
      const parameters = [
        { param: parseInt(paramOne, 10), mode: this.getParamMode(instr, 0) },
        { param: parseInt(paramTwo, 10), mode: this.getParamMode(instr, 1) },
        { param: parseInt(paramThree, 10), mode: this.getParamMode(instr, 2) },
      ];

      let amountOfInstrValues = 4;
      let jump = false;
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
          if (this.phaseUsed) {
            arr[parameters[0].param] = inputInt;
          } else {
            arr[parameters[0].param] = phase;
            this.phaseUsed = true;
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
          this.instrPointer = i + amountOfInstrValues;
          return output;
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
          this.halted = true;
          console.log('|| Halt ||');
          return;
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
    _evaluate(this.instrPointer);

    return output;
  };
}

const sequences = permutations([5, 6, 7, 8, 9]);
console.log(maxThrusterOutput(sequences));