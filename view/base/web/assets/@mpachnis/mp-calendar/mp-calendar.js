import"../../@polymer/polymer/polymer-legacy.js";import{html}from"../../@polymer/polymer/lib/utils/html-tag.js";import{dom}from"../../@polymer/polymer/lib/legacy/polymer.dom.js";import{PolymerElement}from"../../@polymer/polymer/polymer-element.js";import{afterNextRender}from"../../@polymer/polymer/lib/utils/render-status.js";import{GestureEventListeners}from"../../@polymer/polymer/lib/mixins/gesture-event-listeners.js";import"./mp-calendar-theme.js";class mpCalendar extends GestureEventListeners(PolymerElement){static get template(){return html`
            <style include="mp-calendar-theme"></style>

            <iron-a11y-keys id="a11y" target="{{target}}" keys="up down left right tab space" on-keys-pressed="{{chosen}}"></iron-a11y-keys>

            <div id="content">
                <div id="header">
                    <div class="month-display">
                        <div id="prev-month" on-click="prevMonthHandler">
                            <svg class="calendar-icon-left" viewBox="0 0 32 32" width="32px" height="32px">
                                <path d="M7.701,14.276l9.586-9.585c0.879-0.878,2.317-0.878,3.195,0l0.801,0.8c0.878,0.877,0.878,2.316,0,3.194  L13.968,16l7.315,7.315c0.878,0.878,0.878,2.317,0,3.194l-0.801,0.8c-0.878,0.879-2.316,0.879-3.195,0l-9.586-9.587  C7.229,17.252,7.02,16.62,7.054,16C7.02,15.38,7.229,14.748,7.701,14.276z"></path>
                            </svg>
                        </div>

                        <div id="currentMonth">
                            <span class="currentMonthDate">
                                <select id="montSelection" value="{{monthValue::change}}" title="Click to change month">
                                    <template is="dom-repeat" items="[[monthLabels]]" as="month">
                                        <option value="[[index]]">[[month]]</option>
                                    </template>
                                </select>

                                <select id="yearSelection" value="{{yearValue::change}}" title="Click to change year">
                                    <template is="dom-repeat" items="[[yearList]]" as="year">
                                        <option value="[[year]]">[[year]]</option>
                                    </template>
                                </select>
                            </span>
                            <span class="todayDate" on-click="goToCurrentDate" title="Go to current date">
                                <div class="show-inner-date">{{calendarDay}}</div>
                                <svg class="calendar-icon-todayDay" viewBox="0 0 1792 1792" width="28px" height="28px">
                                    <path d="M192 1664h1408v-1024h-1408v1024zm384-1216v-288q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v288q0 14 9 23t23 9h64q14 0 23-9t9-23zm768 0v-288q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v288q0 14 9 23t23 9h64q14 0 23-9t9-23zm384-64v1280q0 52-38 90t-90 38h-1408q-52 0-90-38t-38-90v-1280q0-52 38-90t90-38h128v-96q0-66 47-113t113-47h64q66 0 113 47t47 113v96h384v-96q0-66 47-113t113-47h64q66 0 113 47t47 113v96h128q52 0 90 38t38 90z"></path>
                                </svg>
                            </span>
                        </div>

                        <div id="next-month" on-click="nextMonthHandler">
                            <svg height="32px" class="calendar-icon-left" viewBox="0 0 32 32" width="32px">
                                <path d="M24.291,14.276L14.705,4.69c-0.878-0.878-2.317-0.878-3.195,0l-0.8,0.8c-0.878,0.877-0.878,2.316,0,3.194  L18.024,16l-7.315,7.315c-0.878,0.878-0.878,2.317,0,3.194l0.8,0.8c0.878,0.879,2.317,0.879,3.195,0l9.586-9.587  c0.472-0.471,0.682-1.103,0.647-1.723C24.973,15.38,24.763,14.748,24.291,14.276z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div id="mpCalendar">
                    <div class="mp-cld-labels">
                        <dom-repeat items="[[dayLabels]]">
                            <template>
                                <span class="mp-cld-label">[[item]]</span>
                            </template>
                        </dom-repeat>
                    </div>
                    <div id="cldDays" class="mp-cld-days"></div>
                </div>
            </div>
        `}static get is(){return"mp-calendar"}static get properties(){return{disablePrevDays:Boolean,disableNextDays:Boolean,showDaysInMonth:{type:Number,value:35},chosen:{type:String,notify:!0,reflectToAttribute:!0,observer:"_chosenHandler"},firstDayOfWeek:{type:Number,value:0},dayLabels:{type:Array,value:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},monthLabels:{type:Array,value:["January","February","March","April","May","June","July","August","September","October","November","December"]},showDate:{type:Object,value:{year:null,month:null,day:null},readOnly:!0},date:{type:Object,value:()=>{var d=new Date;return{year:d.getFullYear(),month:d.getMonth()+1,day:null,date:d}},observer:"_dateChanged"},disabledDates:{type:Array,value:[]},disabledDays:{type:Object,value:[]},disabledWeeks:{type:Array,value:[]},disabledInMonths:{type:Array,value:[1,2,3,4,5,6,7,8,9,10,11,12]},eventsFile:{type:String,observer:"_loadEvents"},eventsObject:{type:Object,observer:"_loadEvents"},eventDayColor:{type:String,value:"#b56ce2"},_eventsData:{type:Object,value:{}},theme:{type:String,value:""},minYear:{type:Number,value:5},maxYear:{type:Number,value:5},monthValue:{type:String,observer:"setMonth"},yearValue:{type:String,observer:"setYear"}}}constructor(){super()}connectedCallback(){super.connectedCallback();this._addListeners();var labelList=JSON.parse(JSON.stringify(this.dayLabels));if(0!=this.firstDayOfWeek){this.dayLabels=[];for(var i=0,dayName;i<labelList.length;i++){dayName=(i+this.firstDayOfWeek)%7;this.dayLabels.push(labelList[dayName])}}this.yearList=[];var d=new Date,minYear=d.getFullYear()-this.minYear,maxYear=d.getFullYear()+this.maxYear;for(minYear;minYear<=maxYear;minYear++){this.yearList.push(minYear)}}disconnectedCallback(){this._removeListeners()}ready(){super.ready();if(this.eventsFile){this._getJSON(this.eventsFile,json=>{this._eventsData=json;this._initCalandar(this.showDate.month,this.showDate.year);this._checkChosen()})}else{this._initCalandar(this.showDate.month,this.showDate.year);this._checkChosen()}this._checkTheme();afterNextRender(this,()=>{this.$.montSelection.value=this.showDate.month;this.$.yearSelection.value=this.showDate.year})}_addListeners(){this.$.mpCalendar.addEventListener("click",this._selectionHandler.bind(this))}_removeListeners(){this.$.mpCalendar.removeEventListener("click",this._selectionHandler.bind(this))}_checkTheme(){switch(this.theme){case"light-blue":this._lightBlueTheme();break;case"dark":this._darktTheme();break;}}_checkChosen(){if(""!==this.chosen&&this.chosen!==void 0){var date=new Date(this.chosen);this.showDate.year=date.getFullYear();this.date={year:this.showDate.year,month:date.getMonth()+1,day:date.getDate(),date:date,isoDate:this.chosen}}}_selectionHandler(e){if(null==e.target.getAttribute("data-date"))return;var dataDate=e.target.getAttribute("data-date"),dateObj=new Date(dataDate);this.chosen=dataDate;this.showDate.year=dateObj.getFullYear();this.date={year:this.showDate.year,month:dateObj.getMonth()+1,day:dateObj.getDate(),date:dateObj,isoDate:dataDate}}_chosenHandler(e){var chosenDate=new Date(e),chosenMonth=chosenDate.getMonth();if(chosenMonth==this.date.date.getMonth()){var selection=dom(this.$.cldDays).querySelector(".selected");if(selection){selection.classList.remove("selected")}if(""==e||null==e){this.chosen=""}else{this.chosen=e;var days=dom(this.$.mpCalendar).querySelectorAll(".day");days.forEach(e=>{if(this.chosen==e.getAttribute("data-date")){e.classList.add("selected")}});this.date.day=chosenDate.getDate()}}else{this.showDate={month:chosenMonth,year:chosenDate.getFullYear()}}}prevMonthHandler(){this.set("showDate.month",0>=this.showDate.month?11:this.showDate.month-1);this.set("showDate.year",11==this.showDate.month?this.showDate.year-1:this.showDate.year);this.chosen="";this.notifyPath("date.year",this.showDate.year);this.currentMonth=this.monthLabels[this.showDate.month];this._initCalandar(this.showDate.month,this.showDate.year);this.$.montSelection.value=this.showDate.month;this.$.yearSelection.value=this.showDate.year;this._fire("prevMonth")}nextMonthHandler(){this.set("showDate.month",11==this.showDate.month?0:this.showDate.month+1);this.set("showDate.year",0>=this.showDate.month?this.showDate.year+1:this.showDate.year);this.chosen="";this.notifyPath("date.year",this.showDate.year);this.currentMonth=this.monthLabels[this.showDate.month];this._initCalandar(this.showDate.month,this.showDate.year);this.$.montSelection.value=this.showDate.month;this.$.yearSelection.value=this.showDate.year;this._fire("nextMonth")}setMonth(month){this._setShowDate({month:month,year:this.showDate.year});this.chosen="";this._initCalandar(parseInt(month),this.showDate.year);this._fire("monthChanged")}setYear(year){this._setShowDate({month:this.showDate.month,year:year});this.chosen="";this._initCalandar(this.showDate.month,year);this._fire("monthChanged")}_fire(ev,el){this.dispatchEvent(new CustomEvent(ev,{bubbles:!0,composed:!0,detail:el}))}_dateChanged(newDate,oldDate){var date=new Date,month=parseInt(newDate.month)||1,year=parseInt(newDate.year)||date.getFullYear(),day=parseInt(newDate.day)||1;this.date.month=month;this.date.year=year;this.date.day=null!=this.date.day?day:null;this._setShowDate({month:month-1,year:year});this.currentMonth=this.monthLabels[this.showDate.month];this.calendarDay=null!=this.date.day?day:date.getDate();if(!!newDate&&!!oldDate){if(newDate.date.getMonth()>oldDate.date.getMonth()){this._initCalandar(this.showDate.month,this.showDate.year);this._fire("nextMonth")}if(newDate.date.getMonth()<oldDate.date.getMonth()){this._initCalandar(this.showDate.month,this.showDate.year);this._fire("prevMonth")}this._fire("dateSelected",this.date)}this.$.montSelection.value=this.showDate.month;this.$.yearSelection.value=this.showDate.year}goToCurrentDate(){var today=new Date;this.date={date:today,day:today.getDate(),month:today.getMonth()+1,year:today.getFullYear()};this.chosen="";this._initCalandar(this.showDate.month,this.showDate.year);this.$.montSelection.value=this.showDate.month;this.$.yearSelection.value=this.showDate.year;this._fire("currMonth")}_initCalandar(month,year){var today=new Date,thisDay=today.getDate(),thisMonth=today.getMonth()+1,dayOfMonthStart=0==new Date(year,month,1).getDay()?7:new Date(year,month,1).getDay(),calendarElem=dom(this.$.mpCalendar),previousMonth,previousYear,nextMonth,nextYear,previousMonthDays,disDays;this.$.cldDays.innerHTML="";if(0===month){previousMonth=11;previousYear=year-1}else{previousMonth=month-1;previousYear=year}if(11===month){nextMonth=0;nextYear=year+1}else{nextMonth=month+1;nextYear=year}if(0===month){previousMonthDays=this._numberOfDays(12,year)}else{previousMonthDays=this._numberOfDays(month,year)}var currentMonthDays=this._numberOfDays(month+1,year),nextMonthDays=this._numberOfDays(month+2,year),dayN=1,dayOfNextMonth=1,days=this.$.cldDays,showDaysInMonth=this.showDaysInMonth;if(5<=dayOfMonthStart&&37>this.showDaysInMonth&&29<currentMonthDays){showDaysInMonth=42}for(var i=0,day;i<showDaysInMonth;i++){day=document.createElement("span");if(0===i%7){var week=document.createElement("div");week.className+="mp-cld-week";week.setAttribute("week",i/7);if(""!=this.disabledWeeks||""!=this.disabledInMonths){this.disabledInMonths.forEach(disMonth=>{if(disMonth==month+1){this.disabledWeeks.forEach(disWeek=>{if(disWeek==i/7){week.className+=" disabledWeek"}})}})}}if(i<dayOfMonthStart-this.firstDayOfWeek){day.className+="mp-cld-day prevMonth";if(this.disablePrevDays){day.innerHTML+="&nbsp;";day.className+=" disabled"}else{var number=this._dayNumber(previousMonthDays-dayOfMonthStart+(i+1+this.firstDayOfWeek),previousMonth+1,previousYear,day)}}else if(dayN<=currentMonthDays){day.className+="mp-cld-day currMonth";var number=this._dayNumber(dayN++,month+1,year,day);if(dayN-1==thisDay&&month==thisMonth-1&&this.date.year==year){day.className+=" today"}if(this.chosen){if(dayN-1==this.date.day&&month==month&&this.date.year==year){day.className+=" selected"}}if(""!=this.disabledDays&&""!=this.disabledInMonths){this.disabledInMonths.forEach(disMonth=>{if(disMonth==month+1){this.disabledDays.forEach(disDay=>{this.dayLabels.forEach((labDay,d)=>{if(disDay===labDay){var date=new Date;date.setDate(d);date.setMonth(month);if(date.getFullYear()!=year){date.setYear(year)}disDays=this._getDisabledDays(d,month,year);disDays.forEach(date=>{if(date.getDate()==dayN-1){day.className+=" disabledDay"}})}})})}})}if(""!=this.disabledDates&&""!=this.disabledInMonths){this.disabledInMonths.forEach(disMonth=>{if(disMonth==month+1){this.disabledDates.forEach(disDay=>{if(disDay==dayN-1){day.className+=" disabledDay"}})}})}}else{day.className+="mp-cld-day nextMonth";if(this.disableNextDays){day.innerHTML+="&nbsp;";day.className+=" disabled"}else{var number=this._dayNumber(dayOfNextMonth++,nextMonth+1,nextYear,day)}}dom(days).appendChild(week);dom(week).appendChild(day)}dom(calendarElem).appendChild(days);if(this.eventsFile||this.eventsObject){this._findAllEvents(this._eventsData)}}_numberOfDays(month,year){return new Date(year,month,0).getDate()}_dayNumber(dayDate,month,year,dayElem){var span=document.createElement("span"),dd=(10>dayDate?"0":"")+dayDate,mm=(10>month?"0":"")+month;dayElem.className+=" day";dayElem.innerHTML+=dayDate;dayElem.setAttribute("data-date",year+"-"+mm+"-"+dd);dayElem.setAttribute("tabindex",0);return dayElem}_getDisabledDays(day,month,year){for(var disDays=[],monthDays=this._numberOfDays(month,year),i=0,date;i<=monthDays;i++){date=new Date(year,month,i,0);if(date.getDay()==day){disDays.push(date)}}return disDays}_getJSON(url,callback){var xhr=new XMLHttpRequest;xhr.onreadystatechange=function(){if(xhr.readyState===XMLHttpRequest.DONE&&200===xhr.status){callback(JSON.parse(xhr.responseText))}};xhr.open("GET",url,!0);xhr.send()}_findAllEvents(events){var today=new Date,dd=(10>today.getDate()?"0":"")+today.getDate(),mm=(10>today.getMonth()?"0":"")+(today.getMonth()+1),isoToday=today.getFullYear()+"-"+mm+"-"+dd;events.forEach(item=>{var selector=".day[data-date=\""+item.date+"\"]",result=this.$.content.querySelector(selector),event="",dayEvents=[],weight=0;if(result!=void 0||null!=result){for(var i in events){if(events[i].date===result.getAttribute("data-date")){dayEvents.push(events[i])}}if(3>=dayEvents.length){weight=3}else{result.style.boxShadow="inset -4px 0 0 0 "+this.eventDayColor+""}if(0<weight){var boxShadow="";for(var i in dayEvents){if(""!=boxShadow){boxShadow+=","}if(dayEvents[i].date===isoToday){boxShadow+="var(--today-boxshadow-color) 0 -2px 0 0 inset, "}boxShadow+="inset -"+(parseInt(i)+1)*weight+"px 0 0 0 "+(dayEvents[i].color==void 0?dayEvents[i].category:dayEvents[i].color)}result.style.boxShadow=boxShadow}if(0==result.children.length){event+="<div class=\"mp-cld-event\"><div class=\"event\">"+"<h3 class=\""+item.category+"\" "+(item.color?"style=\"color:"+item.color+"\"":"")+">"+item.title+""+"<i>"+item.date+"</i>"+"</h3>"+"<span>"+item.content+"</span>"+"</div></div>";dom(result).innerHTML+=event}else{for(var i=0;i<result.children.length;i++){event+="<span class=\"separator\"></span><div class=\"event\">"+"<h3 class=\""+item.category+"\" "+(item.color?"style=\"color:"+item.color+"\"":"")+">"+item.title+""+"<i>"+item.date+"</i>"+"</h3>"+"<span>"+item.content+"</span>"+"</div>";dom(result.children[i]).innerHTML+=event}}setTimeout(()=>{this.horizontallyBound(this,result.children[0])})}})}horizontallyBound(parentDiv,childDiv){var parentRect=parentDiv.getBoundingClientRect(),childRect=childDiv.getBoundingClientRect();if(childRect.left+childRect.width>parentRect.width){childDiv.classList.remove("mp-cld-event");childDiv.classList.add("eventLeft")}}_loadEvents(){if(this.eventsFile){this._getJSON(this.eventsFile,json=>{this._eventsData=json;this._initCalandar(this.showDate.month,this.showDate.year);this._checkChosen()})}else{this._eventsData=this.eventsObject;this._initCalandar(this.showDate.month,this.showDate.year);this._checkChosen()}}_lightBlueTheme(){this.updateStyles({"--main-bg":"#fff","--header-bg":"rgba(6, 143, 189, .85)","--main-header-color":"#fff","--header-icon-bg":"#fff","--header-icon-opacity":"","--labels-color":"#068fbd","--border-width":"1px","--border-right-width":"0","--border-color":"rgba(6, 143, 189, .15)","--prev-days-bg":"","--prev-days-color":"#068fbd","--curr-days-bg":"","--curr-days-color":"#068fbd","--next-days-bg":"","--next-days-color":"#068fbd","--disabled-color":"rgba(6, 143, 189, .3)","--disabled-text-shadow":"0 0 3px rgba(0, 0, 0, .25)","--selected-day-bg":"#078dc0","--today-boxshadow-color":"#077599","--selected-day-hover-bg":"rgba(6, 143, 189, .7)"})}_darktTheme(){this.updateStyles({"--main-bg":"#000","--header-bg":"#000","--main-header-color":"#fff","--header-icon-bg":"#f33127","--header-icon-opacity":"","--labels-color":"#fff","--border-width":"1px","--border-color":"rgba(255, 255, 255, .2)","--prev-days-color":"#fff","--curr-days-bg":"","--curr-days-color":"#fff","--prev-next-days-bg":"rgba(158, 21, 14, 0.6)","--next-days-color":"#fff","--disabled-color":"rgba(255, 255, 255, .3)","--disabled-text-shadow":"0 0 2px rgba(255, 255, 255, .35)","--selected-day-bg":"#af221b","--today-boxshadow-color":"#f33127","--selected-day-hover-bg":"rgba(255, 13, 0, .5)"})}}customElements.define(mpCalendar.is,mpCalendar);