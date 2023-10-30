// Elements
const datePicker = document.querySelector("#datePicker"),
  input = document.querySelector("#input"),
  monthHeaderTitle = document.querySelector("#monthHeaderTitle"),
  monthHeaderPrev = document.querySelector("#monthHeaderPrev"),
  monthHeaderNext = document.querySelector("#monthHeaderNext"),
  datePickerBody = document.querySelector("#datePickerBody"),
  datePickerHead = document.querySelector('#datePickerHead'),
  changeLocale = document.querySelector('#changeLocale'),
  goToday = document.querySelector('#goToday'),
  confirmDate = document.querySelector('#confirmDate');

/// Variables
let locale = "fa",
  month = 0;
const weekDaysEn = [
  "Friday",
  "Thursday",
  "Wednesday",
  "Tuesday",
  "Monday",
  "Sunday",
  "Saturday",
];
const weekDaysFa = [
  "شنبه",
  "یک‌شنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];
const configuration = {
  "2023-10-30" : {
    price : 50000,
    description : 'توضیحات',
    disabled: false,
    color: null,
    bgColor: null
  },
  "2023-10-2" : {
    price : 2600000,
    description : '23توضیحات',
    disabled: true,
    color: null,
    bgColor: null,
  },
  "2023-10-5" : {
    price : 10000,
    description : '23توضیحات',
    disabled: false,
    color: null,
    bgColor: 'pink',
  },
  "2023-10-17" : {
    price : 1200000,
    description : 'توضیحات 33333',
    disabled: false,
    color: 'red',
    bgColor: null
  },
}

// Functions
function dayWeekHandler(){
  let output = document.createElement('tr');
  if(locale === 'fa'){
    weekDaysFa.forEach((day) => {
      const th = document.createElement('th');
      th.appendChild(document.createTextNode(day.slice(0,1)));
      output.appendChild(th);
    });
  } else{
    weekDaysEn.forEach((day) => {
      const th = document.createElement('th');
      th.appendChild(document.createTextNode(day.slice(0,2)));
      output.appendChild(th);
    });
  }

  datePickerHead.innerHTML = output.innerHTML;
}
function mainHandler(command = "", isToday = false) {
  dayWeekHandler();

  if(isToday) month = 0;
  else command === "next" ? ++month : command === 'prev' ? --month : false;

  const today = new Date();
  const date = moment(today).locale(locale).add(month, "jM");
  monthHeaderTitle.innerHTML = date.format("MMMM YYYY");

  dayOfDatePickerHandler(date, isToday);
}
function dayOfDatePickerHandler(date, isToday) {
  const today = date.format('YYYY/MM/D');
  const month = locale === 'fa' ? "jMonth" : "month";
  const firstMonth = date.startOf(month);
  const dayWeek = dayOfWeek(firstMonth.format("dddd"));
  const endMonth = date.endOf(month);
  const endDayOfMonth = +endMonth.format("DD");

  let dayOfCompletedWeek = 7 - (endDayOfMonth % 7) + endDayOfMonth;
  if (
    (endDayOfMonth === 31 && dayWeek >= 6) ||
    (endDayOfMonth === 30 && dayWeek === 7)
  )
    dayOfCompletedWeek += 7;

  if(endDayOfMonth === 28 && dayWeek === 1){
    dayOfCompletedWeek = 28;
  }

  let tr = document.createElement("tr");
  let output = document.createElement("tbody");

  for (let i = 1; i <= dayOfCompletedWeek; i++) {
    const td = document.createElement("td");
    if (i >= dayWeek && i < endDayOfMonth + dayWeek) {
      const day = i - dayWeek + 1;
      td.appendChild(document.createTextNode(day.toString()));
      const dateFormat = `${date.format(locale === 'fa' ? 'YYYY/MM/' : 'YYYY-MM-')}${day}`;
      td.setAttribute('date', dateFormat);

      /// Config
      const config = configuration[locale === 'fa' ? moment(dateFormat, 'jYYYY/jMM/jD').locale('en').format("YYYY-MM-D") : dateFormat];
      const configEl = document.createElement('p');
      if(config){
        configEl.appendChild(document.createTextNode(config?.price?.toLocaleString() || '--'));
        if(config?.disabled) td.classList.add('disabled');
        if(config?.color) td.style.color = config?.color;
        if(config?.bgColor) td.style.backgroundColor = config?.bgColor;
        if(config?.description) td.title = config?.description;
      } else configEl.appendChild(document.createTextNode('--'));
      td.appendChild(configEl);

      /// Today
      if(isToday && dateFormat === today){
        td.classList.add('active');
        input.value = today;
      }

      /// Active
      if(!isToday && input.value && (dateFormat === input.value || dateFormat === moment(input.value, locale === 'en' ? 'jYYYY/jMM/jD' : 'YYYY/MM/D').locale(locale).format(locale === 'en' ? "YYYY/MM/D" : "jYYYY/jMM/jD"))){
        td.classList.add('active');
      }   
    }
    tr.appendChild(td);
    if (Number.isInteger(i / 7)) {
      output.appendChild(tr);
      tr = document.createElement("tr");
    }
  }

  if(locale === 'fa') datePickerBody.style.direction = 'rtl';
  else  datePickerBody.style.direction = 'ltr';

  datePickerBody.innerHTML = output.innerHTML;
}
function dayOfWeek(weekDayWord) {
  if (locale === "fa") return weekDaysFa.indexOf(weekDayWord) + 1;
  else return weekDaysEn.indexOf(weekDayWord) + 1;
}
function removeAllDayActive(){
  datePickerBody.querySelectorAll('td.active').forEach((currentEl)=>{
    currentEl.classList.remove('active');
  });
}

/// Events
input.addEventListener("click", (e) => {
  e.stopPropagation();
  datePicker.classList.add('active');
});
document.addEventListener('click', (e)=>{
  if(!e.target.closest('#datePicker') && datePicker.classList.contains('active') && e.target !== input){
    datePicker.classList.remove('active');
  }
});
confirmDate.addEventListener('click', ()=>{
  datePicker.classList.remove('active');
})
monthHeaderNext.addEventListener("click", () => {
  mainHandler('next');
});
monthHeaderPrev.addEventListener("click", () => {
  mainHandler("prev");
});
document.addEventListener("DOMContentLoaded", () => {
  mainHandler();
});
changeLocale.addEventListener('click', ()=>{
  if(locale === 'fa') {
    locale = 'en';
    changeLocale.innerHTML = "تاریخ شمسی";
  }
  else {
    locale = 'fa';
    changeLocale.innerHTML = "تاریخ میلادی";
  }
  mainHandler('');
});
datePickerBody.addEventListener('click', (e)=>{
  let target;
  if(e.target.localName === "td" && e.target.hasAttribute('date') ) target = e.target;
  if(e.target.parentElement.localName === "td" && e.target.parentElement.hasAttribute('date')) target = e.target.parentElement;

  input.value = target.getAttribute('date');
    
  /// remove other active
  removeAllDayActive();

  /// add new active
  target.classList.add('active');
});
goToday.addEventListener('click', ()=>{
  mainHandler('', true);
});