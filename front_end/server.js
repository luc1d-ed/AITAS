const path = require('path');
const multer = require('multer');
const express = require('express');
const sqlite3 = require('sqlite3');
const { Base64Encode } = require('base64-stream');

const app = express();
const port = 3000; // You can change the port number if needed
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});