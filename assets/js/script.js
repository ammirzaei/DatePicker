// Elements
const datePicker = document.querySelector("#datePicker"),
  input = document.querySelector("#input"),
  monthHeaderTitle = document.querySelector("#monthHeaderTitle"),
  monthHeaderPrev = document.querySelector("#monthHeaderPrev"),
  monthHeaderNext = document.querySelector("#monthHeaderNext"),
  datePickerBody = document.querySelector("#datePickerBody"),
  datePickerHead = document.querySelector("#datePickerHead"),
  changeLocale = document.querySelector("#changeLocale"),
  goToday = document.querySelector("#goToday"),
  confirmDate = document.querySelector("#confirmDate"),
  datePickerBack = document.querySelector(".date-picker-back"),
  selectedDate = document.querySelector("#selectedDate"),
  closeDatePicker = document.querySelector("#closeDatePicker"),
  goTodayContainer = document.querySelector("#goTodayContainer"),
  changeLocaleContainer = document.querySelector("#changeLocaleContainer"),
  headerCommand = document.querySelector("#headerCommand");

/// Variables
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
const data = {
  "2023-10-30": {
    price: 50000,
    title: "توضیحات",
    disabled: false,
    color: null,
    bgColor: null,
  },
  "2023-10-02": {
    price: 2600000,
    title: "23توضیحات",
    disabled: true,
    color: null,
    bgColor: null,
  },
  "2023-10-05": {
    price: 10000,
    title: "23توضیحات",
    disabled: false,
    color: null,
    bgColor: "pink",
  },
  "2023-10-17": {
    price: 1200000,
    title: "توضیحات 33333",
    disabled: false,
    color: "red",
    bgColor: null,
  },
};
const configuration = {
  secondary: true, // پارامتر دوم  -> true - false
  changeLocale: true, // تغییر تاریخ بین میلادی و شمسی -> true - false
  goToday: true, // رفتن به تاریخ امروز -> true - false
  locale: "fa", // تاریخ دیفالت -> 'fa' - 'en'
  // outLocale: "fa", // تاریخ خروجی در اینپوت -> 'fa' - 'en'
};
let locale = configuration?.locale || "fa",
  month = 0;

// Functions
function mainHandler(command = "", isToday = false) {
  dayWeekHandler();

  monthHandler(command, isToday);

  const date = getDateInDatePicker(isToday).add(month, "jM");
  monthHeaderTitle.innerHTML = date.format("MMMM YYYY");

  dayOfDatePickerHandler(date, isToday);
}
function monthHandler(command, isToday) {
  if (isToday) month = 0;
  else
    switch (command) {
      case "next": {
        ++month;
        break;
      }
      case "prev": {
        --month;
        break;
      }
      case "":
        month = 0;
        break;
    }
}
function getDateInDatePicker(isToday) {
  let date = moment(new Date()).locale(locale);

  // input value
  const inputValueLocale = input.value
    ? getLocaleDate(moment(input.value).format("YYYY"))
    : null;
  const inputValueDate = input.value
    ? moment(
        input.value,
        inputValueLocale === "fa" ? "jYYYY/jMM/jDD" : "YYYY-MM-DD"
      ).locale("en")
    : null;
  if (inputValueDate && !isToday && inputValueDate.isValid()) {
    date = inputValueDate.locale(locale);
  }
  return date;
}
function getLocaleDate(year) {
  if (year) {
    if (Math.abs(year - 1300) >= 600) return "en";
    return "fa";
  }
  return null;
}
function dayWeekHandler() {
  let output = document.createElement("tr");
  if (locale === "fa") {
    weekDaysFa.forEach((day) => {
      const th = document.createElement("th");
      th.appendChild(document.createTextNode(day.slice(0, 1)));
      output.appendChild(th);
    });
  } else {
    weekDaysEn.forEach((day) => {
      const th = document.createElement("th");
      th.appendChild(document.createTextNode(day.slice(0, 2)));
      output.appendChild(th);
    });
  }

  datePickerHead.innerHTML = output.innerHTML;
}
function getFormatAsLocale(argLocale = null) {
  return (argLocale || locale) === "fa" ? "YYYY/MM/DD" : "YYYY-MM-DD";
}
function dayOfDatePickerHandler(date, isToday) {
  const today = moment(new Date()).locale(locale).format(getFormatAsLocale());
  const month = locale === "fa" ? "jMonth" : "month";
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

  if (endDayOfMonth === 28 && dayWeek === 1) {
    dayOfCompletedWeek = 28;
  }

  let tr = document.createElement("tr");
  let output = document.createElement("tbody");

  for (let i = 1; i <= dayOfCompletedWeek; i++) {
    const td = document.createElement("td");
    if (i >= dayWeek && i < endDayOfMonth + dayWeek) {
      const day = i - dayWeek + 1;
      td.appendChild(document.createTextNode(day.toString()));
      const dateFormat = `${date.format(
        locale === "fa" ? "YYYY/MM/" : "YYYY-MM-"
      )}${("0" + day).slice(-2)}`;
      td.setAttribute("date", dateFormat);

      /// Config
      const config =
        data[
          locale === "fa"
            ? moment(dateFormat, "jYYYY/jMM/jDD")
                .locale("en")
                .format("YYYY-MM-DD")
            : dateFormat
        ];
      if (configuration.secondary) {
        const configEl = document.createElement("p");
        configEl.appendChild(
          document.createTextNode(
            config?.price ? config.price?.toLocaleString() : "--"
          )
        );
        td.appendChild(configEl);
      }
      if (config) {
        if (config?.disabled) td.classList.add("disabled");
        if (config?.color) td.style.color = config?.color;
        if (config?.bgColor) td.style.backgroundColor = config?.bgColor;
        if (config?.title) td.setAttribute("data-title", config.title);
      }

      /// Today
      if (isToday && dateFormat === today) {
        td.classList.add("active");
        selectedDate.textContent = today;
      }
      if (!isToday && dateFormat === today) {
        td.classList.add("today");
      }

      /// Active
      const dateActive = getDateActive();
      if (
        !isToday &&
        dateActive &&
        dateFormat === dateActive.format(getFormatAsLocale())
      ) {
        td.classList.add("active");
        selectedDate.innerHTML = dateFormat;
      }
    }
    tr.appendChild(td);
    if (Number.isInteger(i / 7)) {
      output.appendChild(tr);
      tr = document.createElement("tr");
    }
  }

  if (locale === "fa") {
    datePickerBody.style.direction = "rtl";
  } else {
    datePickerBody.style.direction = "ltr";
    datePicker.style.fontFeatureSettings = "lnum";
  }

  // Confirm button Status
  if (selectedDate.textContent) confirmDate.classList.remove("disabled");
  else confirmDate.classList.add("disabled");

  datePickerBody.innerHTML = output.innerHTML;
}
function getDateActive() {
  const dateActive =
    selectedDate.textContent === input.value
      ? input.value
      : selectedDate.textContent;
  if (dateActive) {
    const dateLocale = getLocaleDate(moment(dateActive).format("YYYY"));
    const date = moment(
      dateActive,
      dateLocale === "fa" ? "jYYYY/jMM/jDD" : "YYYY-MM-DD"
    ).locale("en");
    if (date.isValid()) {
      return date.locale(locale);
    }
  }
  return false;
}
function dayOfWeek(weekDayWord) {
  if (locale === "fa") return weekDaysFa.indexOf(weekDayWord) + 1;
  else return weekDaysEn.indexOf(weekDayWord) + 1;
}
function removeAllDayActive() {
  datePickerBody.querySelectorAll("td.active").forEach((currentEl) => {
    currentEl.classList.remove("active");
  });
}
function setInputValue() {
  if (configuration?.outLocale && configuration?.outLocale !== locale) {
    input.value = moment(
      selectedDate.textContent,
      locale === "fa" ? "jYYYY/jMM/jDD" : "YYYY-MM-DD"
    )
      .locale(configuration.outLocale)
      .format(getFormatAsLocale(configuration.outLocale));
  } else input.value = selectedDate.textContent;
}
function closeDatePickerHandler() {
  datePicker.classList.remove("active");
  datePickerBack.style.display = "none";
}

/// Events
input.addEventListener("click", (e) => {
  e.stopPropagation();
  datePicker.classList.add("active");
  datePickerBack.style.display = "block";
  selectedDate.innerHTML = input.value;

  mainHandler();
});
datePickerBack.addEventListener("click", () => {
  closeDatePickerHandler();
});
document.addEventListener("click", (e) => {
  if (
    !e.target.closest("#datePicker") &&
    datePicker.classList.contains("active") &&
    e.target !== input
  ) {
    closeDatePickerHandler();
  }
});
confirmDate.addEventListener("click", () => {
  setInputValue();
  closeDatePickerHandler();
});
monthHeaderNext.addEventListener("click", () => {
  mainHandler("next");
});
monthHeaderPrev.addEventListener("click", () => {
  mainHandler("prev");
});
changeLocale.addEventListener("click", () => {
  if (locale === "fa") {
    locale = "en";
    changeLocale.innerHTML = "تاریخ شمسی";
  } else {
    locale = "fa";
    changeLocale.innerHTML = "تاریخ میلادی";
  }
  mainHandler("locale");
});
datePickerBody.addEventListener("click", (e) => {
  let target;
  if (e.target.localName === "td" && e.target.hasAttribute("date"))
    target = e.target;
  if (
    e.target.parentElement.localName === "td" &&
    e.target.parentElement.hasAttribute("date")
  )
    target = e.target.parentElement;

  if (target) {
    const date = target?.getAttribute("date");
    if (selectedDate.textContent !== date) {
      selectedDate.innerHTML = date;

      /// remove other active
      removeAllDayActive();

      /// add new active
      target.classList.add("active");

      confirmDate.classList.remove("disabled");
    } else {
      selectedDate.innerHTML = "";

      removeAllDayActive();

      confirmDate.classList.add("disabled");
    }
  }
});
goToday.addEventListener("click", () => {
  mainHandler("", true);
});
closeDatePicker.addEventListener("click", () => {
  closeDatePickerHandler();
});
document.addEventListener("DOMContentLoaded", () => {
  if (configuration.goToday === false && configuration.changeLocale === false)
    headerCommand.style.display = "none";
  else if (configuration.goToday === false)
    goTodayContainer.style.display = "none";
  else if (configuration.changeLocale === false)
    changeLocaleContainer.style.display = "none";
  if (configuration.secondary === false) datePicker.style.width = "450px";
});
