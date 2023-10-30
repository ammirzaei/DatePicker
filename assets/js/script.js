// Elements
const datePicker = document.querySelector("#datePicker"),
  input = document.querySelector("#input"),
  monthHeaderTitle = document.querySelector("#monthHeaderTitle"),
  monthHeaderPrev = document.querySelector("#monthHeaderPrev"),
  monthHeaderNext = document.querySelector("#monthHeaderNext"),
  datePickerBody = document.querySelector("#datePickerBody"),
  datePickerHead = document.querySelector('#datePickerHead'),
  changeLocale = document.querySelector('#changeLocale'),
  goToday = document.querySelector('#goToday');

/// Variables
let locale = "fa",
  month = -1;

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
function mainHandler(command = "next", isToday = false) {
  dayWeekHandler();

  if(isToday) month = 0;
  else command === "next" ? ++month : --month;

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
      const dateFormat = `${date.format('YYYY/MM/')}${day}`;
      td.setAttribute('date', dateFormat);

      if(dateFormat === input.value){
        td.classList.add('active');
      }

      if(isToday && dateFormat === today){
        removeAllDayActive();
        td.classList.add('active');
        input.value = today;
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

input.addEventListener("focus", () => {});
monthHeaderNext.addEventListener("click", () => {
  mainHandler();
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

  mainHandler();
});
datePickerBody.addEventListener('click', (e)=>{
  if(e.target.localName === "td" && e.target.hasAttribute('date')){
    input.value = e.target.getAttribute('date');
    
    /// remove other active
    removeAllDayActive();

    /// add new active
    e.target.classList.add('active');
  }
});
goToday.addEventListener('click', ()=>{
  mainHandler('', true);
});