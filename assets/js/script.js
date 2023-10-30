// Elements
const datePicker = document.querySelector("#datePicker"),
  input = document.querySelector("#input"),
  monthHeaderTitle = document.querySelector("#monthHeaderTitle"),
  monthHeaderPrev = document.querySelector("#monthHeaderPrev"),
  monthHeaderNext = document.querySelector("#monthHeaderNext"),
  datePickerBody = document.querySelector("#datePickerBody");

/// Variables
let locale = "fa",
  month = -1;

const weekDaysEn = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
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
function handler(command = "next") {
  command === "next" ? ++month : --month;
  const today = new Date();
  const date = moment(today).locale(locale).add(month, "jM");
  monthHeaderTitle.innerHTML = date.format("MMMM YYYY");

  dayOfDatePickerHandler(date);
}
function dayOfDatePickerHandler(date) {
  const firstMonth = date.startOf("jMonth");
  const dayWeek = dayOfWeek(firstMonth.format("dddd"));
  const endMonth = date.endOf("jMonth");
  const endDayOfMonth = +endMonth.format("DD");

  let dayOfCompletedWeek = 7 - (endDayOfMonth % 7) + endDayOfMonth;
  if (
    (endDayOfMonth === 31 && dayWeek >= 6) ||
    (endDayOfMonth === 30 && dayWeek === 7)
  )
    dayOfCompletedWeek += 7;

  let tr = document.createElement("tr");
  let output = document.createElement("tbody");
  for (let i = 1; i <= dayOfCompletedWeek; i++) {
    const td = document.createElement("td");
    if (i >= dayWeek && i < endDayOfMonth + dayWeek) {
      td.appendChild(document.createTextNode((i - dayWeek + 1).toString()));
    }
    tr.appendChild(td);
    if (Number.isInteger(i / 7)) {
      output.appendChild(tr);
      tr = document.createElement("tr");
    }
  }
  datePickerBody.innerHTML = output.innerHTML;
}
function dayOfWeek(weekDayWord) {
  if (locale === "fa") return weekDaysFa.indexOf(weekDayWord) + 1;
  else return weekDaysEn.indexOf(weekDayWord) + 1;
}

input.addEventListener("focus", () => {});
monthHeaderNext.addEventListener("click", () => {
  handler();
});
monthHeaderPrev.addEventListener("click", () => {
  handler("prev");
});
document.addEventListener("DOMContentLoaded", () => {
  handler();
});
