const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 3000;

server.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

app.use('/', express.static('public/'));
// app.get('/', (req, res) => {
//     res.sendFile({root: __dirname,},'public/index.html');
// })

io.on('connection', socket => {
    console.log(`user connected`);
    socket.emit('user-connected', 'user connected');
    socket.emit('message', {Harmony: 'How are you?'});


    socket.on('message', message => {
        console.log(`message: ${message}`)
        socket.emit('message', message)
    })
})