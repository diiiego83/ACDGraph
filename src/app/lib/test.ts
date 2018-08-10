// // // let a1 = Buffer.from([18, 117]);
// // // console.log(a1.readUInt16BE(0));  // logs 4725

// // // let a2 = Buffer.from([117, 18]);
// // // console.log(a2.readUInt16LE(0));  // logs 4725


// // const fs = require('fs');

// // const contents = fs.readFileSync('vel_563x3937.raw');
// // const buff = Buffer.from(contents);
// // for (let ii = 0; ii < 5; ii++) {
// //   console.log(buff.readFloatBE(3937 * 200 * 4 + ii * 4));
// // }

// const fs = require('fs');

// const data = fs.readFileSync('../../../cmap/jet.raw');

// const sr = 0, sg = 256 * 4, sb = 512 * 4;
// const rb = new Float32Array(256);
// const gb = new Float32Array(256);
// const bb = new Float32Array(256);
// for (let ii = 0, jj = 0; ii < data.length / 3; ii += 4, jj++) {
//   rb[jj] = data.readFloatLE(sr + ii);
//   gb[jj] = data.readFloatLE(sg + ii);
//   bb[jj] = data.readFloatLE(sb + ii);
// }

// let minx = rb[0];
// let maxx = rb[0];
// rb.forEach(val => { if (val < minx) { minx = val; } if (val > maxx) { maxx = val; } });
// let ratio = maxx - minx;
// if (ratio === 0.0) { ratio = 1.0; }
// ratio = 255.0 / ratio;

// const rv = new Uint8Array(256);
// const gv = new Uint8Array(256);
// const bv = new Uint8Array(256);
// const cmap: number[] = [256];
// for (let ii = 0; ii < 256; ii ++) {
//   rv[ii] = Math.round(rb[ii] * ratio);
//   gv[ii] = Math.round(gb[ii] * ratio);
//   bv[ii] = Math.round(bb[ii] * ratio);
//   cmap[ii] = (0xff << 24) | (Math.round(bb[ii] * ratio) << 16) | (Math.round(gb[ii] * ratio) << 8) | (Math.round(rb[ii] * ratio));
// }

// for (let ii = 0; ii < 256; ii ++) {
//   console.log(ii + ') ' + bv[ii] + ', ' + gv[ii] + ', ' + rv[ii] + ' --> ' + cmap[ii]);
//   // console.log(cmap[ii] + ',');
// }


// // const oReq = new XMLHttpRequest();
// // oReq.open('GET', '/cmap/gray.raw', true);
// // oReq.responseType = 'arraybuffer';
// // oReq.onload = oEvent => {
// //   const arrayBuffer = oReq.response; // Note: not oReq.responseText
// //   if (arrayBuffer) {
// //     console.log(arrayBuffer);
// //   }
// // };
// // oReq.send(null);
