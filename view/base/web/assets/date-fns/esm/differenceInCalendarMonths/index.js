import toDate from"../toDate/index.js";export default function differenceInCalendarMonths(dirtyDateLeft,dirtyDateRight){if(2>arguments.length){throw new TypeError("2 arguments required, but only "+arguments.length+" present")}var dateLeft=toDate(dirtyDateLeft),dateRight=toDate(dirtyDateRight),yearDiff=dateLeft.getFullYear()-dateRight.getFullYear(),monthDiff=dateLeft.getMonth()-dateRight.getMonth();return 12*yearDiff+monthDiff}