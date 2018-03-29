const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log('User Connected');
    socket.on('message', (msg) => {
        console.log(`message: ${msg}`);
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        io.emit('message', 'user disconnected');
    })
});