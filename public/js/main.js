const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    // this will ignore prefix characters in URL
    ignoreQueryPrefix: true
});

// We have access to io() here from the server.js file because they're both in chat.html
const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room })

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Every time a message is received DOM will scroll to it
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Create event listener for submission of form for new message
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // gets value of 
    const msg = event.target.elements.msg.value;

    // Emit message to server here
    socket.emit('chatMessage', msg);
    // Clear inputs
    event.target.elements.msg.value = '';
    event.target.elements.msg.focus();
})

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    // each div has class of message
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM 
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM 
function outputUsers(users) {
    // need to use join method here because it is an array
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}