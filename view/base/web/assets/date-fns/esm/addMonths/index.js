import toInteger from"../_lib/toInteger/index.js";import toDate from"../toDate/index.js";import getDaysInMonth from"../getDaysInMonth/index.js";export default function addMonths(dirtyDate,dirtyAmount){if(2>arguments.length){throw new TypeError("2 arguments required, but only "+arguments.length+" present")}var date=toDate(dirtyDate),amount=toInteger(dirtyAmount),desiredMonth=date.getMonth()+amount,dateWithDesiredMonth=new Date(0);dateWithDesiredMonth.setFullYear(date.getFullYear(),desiredMonth,1);dateWithDesiredMonth.setHours(0,0,0,0);var daysInMonth=getDaysInMonth(dateWithDesiredMonth);date.setMonth(desiredMonth,Math.min(daysInMonth,date.getDate()));return date}