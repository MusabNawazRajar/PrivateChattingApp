const express = require('express');
const http = require('http');
const createWebSocketServer = require('./websocketServer'); // Adjust the path as needed
const jsonServer = require('json-server');

const app = express();
const server = http.createServer(app);

// Set up JSON server
app.use('/api', jsonServer.defaults(), jsonServer.router('db.json')); // Adjust the JSON server setup

// Set up WebSocket server
const wss = createWebSocketServer(server);

// ... other routes and server setup ...

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
