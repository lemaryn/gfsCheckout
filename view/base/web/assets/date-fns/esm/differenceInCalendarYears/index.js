import toDate from"../toDate/index.js";export default function differenceInCalendarYears(dirtyDateLeft,dirtyDateRight){if(2>arguments.length){throw new TypeError("2 arguments required, but only "+arguments.length+" present")}var dateLeft=toDate(dirtyDateLeft),dateRight=toDate(dirtyDateRight);return dateLeft.getFullYear()-dateRight.getFullYear()}