// // let a1 = Buffer.from([18, 117]);
// // console.log(a1.readUInt16BE(0));  // logs 4725

// // let a2 = Buffer.from([117, 18]);
// // console.log(a2.readUInt16LE(0));  // logs 4725


// const fs = require('fs');

// const contents = fs.readFileSync('vel_563x3937.raw');
// const buff = Buffer.from(contents);
// for (let ii = 0; ii < 5; ii++) {
//   console.log(buff.readFloatBE(3937 * 200 * 4 + ii * 4));
// }

const x = new Float32Array(4);
x[0] = 1.234;
x[1] = 2.456;
x[2] = 3.567;
x[3] = 4.678;
console.log(Math.max.apply(Math, x));
console.log(Math.min.apply(Math, x));
