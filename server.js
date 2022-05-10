const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Admin Bot';


// Run socket.io when client connects
// .on will listen to some kind of event
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        // socket.id comes from socket in main func 
        const user = userJoin(socket.id, username, room);

        socket.join(user.room)

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to the chatroom!'));

        // Broadcast when a user connects
        // socket.broadcast.emit will notify everyone except user connecting
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chatroom`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });

    // Listen for chatMessage from form submission on client-side
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)
        // using io.emit will send to everyone
        io.to(user.room).emit('message', formatMessage(user.username, msg))
        console.log(msg)
    })


    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chatroom`));


            // Updates the users within the room
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }

    })
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

