import { wireA, wireB } from '../3-1/data.js';

const grid = new Map();

// 1) Function that processes wire path instructions
const wire = (wire) => {
  let instructionIndex = 0;

  // Keep track of coordinates filled by single wire
  const selfPath = new Map();
  const uniqueSelfPath = new Map(); // necessary for part 2... see below

  // 2) Process a single instruction
  const travel = (wire, instructionIndex, start = '0|0') => {
    // 3) Process a single coordinate
    const fillGridCoordinate = (key) => {

      if (selfPath.has(key)) {
        selfPath.set(key, selfPath.get(key) + 1);

        /**
         * Interesting note here.
         *
         * For part 2, we cannot just increment an existing key like we do with selfPath Map.
         *
         * For example, if the wire crosses itself we increment the key, this means no new key is added to the Map (order)
         *
         * If we follow the wire to an intersection and come across a coordinate where it crosses itself before we get to the intersection,
         * how often has the wire crossed itself before reaching the intersection. 0? Once? Twice?
         * We don't have that data in the Map. We can't know.
         *
         * This problem led to all the mock data examples from Advent passing, but not my input data.
         *
         * Instead we create a Map here that instead of incrementing the key, adds a unique key on top.
         * This way, we can know for sure the path the wire followed to the intersections
         */
        uniqueSelfPath.set(key + Math.random().toString(36).replace(/[^a-z]+/g, '').slice(0, 3), 1);
        return;
      } else {
        selfPath.set(key, 1);
        uniqueSelfPath.set(key, 1);
      }

      if (grid.has(key)) {
        grid.set(key, grid.get(key) + 1);
      } else {
        grid.set(key, 1);
      }
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

    // Recursive traveling until we run out of instructions
    instructionIndex += 1;
    if (instructionIndex < wire.length) {
      return travel(wire, instructionIndex, destination);
    }

    // Terminate recursion
    return;
  }

  travel(wire, instructionIndex);
  return uniqueSelfPath;
}

const getIntersections = () => {
  const intersections = [];
  for (let entry of grid.entries()) {
    if (entry[1] > 1) {
      intersections.push(entry[0]);
    }
  }
  return intersections;
}

const getStepsToIntersection = (path, intersection) => {
  let count = 0;
  for (let entry of path.entries()) {
    count += entry[1];
    if (entry[0] === intersection) {
      return count;
    }
  }
}

const pathA = wire(wireA);
const pathB = wire(wireB);

const intersections = getIntersections();

let minSteps = Infinity;
intersections.forEach(intersection => {
  const stepsA = getStepsToIntersection(pathA, intersection);
  const stepsB = getStepsToIntersection(pathB, intersection);
  if (stepsA + stepsB < minSteps) {
    minSteps = stepsA + stepsB;
  }
});

console.log(minSteps);
