import toInteger from"../_lib/toInteger/index.js";import addISOWeekYears from"../addISOWeekYears/index.js";export default function subISOWeekYears(dirtyDate,dirtyAmount){if(2>arguments.length){throw new TypeError("2 arguments required, but only "+arguments.length+" present")}var amount=toInteger(dirtyAmount);return addISOWeekYears(dirtyDate,-amount)}