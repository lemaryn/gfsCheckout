var MILLISECONDS_IN_MINUTE=6e4;export default function getTimezoneOffsetInMilliseconds(dirtyDate){var date=new Date(dirtyDate.getTime()),baseTimezoneOffset=date.getTimezoneOffset();date.setSeconds(0,0);var millisecondsPartOfTimezoneOffset=date.getTime()%MILLISECONDS_IN_MINUTE;return baseTimezoneOffset*MILLISECONDS_IN_MINUTE+millisecondsPartOfTimezoneOffset}