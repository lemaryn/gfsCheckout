import toDate from"../toDate/index.js";export default function startOfQuarter(dirtyDate){if(1>arguments.length){throw new TypeError("1 argument required, but only "+arguments.length+" present")}var date=toDate(dirtyDate),currentMonth=date.getMonth();date.setMonth(currentMonth-currentMonth%3,1);date.setHours(0,0,0,0);return date}