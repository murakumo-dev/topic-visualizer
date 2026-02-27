const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.static(__dirname));

// Track connected users count
let userCount = 0;

io.on('connection', (socket) => {
  userCount++;
  io.emit('user-count', userCount);
  console.log(`User connected: ${socket.id} (total: ${userCount})`);

  // Relay bubble from one client to all others
  socket.on('bubble', (data) => {
    // data: { text, palIdx }
    socket.broadcast.emit('bubble', data);
  });

  socket.on('disconnect', () => {
    userCount--;
    io.emit('user-count', userCount);
    console.log(`User disconnected: ${socket.id} (total: ${userCount})`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Topic Visualizer running at http://localhost:${PORT}`);
});
