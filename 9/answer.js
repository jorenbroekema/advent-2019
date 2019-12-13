import data from './data.js';

class Intcode {
  constructor(data) {
    this.data = data;
    this.instrPointer = 0;
    this.relativeBase = 0;
    this.outputArr = [];
    this.halted = false;
  }

  getOutput(input) {
    while (!this.halted) {
      this.opCode(input);
    }
  }

  getParamMode(instr, pos) {
    const paramArr = instr.substring(0, instr.length - 2).split('');
    return parseInt(paramArr[paramArr.length - 1 - pos], 10) || 0;
  }

  opCode(inputInt) {
    const instr = this.data[this.instrPointer].toString();
    const opcode = parseInt(instr.substr(instr.length - 2, 2), 10); // last two chars

    const [paramOne, paramTwo, paramThree] = this.data.slice(this.instrPointer + 1, this.instrPointer + 4);
    const parameters = [
      { param: parseInt(paramOne, 10), mode: this.getParamMode(instr, 0) },
      { param: parseInt(paramTwo, 10), mode: this.getParamMode(instr, 1) },
      { param: parseInt(paramThree, 10), mode: this.getParamMode(instr, 2) },
    ];

    let amountOfInstrValues = 4;
    let jump = false;
    switch (opcode) {
      case 1: {
        const valueA = this.getValue(parameters[0].mode, parameters[0].param);
        const valueB = this.getValue(parameters[1].mode, parameters[1].param);
        const addressToSet = parameters[2].mode === 0 ? parameters[2].param : (parameters[2].param + this.relativeBase);
        this.data[addressToSet] = valueA + valueB;
      }
        break;
      case 2: {
        const valueA = this.getValue(parameters[0].mode, parameters[0].param);
        const valueB = this.getValue(parameters[1].mode, parameters[1].param);
        const addressToSet = parameters[2].mode === 0 ? parameters[2].param : (parameters[2].param + this.relativeBase);
        this.data[addressToSet] = valueA * valueB;
      }
        break;
      case 3: {
        amountOfInstrValues = 2;
        const addressToSet = parameters[0].mode === 0 ? parameters[0].param : parameters[0].param + this.relativeBase;
        this.data[addressToSet] = inputInt;
      }
        break;
      case 4:
        amountOfInstrValues = 2;
        const value = this.getValue(parameters[0].mode, parameters[0].param);
        this.outputArr.push(value);
        break;
      case 5: {
        amountOfInstrValues = 3;
        const valueA = this.getValue(parameters[0].mode, parameters[0].param);
        const valueB = this.getValue(parameters[1].mode, parameters[1].param);
        if (valueA !== 0) {
          jump = valueB;
        }
      }
        break;
      case 6: {
        amountOfInstrValues = 3;
        const valueA = this.getValue(parameters[0].mode, parameters[0].param);
        const valueB = this.getValue(parameters[1].mode, parameters[1].param);
        if (valueA === 0) {
          jump = valueB;
        }
      }
        break;
      case 7: {
        amountOfInstrValues = 4;
        const valueA = this.getValue(parameters[0].mode, parameters[0].param);
        const valueB = this.getValue(parameters[1].mode, parameters[1].param);
        const valueC = parameters[2].mode === 2 ? parameters[2].param + this.relativeBase : parameters[2].param;
        if (valueA < valueB) {
          this.data[valueC] = 1;
        } else {
          this.data[valueC] = 0;
        }
      }
        break;
      case 8: {
        amountOfInstrValues = 4;
        const valueA = this.getValue(parameters[0].mode, parameters[0].param);
        const valueB = this.getValue(parameters[1].mode, parameters[1].param);
        const valueC = parameters[2].mode === 2 ? parameters[2].param + this.relativeBase : parameters[2].param;
        if (valueA === valueB) {
          this.data[valueC] = 1;
        } else {
          this.data[valueC] = 0;
        }
      }
        break;
      case 9: {
        amountOfInstrValues = 2;
        const value = this.getValue(parameters[0].mode, parameters[0].param);
        this.relativeBase += value;
      }
        break;
      case 99:
        this.halted = true;
        console.log('|| Halt ||');
        break;
      default: {
        this.halted = true;
        console.error('something went wrong!');
        return;
      }
    }

    if (jump !== false) {
      this.instrPointer = jump;
      return;
    }
    this.instrPointer += amountOfInstrValues;
  };

  getValue(mode, param) {
    let value;
    switch (mode) {
      case 0:
        value = this.data[param];
        break;
      case 2:
        value = this.data[param + this.relativeBase];
        break;
      default:
        value = param;
    }

    return value || 0;
  }
}

const intcode = new Intcode(data);
intcode.getOutput(2);
console.log(intcode.outputArr);
