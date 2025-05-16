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
const upload = multer();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Home.html'));
});

app.get('/Attendance', (req, res) => {
    res.sendFile(path.join(__dirname, 'Attendance.html'));
});

app.get('/Graph', (req, res) => {
    res.sendFile(path.join(__dirname, 'Graph.html'));
});

app.post('/photos', upload.array(), (req, res) => {
    const db = new sqlite3.Database('../database/aitas_main.db', sqlite3.OPEN_READONLY);

    const sql = "SELECT StudentID, Name, Photo FROM Students";
    db.all(sql, [], (err, rows) => {
        if (err) return console.error(err.message);

        const data = rows.map(row => {
            const base64 = Buffer.from(row.Photo).toString('base64');
            return {
                id: row.StudentID,
                name: row.Name,
                photo: `data:image/jpeg;base64,${base64}`
            };
        });

        res.json(data);
        db.close();
    });
});

app.get('/attendance-status', (req, res) => {
    const date = req.query.date;
    const db = new sqlite3.Database('../database/aitas_main.db', sqlite3.OPEN_READONLY);

    const sql = "SELECT StudentID, Status FROM Attendance WHERE Date = ?";
    db.all(sql, [date], (err, rows) => {
        if (err) return console.error(err.message);

        const data = rows.map(row => ({
            id: row.StudentID,
            status: row.Status
        }));

        res.json(data);
        db.close();
    });
});

app.get('/dates', (req, res) => {
    const db = new sqlite3.Database('../database/aitas_main.db', sqlite3.OPEN_READONLY);

    const sql = "SELECT DISTINCT Date FROM Attendance";
    db.all(sql, [], (err, rows) => {
        if (err) return console.error(err.message);

        const data = rows.map(row => row.Date);
        res.json(data);
        db.close();
    });
});

function emitAttendanceStatus() {
    const db = new sqlite3.Database('../database/aitas_main.db', sqlite3.OPEN_READONLY);

    const sql = "SELECT StudentID, Status FROM Attendance";
    db.all(sql, [], (err, rows) => {
        if (err) return console.error(err.message);

        rows.forEach((row) => {
            io.emit('attendanceChanged', {
                studentId: row.StudentID,
                status: row.Status
            });
        });

        db.close();
    });
}

emitAttendanceStatus();
setInterval(emitAttendanceStatus, 5000);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});