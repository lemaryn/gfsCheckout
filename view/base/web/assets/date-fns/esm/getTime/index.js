import toDate from"../toDate/index.js";export default function getTime(dirtyDate){if(1>arguments.length){throw new TypeError("1 argument required, but only "+arguments.length+" present")}var date=toDate(dirtyDate),timestamp=date.getTime();return timestamp}