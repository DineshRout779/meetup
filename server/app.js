const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const rooms = {};

io.on('connection', (socket) => {
  socket.on('join:room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user:connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user:disconnected', userId);
    });
  });

  socket.on('create:room', () => {
    const roomId = uuidv4();
    rooms[roomId] = { users: [] };
    socket.emit('room:created', roomId);
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
