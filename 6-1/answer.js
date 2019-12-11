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
import data from './data.js';
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

const getDirectOrbits = () => {
  const centralPlanets = [];
  for (let [key, value] of planets.entries()) {
    if (value.parent === undefined) {
      centralPlanets.push(key);
    }
  }

  let orbitCount = -1; // because central planets don't have a parent, so reduce by 1
  centralPlanets.forEach(planetKey => {
    const getKids = (planetKey) => {
      const planet = planets.get(planetKey);
      orbitCount++;
      if (planet.children.length > 0) {
        planet.children.forEach(child => {
          return getKids(child);
        });
      }
    };
    getKids(planetKey);
  });

  return orbitCount;
};

const getIndirectOrbits = () => {
  let indirectOrbitCount = 0;
  for (let [key, value] of planets.entries()) {
    let parentCount = 0;
    const loopThroughParents = (key) => {
      const planet = planets.get(key);
      if (planet.parent) {
        parentCount++;
        return loopThroughParents(planet.parent);
      }
    }

    if (value.parent) {
      loopThroughParents(key);
    }

    indirectOrbitCount += parentCount;
    if (parentCount > 0) {
      // reduce by 1, first parent is direct parent (direct orbit) and should not be counted
      indirectOrbitCount--;
    }
  }
  return indirectOrbitCount;
};

populatePlanetsMap(orbits);
console.log(getDirectOrbits() + getIndirectOrbits());
