/**
 * Direct orbits:
 * 1) For each parentless planet (aka central planet)
 * 2) Go through children recursively until children is empty array, make sure to return the count of recursive steps
 * 3) Sum of all children-chains is your direct orbits
 *
 * Indirect orbits:
 * 1) For each planet
 * 2) Get amount of parents recursively (parent->parent->parent)
 * 3) Take the sum of those parents. If it's more than 0, subtract 1 (own direct parent = direct orbit) to get the indirect orbits
 * 4) Sum of all those parent-sums for all planets = indirect orbits
 *
 * Most interesting part here is getting the data structure right. Every planet has a key/value in the Map.
 * The key is the name of the planet.
 * The value is an object which contains an array of children (planet names), and a parent (planet name).
 *
 * Alternative could have been class based, this problem is a great candidate for OOP. But I wanted to try functional approach.
 */
import data from '../6-1/data.js';
const orbits = data.split('\n');
const planets = new Map();

const updatePlanet = (key, { child = null, parent = null }) => {
  const curr = planets.get(key);
  const updateChild = child && !curr.children.includes(child);
  planets.set(key, {
    parent: parent || curr.parent,
    children: (updateChild ? [...curr.children, child] : [...curr.children]),
  });
};

const addPlanet = (key, { child = null, parent = null }) => {
  planets.set(key, {
    parent: (parent ? parent : undefined),
    children: (child ? [child] : []),
  });
};

const processParent = (key, child) => {
  if (planets.has(key)) {
    updatePlanet(key, { child });
  } else {
    addPlanet(key, { child });
  }
};

const processChild = (key, parent) => {
  if (planets.has(key)) {
    updatePlanet(key, { parent })
  } else {
    addPlanet(key, { parent });
  }
};

const populatePlanetsMap = (arr) => {
  arr.forEach(relation => {
    const [parent, child] = relation.split(')');

    processParent(parent, child);
    processChild(child, parent);
  })
};

const getSharedParent = (you, san) => {
  const fetchParents = (key) => {
    const planet = planets.get(key);
    if (planet.parent) {
      return [planet.parent, fetchParents(planet.parent)].flat();
    }
  }
  const youParents = fetchParents(you);
  const sanParents = fetchParents(san);

  // Using traditional for because you can return out of it easily when you find the match
  // since it's wrapped in getSharedParent function
  for (let i = 0; i < youParents.length; i++) {
    for (let j = 0; j < sanParents.length; j++) {
      if (youParents[i] === sanParents[j]) {
        return { parentKey: youParents[i], orbitalTransfersToParentFromYou: i, orbitalTransfersToParentFromSan: j };
      }
    }
  }
};

populatePlanetsMap(orbits);

const { orbitalTransfersToParentFromYou, orbitalTransfersToParentFromSan } = getSharedParent('YOU', 'SAN');
console.log(orbitalTransfersToParentFromSan + orbitalTransfersToParentFromYou);
