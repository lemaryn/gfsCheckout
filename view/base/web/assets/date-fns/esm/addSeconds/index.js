import toInteger from"../_lib/toInteger/index.js";import addMilliseconds from"../addMilliseconds/index.js";export default function addSeconds(dirtyDate,dirtyAmount){if(2>arguments.length){throw new TypeError("2 arguments required, but only "+arguments.length+" present")}var amount=toInteger(dirtyAmount);return addMilliseconds(dirtyDate,1e3*amount)}