import toInteger from"../toInteger/index.js";import toDate from"../../toDate/index.js";export default function startOfUTCWeek(dirtyDate,dirtyOptions){if(1>arguments.length){throw new TypeError("1 argument required, but only "+arguments.length+" present")}var options=dirtyOptions||{},locale=options.locale,localeWeekStartsOn=locale&&locale.options&&locale.options.weekStartsOn,defaultWeekStartsOn=null==localeWeekStartsOn?0:toInteger(localeWeekStartsOn),weekStartsOn=null==options.weekStartsOn?defaultWeekStartsOn:toInteger(options.weekStartsOn);if(!(0<=weekStartsOn&&6>=weekStartsOn)){throw new RangeError("weekStartsOn must be between 0 and 6 inclusively")}var date=toDate(dirtyDate),day=date.getUTCDay(),diff=(day<weekStartsOn?7:0)+day-weekStartsOn;date.setUTCDate(date.getUTCDate()-diff);date.setUTCHours(0,0,0,0);return date}