import { wireA, wireB } from './data.js';

const grid = new Map();

const wire = (wire) => {
  let instructionIndex = 0;

  // Keep track of coordinates filled by single wire
  const selfPath = new Map();

  const travel = (wire, instructionIndex, start = '0|0') => {
    const fillGridCoordinate = (key) => {
      // prevent own wire crossing
      if (selfPath.has(key)) {
        return;
      }

      if (grid.has(key) && !selfPath.has(key)) {
        grid.set(key, grid.get(key) + 1);
      } else {
        grid.set(key, 1);
      }

      selfPath.set(key, 1);
    }

    // Parse the instruction to a direction and distance
    const arr = wire[instructionIndex].split('');
    const [dir] = arr.splice(0, 1);
    const distance = parseInt(arr.join(''), 10);

    // Start & destination
    const startX = parseInt(start.split('|')[0], 10);
    const startY = parseInt(start.split('|')[1], 10);
    let destination;

    switch (dir) {
      case 'U':
        for (let i = 1; i <= distance; i++) {
          fillGridCoordinate(`${startX}|${startY + i}`);
        }
        destination = `${startX}|${startY + distance}`;
        break;
      case 'D':
        for (let i = 1; i <= distance; i++) {
          fillGridCoordinate(`${startX}|${startY - i}`);
        }
        destination = `${startX}|${startY - distance}`;
        break;
      case 'R':
        for (let i = 1; i <= distance; i++) {
          fillGridCoordinate(`${startX + i}|${startY}`);
        }
        destination = `${startX + distance}|${startY}`;
        break;
      case 'L':
        for (let i = 1; i <= distance; i++) {
          fillGridCoordinate(`${startX - i}|${startY}`);
        }
        destination = `${startX - distance}|${startY}`;
        break;
    }

    // Go to the next instruction
    instructionIndex += 1;
    if (instructionIndex < wire.length) {
      return travel(wire, instructionIndex, destination);
    }

    return;
  }

  travel(wire, instructionIndex);
}

wire(wireA);
wire(wireB);

// Get the intersections from the grid
const intersections = [];
for (let entry of grid.entries()) {
  if (entry[1] > 1) {
    intersections.push(entry[0])
  }
}

// Compute the distances from central port (0|0)
const distances = [];
intersections.forEach(intersection => {
  distances.push(parseInt(Math.abs(intersection.split('|')[0], 10)) + Math.abs(parseInt(intersection.split('|')[1], 10)));
})

// Log the closest intersection
console.log(Math.min(...distances));