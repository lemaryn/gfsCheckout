import getUTCWeekYear from"../../../_lib/getUTCWeekYear/index.js";import setUTCDay from"../../../_lib/setUTCDay/index.js";import setUTCWeek from"../../../_lib/setUTCWeek/index.js";import startOfUTCWeek from"../../../_lib/startOfUTCWeek/index.js";import setUTCISODay from"../../../_lib/setUTCISODay/index.js";import setUTCISOWeek from"../../../_lib/setUTCISOWeek/index.js";import startOfUTCISOWeek from"../../../_lib/startOfUTCISOWeek/index.js";var MILLISECONDS_IN_HOUR=36e5,MILLISECONDS_IN_MINUTE=6e4,MILLISECONDS_IN_SECOND=1e3,numericPatterns={month:/^(1[0-2]|0?\d)/,date:/^(3[0-1]|[0-2]?\d)/,dayOfYear:/^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,week:/^(5[0-3]|[0-4]?\d)/,hour23h:/^(2[0-3]|[0-1]?\d)/,hour24h:/^(2[0-4]|[0-1]?\d)/,hour11h:/^(1[0-1]|0?\d)/,hour12h:/^(1[0-2]|0?\d)/,minute:/^[0-5]?\d/,second:/^[0-5]?\d/,singleDigit:/^\d/,twoDigits:/^\d{1,2}/,threeDigits:/^\d{1,3}/,fourDigits:/^\d{1,4}/,anyDigitsSigned:/^-?\d+/,singleDigitSigned:/^-?\d/,twoDigitsSigned:/^-?\d{1,2}/,threeDigitsSigned:/^-?\d{1,3}/,fourDigitsSigned:/^-?\d{1,4}/},timezonePatterns={basicOptionalMinutes:/^([+-])(\d{2})(\d{2})?|Z/,basic:/^([+-])(\d{2})(\d{2})|Z/,basicOptionalSeconds:/^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,extended:/^([+-])(\d{2}):(\d{2})|Z/,extendedOptionalSeconds:/^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/};function parseNumericPattern(pattern,string,valueCallback){var matchResult=string.match(pattern);if(!matchResult){return null}var value=parseInt(matchResult[0],10);return{value:valueCallback?valueCallback(value):value,rest:string.slice(matchResult[0].length)}}function parseTimezonePattern(pattern,string){var matchResult=string.match(pattern);if(!matchResult){return null}if("Z"===matchResult[0]){return{value:0,rest:string.slice(1)}}var sign="+"===matchResult[1]?1:-1,hours=matchResult[2]?parseInt(matchResult[2],10):0,minutes=matchResult[3]?parseInt(matchResult[3],10):0,seconds=matchResult[5]?parseInt(matchResult[5],10):0;return{value:sign*(hours*MILLISECONDS_IN_HOUR+minutes*MILLISECONDS_IN_MINUTE+seconds*MILLISECONDS_IN_SECOND),rest:string.slice(matchResult[0].length)}}function parseAnyDigitsSigned(string,valueCallback){return parseNumericPattern(numericPatterns.anyDigitsSigned,string,valueCallback)}function parseNDigits(n,string,valueCallback){switch(n){case 1:return parseNumericPattern(numericPatterns.singleDigit,string,valueCallback);case 2:return parseNumericPattern(numericPatterns.twoDigits,string,valueCallback);case 3:return parseNumericPattern(numericPatterns.threeDigits,string,valueCallback);case 4:return parseNumericPattern(numericPatterns.fourDigits,string,valueCallback);default:return parseNumericPattern(new RegExp("^\\d{1,"+n+"}"),string,valueCallback);}}function parseNDigitsSigned(n,string,valueCallback){switch(n){case 1:return parseNumericPattern(numericPatterns.singleDigitSigned,string,valueCallback);case 2:return parseNumericPattern(numericPatterns.twoDigitsSigned,string,valueCallback);case 3:return parseNumericPattern(numericPatterns.threeDigitsSigned,string,valueCallback);case 4:return parseNumericPattern(numericPatterns.fourDigitsSigned,string,valueCallback);default:return parseNumericPattern(new RegExp("^-?\\d{1,"+n+"}"),string,valueCallback);}}function dayPeriodEnumToHours(enumValue){switch(enumValue){case"morning":return 4;case"evening":return 17;case"pm":case"noon":case"afternoon":return 12;case"am":case"midnight":case"night":default:return 0;}}function normalizeTwoDigitYear(twoDigitYear,currentYear){var isCommonEra=0<currentYear,absCurrentYear=isCommonEra?currentYear:1-currentYear,result;if(50>=absCurrentYear){result=twoDigitYear||100}else{var rangeEnd=absCurrentYear+50,rangeEndCentury=100*Math.floor(rangeEnd/100);result=twoDigitYear+rangeEndCentury-(twoDigitYear>=rangeEnd%100?100:0)}return isCommonEra?result:1-result}var DAYS_IN_MONTH=[31,28,31,30,31,30,31,31,30,31,30,31],DAYS_IN_MONTH_LEAP_YEAR=[31,29,31,30,31,30,31,31,30,31,30,31];function isLeapYearIndex(year){return 0===year%400||0===year%4&&0!==year%100}var parsers={G:{priority:140,parse:function(string,token,match){switch(token){case"G":case"GG":case"GGG":return match.era(string,{width:"abbreviated"})||match.era(string,{width:"narrow"});case"GGGGG":return match.era(string,{width:"narrow"});case"GGGG":default:return match.era(string,{width:"wide"})||match.era(string,{width:"abbreviated"})||match.era(string,{width:"narrow"});}},set:function(date,flags,value){date.setUTCFullYear(1===value?10:-9,0,1);date.setUTCHours(0,0,0,0);return date}},y:{priority:130,parse:function(string,token,match){var valueCallback=function(year){return{year:year,isTwoDigitYear:"yy"===token}};switch(token){case"y":return parseNDigits(4,string,valueCallback);case"yo":return match.ordinalNumber(string,{unit:"year",valueCallback:valueCallback});default:return parseNDigits(token.length,string,valueCallback);}},validate:function(date,value){return value.isTwoDigitYear||0<value.year},set:function(date,flags,value,options){var currentYear=getUTCWeekYear(date,options);if(value.isTwoDigitYear){var normalizedTwoDigitYear=normalizeTwoDigitYear(value.year,currentYear);date.setUTCFullYear(normalizedTwoDigitYear,0,1);date.setUTCHours(0,0,0,0);return date}var year=0<currentYear?value.year:1-value.year;date.setUTCFullYear(year,0,1);date.setUTCHours(0,0,0,0);return date}},Y:{priority:130,parse:function(string,token,match){var valueCallback=function(year){return{year:year,isTwoDigitYear:"YY"===token}};switch(token){case"Y":return parseNDigits(4,string,valueCallback);case"Yo":return match.ordinalNumber(string,{unit:"year",valueCallback:valueCallback});default:return parseNDigits(token.length,string,valueCallback);}},validate:function(date,value){return value.isTwoDigitYear||0<value.year},set:function(date,flags,value,options){var currentYear=date.getUTCFullYear();if(value.isTwoDigitYear){var normalizedTwoDigitYear=normalizeTwoDigitYear(value.year,currentYear);date.setUTCFullYear(normalizedTwoDigitYear,0,options.firstWeekContainsDate);date.setUTCHours(0,0,0,0);return startOfUTCWeek(date,options)}var year=0<currentYear?value.year:1-value.year;date.setUTCFullYear(year,0,options.firstWeekContainsDate);date.setUTCHours(0,0,0,0);return startOfUTCWeek(date,options)}},R:{priority:130,parse:function(string,token){if("R"===token){return parseNDigitsSigned(4,string)}return parseNDigitsSigned(token.length,string)},set:function(date,flags,value){var firstWeekOfYear=new Date(0);firstWeekOfYear.setUTCFullYear(value,0,4);firstWeekOfYear.setUTCHours(0,0,0,0);return startOfUTCISOWeek(firstWeekOfYear)}},u:{priority:130,parse:function(string,token){if("u"===token){return parseNDigitsSigned(4,string)}return parseNDigitsSigned(token.length,string)},set:function(date,flags,value){date.setUTCFullYear(value,0,1);date.setUTCHours(0,0,0,0);return date}},Q:{priority:120,parse:function(string,token,match){switch(token){case"Q":case"QQ":return parseNDigits(token.length,string);case"Qo":return match.ordinalNumber(string,{unit:"quarter"});case"QQQ":return match.quarter(string,{width:"abbreviated",context:"formatting"})||match.quarter(string,{width:"narrow",context:"formatting"});case"QQQQQ":return match.quarter(string,{width:"narrow",context:"formatting"});case"QQQQ":default:return match.quarter(string,{width:"wide",context:"formatting"})||match.quarter(string,{width:"abbreviated",context:"formatting"})||match.quarter(string,{width:"narrow",context:"formatting"});}},validate:function(date,value){return 1<=value&&4>=value},set:function(date,flags,value){date.setUTCMonth(3*(value-1),1);date.setUTCHours(0,0,0,0);return date}},q:{priority:120,parse:function(string,token,match){switch(token){case"q":case"qq":return parseNDigits(token.length,string);case"qo":return match.ordinalNumber(string,{unit:"quarter"});case"qqq":return match.quarter(string,{width:"abbreviated",context:"standalone"})||match.quarter(string,{width:"narrow",context:"standalone"});case"qqqqq":return match.quarter(string,{width:"narrow",context:"standalone"});case"qqqq":default:return match.quarter(string,{width:"wide",context:"standalone"})||match.quarter(string,{width:"abbreviated",context:"standalone"})||match.quarter(string,{width:"narrow",context:"standalone"});}},validate:function(date,value){return 1<=value&&4>=value},set:function(date,flags,value){date.setUTCMonth(3*(value-1),1);date.setUTCHours(0,0,0,0);return date}},M:{priority:110,parse:function(string,token,match){var valueCallback=function(value){return value-1};switch(token){case"M":return parseNumericPattern(numericPatterns.month,string,valueCallback);case"MM":return parseNDigits(2,string,valueCallback);case"Mo":return match.ordinalNumber(string,{unit:"month",valueCallback:valueCallback});case"MMM":return match.month(string,{width:"abbreviated",context:"formatting"})||match.month(string,{width:"narrow",context:"formatting"});case"MMMMM":return match.month(string,{width:"narrow",context:"formatting"});case"MMMM":default:return match.month(string,{width:"wide",context:"formatting"})||match.month(string,{width:"abbreviated",context:"formatting"})||match.month(string,{width:"narrow",context:"formatting"});}},validate:function(date,value){return 0<=value&&11>=value},set:function(date,flags,value){date.setUTCMonth(value,1);date.setUTCHours(0,0,0,0);return date}},L:{priority:110,parse:function(string,token,match){var valueCallback=function(value){return value-1};switch(token){case"L":return parseNumericPattern(numericPatterns.month,string,valueCallback);case"LL":return parseNDigits(2,string,valueCallback);case"Lo":return match.ordinalNumber(string,{unit:"month",valueCallback:valueCallback});case"LLL":return match.month(string,{width:"abbreviated",context:"standalone"})||match.month(string,{width:"narrow",context:"standalone"});case"LLLLL":return match.month(string,{width:"narrow",context:"standalone"});case"LLLL":default:return match.month(string,{width:"wide",context:"standalone"})||match.month(string,{width:"abbreviated",context:"standalone"})||match.month(string,{width:"narrow",context:"standalone"});}},validate:function(date,value){return 0<=value&&11>=value},set:function(date,flags,value){date.setUTCMonth(value,1);date.setUTCHours(0,0,0,0);return date}},w:{priority:100,parse:function(string,token,match){switch(token){case"w":return parseNumericPattern(numericPatterns.week,string);case"wo":return match.ordinalNumber(string,{unit:"week"});default:return parseNDigits(token.length,string);}},validate:function(date,value){return 1<=value&&53>=value},set:function(date,flags,value,options){return startOfUTCWeek(setUTCWeek(date,value,options),options)}},I:{priority:100,parse:function(string,token,match){switch(token){case"I":return parseNumericPattern(numericPatterns.week,string);case"Io":return match.ordinalNumber(string,{unit:"week"});default:return parseNDigits(token.length,string);}},validate:function(date,value){return 1<=value&&53>=value},set:function(date,flags,value,options){return startOfUTCISOWeek(setUTCISOWeek(date,value,options),options)}},d:{priority:90,parse:function(string,token,match){switch(token){case"d":return parseNumericPattern(numericPatterns.date,string);case"do":return match.ordinalNumber(string,{unit:"date"});default:return parseNDigits(token.length,string);}},validate:function(date,value){var year=date.getUTCFullYear(),isLeapYear=isLeapYearIndex(year),month=date.getUTCMonth();if(isLeapYear){return 1<=value&&value<=DAYS_IN_MONTH_LEAP_YEAR[month]}else{return 1<=value&&value<=DAYS_IN_MONTH[month]}},set:function(date,flags,value){date.setUTCDate(value);date.setUTCHours(0,0,0,0);return date}},D:{priority:90,parse:function(string,token,match){switch(token){case"D":case"DD":return parseNumericPattern(numericPatterns.dayOfYear,string);case"Do":return match.ordinalNumber(string,{unit:"date"});default:return parseNDigits(token.length,string);}},validate:function(date,value){var year=date.getUTCFullYear(),isLeapYear=isLeapYearIndex(year);if(isLeapYear){return 1<=value&&366>=value}else{return 1<=value&&365>=value}},set:function(date,flags,value){date.setUTCMonth(0,value);date.setUTCHours(0,0,0,0);return date}},E:{priority:90,parse:function(string,token,match){switch(token){case"E":case"EE":case"EEE":return match.day(string,{width:"abbreviated",context:"formatting"})||match.day(string,{width:"short",context:"formatting"})||match.day(string,{width:"narrow",context:"formatting"});case"EEEEE":return match.day(string,{width:"narrow",context:"formatting"});case"EEEEEE":return match.day(string,{width:"short",context:"formatting"})||match.day(string,{width:"narrow",context:"formatting"});case"EEEE":default:return match.day(string,{width:"wide",context:"formatting"})||match.day(string,{width:"abbreviated",context:"formatting"})||match.day(string,{width:"short",context:"formatting"})||match.day(string,{width:"narrow",context:"formatting"});}},validate:function(date,value){return 0<=value&&6>=value},set:function(date,flags,value,options){date=setUTCDay(date,value,options);date.setUTCHours(0,0,0,0);return date}},e:{priority:90,parse:function(string,token,match,options){var valueCallback=function(value){var wholeWeekDays=7*Math.floor((value-1)/7);return(value+options.weekStartsOn+6)%7+wholeWeekDays};switch(token){case"e":case"ee":return parseNDigits(token.length,string,valueCallback);case"eo":return match.ordinalNumber(string,{unit:"day",valueCallback:valueCallback});case"eee":return match.day(string,{width:"abbreviated",context:"formatting"})||match.day(string,{width:"short",context:"formatting"})||match.day(string,{width:"narrow",context:"formatting"});case"eeeee":return match.day(string,{width:"narrow",context:"formatting"});case"eeeeee":return match.day(string,{width:"short",context:"formatting"})||match.day(string,{width:"narrow",context:"formatting"});case"eeee":default:return match.day(string,{width:"wide",context:"formatting"})||match.day(string,{width:"abbreviated",context:"formatting"})||match.day(string,{width:"short",context:"formatting"})||match.day(string,{width:"narrow",context:"formatting"});}},validate:function(date,value){return 0<=value&&6>=value},set:function(date,flags,value,options){date=setUTCDay(date,value,options);date.setUTCHours(0,0,0,0);return date}},c:{priority:90,parse:function(string,token,match,options){var valueCallback=function(value){var wholeWeekDays=7*Math.floor((value-1)/7);return(value+options.weekStartsOn+6)%7+wholeWeekDays};switch(token){case"c":case"cc":return parseNDigits(token.length,string,valueCallback);case"co":return match.ordinalNumber(string,{unit:"day",valueCallback:valueCallback});case"ccc":return match.day(string,{width:"abbreviated",context:"standalone"})||match.day(string,{width:"short",context:"standalone"})||match.day(string,{width:"narrow",context:"standalone"});case"ccccc":return match.day(string,{width:"narrow",context:"standalone"});case"cccccc":return match.day(string,{width:"short",context:"standalone"})||match.day(string,{width:"narrow",context:"standalone"});case"cccc":default:return match.day(string,{width:"wide",context:"standalone"})||match.day(string,{width:"abbreviated",context:"standalone"})||match.day(string,{width:"short",context:"standalone"})||match.day(string,{width:"narrow",context:"standalone"});}},validate:function(date,value){return 0<=value&&6>=value},set:function(date,flags,value,options){date=setUTCDay(date,value,options);date.setUTCHours(0,0,0,0);return date}},i:{priority:90,parse:function(string,token,match){var valueCallback=function(value){if(0===value){return 7}return value};switch(token){case"i":case"ii":return parseNDigits(token.length,string);case"io":return match.ordinalNumber(string,{unit:"day"});case"iii":return match.day(string,{width:"abbreviated",context:"formatting",valueCallback:valueCallback})||match.day(string,{width:"short",context:"formatting",valueCallback:valueCallback})||match.day(string,{width:"narrow",context:"formatting",valueCallback:valueCallback});case"iiiii":return match.day(string,{width:"narrow",context:"formatting",valueCallback:valueCallback});case"iiiiii":return match.day(string,{width:"short",context:"formatting",valueCallback:valueCallback})||match.day(string,{width:"narrow",context:"formatting",valueCallback:valueCallback});case"iiii":default:return match.day(string,{width:"wide",context:"formatting",valueCallback:valueCallback})||match.day(string,{width:"abbreviated",context:"formatting",valueCallback:valueCallback})||match.day(string,{width:"short",context:"formatting",valueCallback:valueCallback})||match.day(string,{width:"narrow",context:"formatting",valueCallback:valueCallback});}},validate:function(date,value){return 1<=value&&7>=value},set:function(date,flags,value,options){date=setUTCISODay(date,value,options);date.setUTCHours(0,0,0,0);return date}},a:{priority:80,parse:function(string,token,match){switch(token){case"a":case"aa":case"aaa":return match.dayPeriod(string,{width:"abbreviated",context:"formatting"})||match.dayPeriod(string,{width:"narrow",context:"formatting"});case"aaaaa":return match.dayPeriod(string,{width:"narrow",context:"formatting"});case"aaaa":default:return match.dayPeriod(string,{width:"wide",context:"formatting"})||match.dayPeriod(string,{width:"abbreviated",context:"formatting"})||match.dayPeriod(string,{width:"narrow",context:"formatting"});}},set:function(date,flags,value){date.setUTCHours(dayPeriodEnumToHours(value),0,0,0);return date}},b:{priority:80,parse:function(string,token,match){switch(token){case"b":case"bb":case"bbb":return match.dayPeriod(string,{width:"abbreviated",context:"formatting"})||match.dayPeriod(string,{width:"narrow",context:"formatting"});case"bbbbb":return match.dayPeriod(string,{width:"narrow",context:"formatting"});case"bbbb":default:return match.dayPeriod(string,{width:"wide",context:"formatting"})||match.dayPeriod(string,{width:"abbreviated",context:"formatting"})||match.dayPeriod(string,{width:"narrow",context:"formatting"});}},set:function(date,flags,value){date.setUTCHours(dayPeriodEnumToHours(value),0,0,0);return date}},B:{priority:80,parse:function(string,token,match){switch(token){case"B":case"BB":case"BBB":return match.dayPeriod(string,{width:"abbreviated",context:"formatting"})||match.dayPeriod(string,{width:"narrow",context:"formatting"});case"BBBBB":return match.dayPeriod(string,{width:"narrow",context:"formatting"});case"BBBB":default:return match.dayPeriod(string,{width:"wide",context:"formatting"})||match.dayPeriod(string,{width:"abbreviated",context:"formatting"})||match.dayPeriod(string,{width:"narrow",context:"formatting"});}},set:function(date,flags,value){date.setUTCHours(dayPeriodEnumToHours(value),0,0,0);return date}},h:{priority:70,parse:function(string,token,match){switch(token){case"h":return parseNumericPattern(numericPatterns.hour12h,string);case"ho":return match.ordinalNumber(string,{unit:"hour"});default:return parseNDigits(token.length,string);}},validate:function(date,value){return 1<=value&&12>=value},set:function(date,flags,value){var isPM=12<=date.getUTCHours();if(isPM&&12>value){date.setUTCHours(value+12,0,0,0)}else if(!isPM&&12===value){date.setUTCHours(0,0,0,0)}else{date.setUTCHours(value,0,0,0)}return date}},H:{priority:70,parse:function(string,token,match){switch(token){case"H":return parseNumericPattern(numericPatterns.hour23h,string);case"Ho":return match.ordinalNumber(string,{unit:"hour"});default:return parseNDigits(token.length,string);}},validate:function(date,value){return 0<=value&&23>=value},set:function(date,flags,value){date.setUTCHours(value,0,0,0);return date}},K:{priority:70,parse:function(string,token,match){switch(token){case"K":return parseNumericPattern(numericPatterns.hour11h,string);case"Ko":return match.ordinalNumber(string,{unit:"hour"});default:return parseNDigits(token.length,string);}},validate:function(date,value){return 0<=value&&11>=value},set:function(date,flags,value){var isPM=12<=date.getUTCHours();if(isPM&&12>value){date.setUTCHours(value+12,0,0,0)}else{date.setUTCHours(value,0,0,0)}return date}},k:{priority:70,parse:function(string,token,match){switch(token){case"k":return parseNumericPattern(numericPatterns.hour24h,string);case"ko":return match.ordinalNumber(string,{unit:"hour"});default:return parseNDigits(token.length,string);}},validate:function(date,value){return 1<=value&&24>=value},set:function(date,flags,value){var hours=24>=value?value%24:value;date.setUTCHours(hours,0,0,0);return date}},m:{priority:60,parse:function(string,token,match){switch(token){case"m":return parseNumericPattern(numericPatterns.minute,string);case"mo":return match.ordinalNumber(string,{unit:"minute"});default:return parseNDigits(token.length,string);}},validate:function(date,value){return 0<=value&&59>=value},set:function(date,flags,value){date.setUTCMinutes(value,0,0);return date}},s:{priority:50,parse:function(string,token,match){switch(token){case"s":return parseNumericPattern(numericPatterns.second,string);case"so":return match.ordinalNumber(string,{unit:"second"});default:return parseNDigits(token.length,string);}},validate:function(date,value){return 0<=value&&59>=value},set:function(date,flags,value){date.setUTCSeconds(value,0);return date}},S:{priority:30,parse:function(string,token){return parseNDigits(token.length,string,function(value){return Math.floor(value*Math.pow(10,-token.length+3))})},set:function(date,flags,value){date.setUTCMilliseconds(value);return date}},X:{priority:10,parse:function(string,token){switch(token){case"X":return parseTimezonePattern(timezonePatterns.basicOptionalMinutes,string);case"XX":return parseTimezonePattern(timezonePatterns.basic,string);case"XXXX":return parseTimezonePattern(timezonePatterns.basicOptionalSeconds,string);case"XXXXX":return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds,string);case"XXX":default:return parseTimezonePattern(timezonePatterns.extended,string);}},set:function(date,flags,value){if(flags.timestampIsSet){return date}return new Date(date.getTime()-value)}},x:{priority:10,parse:function(string,token){switch(token){case"x":return parseTimezonePattern(timezonePatterns.basicOptionalMinutes,string);case"xx":return parseTimezonePattern(timezonePatterns.basic,string);case"xxxx":return parseTimezonePattern(timezonePatterns.basicOptionalSeconds,string);case"xxxxx":return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds,string);case"xxx":default:return parseTimezonePattern(timezonePatterns.extended,string);}},set:function(date,flags,value){if(flags.timestampIsSet){return date}return new Date(date.getTime()-value)}},t:{priority:40,parse:function(string){return parseAnyDigitsSigned(string)},set:function(date,flags,value){return[new Date(1e3*value),{timestampIsSet:!0}]}},T:{priority:20,parse:function(string){return parseAnyDigitsSigned(string)},set:function(date,flags,value){return[new Date(value),{timestampIsSet:!0}]}}};export default parsers;