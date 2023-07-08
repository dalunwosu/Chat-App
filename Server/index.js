require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const harperSaveMessage = require('./db-functions/db-save-messages');
const harperGetMessages = require('./db-functions/db-get-messages');
const leaveRoom = require('./Leave-Room/leave-room');

app.use(cors()); 

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const CHAT_BOT = 'ChatBot';
let chatRoom = ''; 
let allUsers = [];


io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);


  socket.on('join_room', (data) => {
    const { username, room } = data; 
    socket.join(room); 

    let __createdtime__ = Date.now(); 
    
    socket.to(room).emit('receive_message', {
      message: `${username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()} has joined the chat room`,
      username: CHAT_BOT,
      __createdtime__,
    });
   
    socket.emit('receive_message', {
      message: `Welcome ${username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()}`,
      username: CHAT_BOT,
      __createdtime__,
    });
   
    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    let chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers);

    harperGetMessages(room)
      .then((last100Messages) => {

        socket.emit('last_100_messages', last100Messages);
      })
      .catch((err) => console.log(err));
  });

  socket.on('send_message', (data) => {
    const { message, username, room, __createdtime__ } = data;
    io.in(room).emit('receive_message', data); 
    harperSaveMessage(message, username, room, __createdtime__)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  });

  socket.on('leave_room', (data) => {
    const { username, room } = data;
    socket.leave(room);
    const __createdtime__ = Date.now();

    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit('chatroom_users', allUsers);
    socket.to(room).emit('receive_message', {
      username: CHAT_BOT,
      message: `${username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()} has left the chat`,
      __createdtime__,
    });
    console.log(`${username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()} has left the chat`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from the chat');
    const user = allUsers.find((user) => user.id == socket.id);
    if (user?.username) {
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(chatRoom).emit('chatroom_users', allUsers);
      socket.to(chatRoom).emit('receive_message', {
        message: `${user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase()} has disconnected from the chat.`,
      });
    }
  });
});

server.listen(4000, () => 'Server is running on port 4000');