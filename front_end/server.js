const http = require('http');
const path = require('path');
const multer = require('multer');
const express = require('express');
const sqlite3 = require('sqlite3');
const socketIo = require('socket.io');
const { Base64Encode } = require('base64-stream');

const port = 3000;
const app = express();
const server = http.createServer(app);

const io = socketIo(server);

// Multer configuration
const upload = multer();

// Serve static files from the current directory ("front_end")
app.use(express.static(__dirname));

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Home.html'));
});

app.get('/Attendance', (req, res) => {
  res.sendFile(path.join(__dirname, 'Attendance.html'));
});

app.get('/Graph', (req, res) => {
  res.sendFile(path.join(__dirname, 'Graph.html'));
});

// Define a route for fetching photos, names, and student IDs
app.post('/photos', upload.array(), (req, res) => {
  const db = new sqlite3.Database('../database/aitas_main.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) return console.error(err.message);
  });

  const sql = "SELECT StudentID, Name, Photo FROM Students";
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);

    const data = rows.map(row => {
      const base64Encode = new Base64Encode();
      const buffer = row.Photo;
      base64Encode.write(buffer);
      base64Encode.end();
      const photo = 'data:image/jpeg;base64,' + base64Encode.read().toString();
      return { id: row.StudentID, name: row.Name, photo: photo };
    });

    res.json(data);
  });
});

// Define a route for fetching attendance status along with StudentID
app.get('/attendance-status', (req, res) => {
  const db = new sqlite3.Database('../database/aitas_main.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) return console.error(err.message);
  });

  const sql = "SELECT StudentID, Status FROM Attendance";
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);

    const data = rows.map(row => ({
      id: row.StudentID,
      status: row.Status
    }));
    res.json(data);
  });
});

// Function to fetch and emit attendance status
function emitAttendanceStatus() {
  const db = new sqlite3.Database('../database/aitas_main.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) return console.error(err.message);
  });

  const sql = "SELECT StudentID, Status FROM Attendance";
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);

    rows.forEach((row) => {
      const studentId = row.StudentID;
      const status = row.Status;
      io.emit('attendanceChanged', { studentId, status });
    });
  });
}

// Emit attendance status initially
emitAttendanceStatus();

// Emit attendance status every 5 seconds (adjust the interval as needed)
setInterval(emitAttendanceStatus, 5000);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});