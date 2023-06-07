// based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log
//
// // 2 x 2 x 2 = 8
// console.log(getBaseLog(2, 8));
// // Expected output: 3

export const getBaseLog = (x: number, y: number) => Math.floor(Math.log(y) / Math.log(x));
