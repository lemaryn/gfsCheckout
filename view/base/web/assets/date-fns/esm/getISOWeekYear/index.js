import toDate from"../toDate/index.js";import startOfISOWeek from"../startOfISOWeek/index.js";export default function getISOWeekYear(dirtyDate){if(1>arguments.length){throw new TypeError("1 argument required, but only "+arguments.length+" present")}var date=toDate(dirtyDate),year=date.getFullYear(),fourthOfJanuaryOfNextYear=new Date(0);fourthOfJanuaryOfNextYear.setFullYear(year+1,0,4);fourthOfJanuaryOfNextYear.setHours(0,0,0,0);var startOfNextYear=startOfISOWeek(fourthOfJanuaryOfNextYear),fourthOfJanuaryOfThisYear=new Date(0);fourthOfJanuaryOfThisYear.setFullYear(year,0,4);fourthOfJanuaryOfThisYear.setHours(0,0,0,0);var startOfThisYear=startOfISOWeek(fourthOfJanuaryOfThisYear);if(date.getTime()>=startOfNextYear.getTime()){return year+1}else if(date.getTime()>=startOfThisYear.getTime()){return year}else{return year-1}}