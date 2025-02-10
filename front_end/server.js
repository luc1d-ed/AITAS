const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
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

// Define a route for fetching photos
app.post('/photos', upload.array(), (req, res) => {
  const db = new sqlite3.Database('../database/aitas_main.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) return console.error(err.message);
  });

  const sql = "SELECT Photo from Students";
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);

    const photos = rows.map(row => {
      const base64Encode = new Base64Encode();
      const buffer = row.Photo;
      base64Encode.write(buffer);
      base64Encode.end();
      return 'data:image/jpeg;base64,' + base64Encode.read().toString();
    });

    res.send(photos);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});