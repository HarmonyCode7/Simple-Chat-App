const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 3000;

server.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

app.use('/', express.static('public/'));


io.on('connection', socket => {
    socket.on('message', message => {
        console.log(message);
        socket.broadcast.emit('message', message);
    })

})