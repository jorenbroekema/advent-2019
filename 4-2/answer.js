// const min = 123456;
// const min = 123470;
const min = 168630;
const max = 718098;

let count = 0;
for (let i = min; i <= max; i++) {

  const str = i.toString().split('');

  // never decrease
  if ([...str].join() !== [...str].sort().join()) {
    continue;
  }

  // if there's 2 (no more) adjacent duplicates at least once
  if (![...str].filter((v, i) => v === str[i + 1]).some(num => [...str].filter(ch => ch === num).length === 2)) {
    continue;
  }

  count++;
}
console.log(count);
