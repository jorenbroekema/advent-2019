const min = 168630;
const max = 718098;

let count = 0;
for (let i = min; i <= max; i++) {

  const str = i.toString().split('');

  // never decrease
  if ([...str].join() !== [...str].sort().join()) {
    continue;
  }

  // minimum 2 adjacent digits are the same
  if (!([...str].filter((v, i) => v === [...str][i + 1]).length)) {
    continue;
  }

  count++;
}

console.log(count);