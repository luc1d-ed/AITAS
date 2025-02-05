const express = require('express');
const path = require('path');

const app = express();
const port = 3000; // You can change the port number if needed

// Serve static files from the current directory ("front_end")
app.use(express.static(__dirname));

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front_end', 'Home.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});