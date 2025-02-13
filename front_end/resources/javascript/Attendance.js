const currentDate = new Date();
const day = currentDate.getDate().toString().padStart(2, '0');
const month = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase();
document.getElementById('current-date').innerHTML = `${day}<br>${month}`;

fetch('/photos', { method: 'POST' })
  .then(response => response.json())
  .then(data => {
    const studentsDiv = document.getElementById('students');
    data.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.studentId = item.id; // Set the data attribute with the StudentID

      const imgCard = document.createElement('div');
      imgCard.classList.add('img-card');

      const img = document.createElement('img');
      img.classList.add('student-img');
      img.src = item.photo;
      imgCard.appendChild(img);

      const nameCard = document.createElement('div');
      nameCard.classList.add('name-span');
      nameCard.innerHTML = `<span class="student-name">${item.name}</span>`; // Use the name from the server

      card.appendChild(imgCard);
      card.appendChild(nameCard);
      studentsDiv.appendChild(card);
    });

    // Fetch attendance status after creating the card elements
    fetch('/attendance-status')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        data.forEach(item => {
          const card = document.querySelector(`div.card[data-student-id="${item.id}"]`);
          if (card) {
            if (item.status === 1) {
              card.classList.add('present');
              card.classList.remove('absent');
            } else if (item.status === 0) {
              card.classList.add('absent');
              card.classList.remove('present');
            }
          }
        });
      })
      .catch(error => {
        console.error('Error:', error);
        // Display an error message to the user or take appropriate action
      });
  });

// WebSocket connection
const socket = io();

socket.on('attendanceChanged', (data) => {
  // Update the attendance status here
  const { studentId, status } = data;
  const card = document.querySelector(`div.card[data-student-id="${studentId}"]`);
  if (card) {
    if (status === 1) {
      card.classList.add('present');
      card.classList.remove('absent');
    } else if (status === 0) {
      card.classList.add('absent');
      card.classList.remove('present');
    }
  }
});