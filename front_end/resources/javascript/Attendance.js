const currentDate = new Date();
const day = currentDate.getDate().toString().padStart(2, '0');
const currentMonth = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase();
document.getElementById('current-date').innerHTML = `${day}<br>${currentMonth}`;

fetch('/photos', { method: 'POST' })
  .then(response => response.json())
  .then(data => {
    const studentsDiv = document.getElementById('students');
    data.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.studentId = item.id;

      const imgCard = document.createElement('div');
      imgCard.classList.add('img-card');

      const img = document.createElement('img');
      img.classList.add('student-img');
      img.src = item.photo;
      imgCard.appendChild(img);

      const nameCard = document.createElement('div');
      nameCard.classList.add('name-span');
      nameCard.innerHTML = `<span class="student-name">${item.name}</span>`;
      
      card.appendChild(imgCard);
      card.appendChild(nameCard);
      studentsDiv.appendChild(card);
    });
  });

const socket = io();
socket.on('attendanceChanged', (data) => {
  // Not used in current logic
});

const datepicker = document.querySelector(".datepicker");
const dateInput = document.querySelector(".date-input");
const yearInput = datepicker.querySelector(".year-input");
const monthInput = datepicker.querySelector(".month-input");
const cancelBtn = datepicker.querySelector(".cancel");
const applyBtn = datepicker.querySelector(".apply");
const nextBtn = datepicker.querySelector(".next");
const prevBtn = datepicker.querySelector(".prev");
const dates = datepicker.querySelector(".dates");

let selectedDate = new Date();
let year = selectedDate.getFullYear();
let month = selectedDate.getMonth();
let availableDates = new Set();

function formatDateLocal(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

fetch('/dates')
  .then(response => response.json())
  .then(data => {
    data.forEach(dateString => {
      const [day, month, year] = dateString.split('-');
      const localDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      availableDates.add(localDate);
    });

    const sortedDates = Array.from(availableDates).sort((a, b) => new Date(a) - new Date(b));
    if (sortedDates.length > 0) {
      const firstDate = new Date(sortedDates[0]);
      selectedDate = new Date(firstDate);
      year = selectedDate.getFullYear();
      month = selectedDate.getMonth();
    }

    const years = Array.from(availableDates).map(date => new Date(date).getFullYear());
    yearInput.min = Math.min(...years);
    yearInput.max = Math.max(...years);

    const originalCreateButton = createButton;
    createButton = (text, isDisabled = false) => {
      const button = originalCreateButton(text, isDisabled);
      if (!isDisabled) {
        const dateObj = new Date(year, month, text);
        const localStr = formatDateLocal(dateObj);
        if (!availableDates.has(localStr)) {
          button.disabled = true;
          button.classList.add('unavailable');
        }
      }
      return button;
    };

    handleDateClick = (e) => {
      const button = e.target;
      if (button.disabled || button.classList.contains('unavailable')) return;
      const selected = dates.querySelector(".selected");
      selected && selected.classList.remove("selected");
      button.classList.add("selected");
      selectedDate = new Date(year, month, parseInt(button.textContent));
    };

    displayDates();
  })
  .catch(error => {
    console.error('Error:', error);
    displayDates();
  });

function displayDates() {
  updateYearMonth();
  dates.innerHTML = "";

  const lastOfPrevMonth = new Date(year, month, 0);
  for (let i = 0; i <= lastOfPrevMonth.getDay(); i++) {
    if (lastOfPrevMonth.getDay() === 6) break;
    const text = lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + i;
    const button = createButton(text, true);
    dates.appendChild(button);
  }

  const lastOfMonth = new Date(year, month + 1, 0);
  for (let i = 1; i <= lastOfMonth.getDate(); i++) {
    const dateObj = new Date(year, month, i);
    const dateStr = formatDateLocal(dateObj);
    const isDisabled = !availableDates.has(dateStr);
    const button = createButton(i, isDisabled);
    if (!isDisabled) button.addEventListener("click", handleDateClick);
    dates.appendChild(button);
  }

  const firstOfNextMonth = new Date(year, month + 1, 1);
  for (let i = firstOfNextMonth.getDay(); i < 7; i++) {
    if (firstOfNextMonth.getDay() === 0) break;
    const text = firstOfNextMonth.getDate() - firstOfNextMonth.getDay() + i;
    const button = createButton(text, true);
    dates.appendChild(button);
  }

  const buttons = dates.querySelectorAll('button:not([disabled])');
  buttons.forEach(button => {
    const btnDate = new Date(year, month, parseInt(button.textContent));
    if (formatDateLocal(btnDate) === formatDateLocal(selectedDate)) {
      button.classList.add('selected');
    }
  });
}

function createButton(text, isDisabled = false) {
  const button = document.createElement("button");
  button.textContent = text;
  button.disabled = isDisabled;

  if (!isDisabled) {
    const buttonDate = new Date(year, month, text).toDateString();
    const today = buttonDate === new Date().toDateString();
    button.classList.toggle("today", today);
  }

  return button;
}

function updateYearMonth() {
  monthInput.selectedIndex = month;
  yearInput.value = year;
}

applyBtn.addEventListener("click", () => {
  try {
    const formattedDate = selectedDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, '-');

    dateInput.value = formattedDate;

    document.querySelectorAll('.card').forEach(card => {
      card.classList.remove('present', 'absent');
    });

    fetch(`/attendance-status?date=${formattedDate}`)
      .then(res => res.json())
      .then(data => {
        data.forEach(({ id, status }) => {
          const card = document.querySelector(`div.card[data-student-id="${id}"]`);
          if (card) {
            card.classList.toggle('present', status === 1);
            card.classList.toggle('absent', status === 0);
          }
        });
      });

    datepicker.hidden = true;
  } catch (err) {
    console.error('Error applying date:', err);
  }
});

cancelBtn.addEventListener("click", () => datepicker.hidden = true);
dateInput.addEventListener("click", () => datepicker.hidden = false);
document.addEventListener("click", (e) => {
  const datepickerContainer = datepicker.parentNode;
  if (!datepickerContainer.contains(e.target)) datepicker.hidden = true;
});
nextBtn.addEventListener("click", () => {
  if (month === 11) year++;
  month = (month + 1) % 12;
  displayDates();
});
prevBtn.addEventListener("click", () => {
  if (month === 0) year--;
  month = (month - 1 + 12) % 12;
  displayDates();
});
monthInput.addEventListener("change", () => {
  month = monthInput.selectedIndex;
  displayDates();
});
yearInput.addEventListener("change", () => {
  const newYear = parseInt(yearInput.value, 10);
  if (newYear >= yearInput.min && newYear <= yearInput.max) {
    year = newYear;
    displayDates();
  }
});