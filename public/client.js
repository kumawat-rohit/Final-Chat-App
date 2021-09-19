const socket = io('http://localhost:4000');
// const socket = io();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

var audio1 = new Audio('/notification.mp3');
var audio2 = new Audio('/leave.mp3');


const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
    
        audio1.play();
    }
}

const username = prompt("Enter Your Name to Join Chat");

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

socket.emit('new-user-joined', username);

socket.on('user-joined', username => {
   
    if (username) {
        
        append(`${username} joined the chat`, 'left');
    }
})
socket.on('recieve', data => {
    append(`${data.username}: ${data.message}`, 'left');
})
socket.on('left', username => {
    if (username) {
        
        append(`${username} has left the chat`, 'right');
        audio2.play();
    }
})