import data from './data.js';
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

const getLayerIndexWithFewestZeros = (layers) => {
  let fewestZeros = {
    amount: Infinity,
    index: 0,
  }

  layers.forEach((layer, i) => {
    let zeroCount = 0;
    layer.forEach(row => {
      row.forEach(column => {
        if (column === 0) {
          zeroCount++;
        }
      });
    });

    if (zeroCount < fewestZeros.amount) {
      fewestZeros.amount = zeroCount;
      fewestZeros.index = i;
    }
  });

  return fewestZeros;
}

const getOnesAndTwos = (layer) => {
  let ones = 0;
  let twos = 0;
  layer.forEach(row => {
    row.forEach(column => {
      if (column === 1) {
        ones++;
      }

      if (column === 2) {
        twos++;
      }
    });
  });
  return { ones, twos };
}

const layers = fillLayers(digits);
const fewestZerosIndex = getLayerIndexWithFewestZeros(layers).index;
const { ones, twos } = getOnesAndTwos(layers[fewestZerosIndex]);
console.log(ones * twos);