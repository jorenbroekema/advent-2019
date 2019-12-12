import data from '../8-1/data.js';
const digits = data.split('').map(str => parseInt(str, 10));
const columns = 25; // 25
const rows = 6; // 6

const fillLayers = (data) => {
  const layers = [];
  let columnCount = 0;
  let rowCount = 0;
  let currentLayer = new Array(rows).fill(0).map(() => new Array(columns).fill(0));

  for (let i = 0; i < data.length; i++) {
    currentLayer[rowCount][columnCount] = data[i];

    columnCount++;
    if (columnCount === columns) {
      rowCount++;
      if (rowCount === rows) {
        rowCount = 0;
        layers.push(currentLayer);
        currentLayer = new Array(rows).fill(0).map(() => new Array(columns).fill(0));
      }
      columnCount = 0;
    }
  }
  return layers;
}

const flattenedLayer = (layers) => {
  const flattened = new Array(rows).fill(2).map(() => new Array(columns).fill(2))
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      layers.forEach(layer => {
        if (flattened[i][j] === 2) {
          flattened[i][j] = layer[i][j];
        }
      });
    }
  }
  return flattened;
};

const layers = fillLayers(digits);
const flattened = flattenedLayer(layers);
console.table(flattened);
