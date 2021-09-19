const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 4000;


http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});


const io = require('socket.io')(http);


// const io = require('socket.io')(4000, {
//     cors: {
//         origin: 'https://talkative-chat.netlify.app/',
//         methods: ["GET", "POST"]
//     }
// });
  
const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', username => {
        // console.log("New User", username);
        users[socket.id] = username;
       
        socket.broadcast.emit('user-joined', username);

    });

    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message, username: users[socket.id] });
    });
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})



