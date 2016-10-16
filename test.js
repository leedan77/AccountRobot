let a = ["abc", ""];

let b = a.reduce((acc, x) => {
  console.log(x);
  if (x) {
    console.log(acc);
    acc.push(x);
  }
  return acc;
}, []);

console.log(b);
