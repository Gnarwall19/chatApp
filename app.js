const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = 3000;

server.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/cs', (req, res) => {
    res.sendFile(__dirname + '/public/cs.html');
});

app.get('/python', (req, res) => {
    res.sendFile(__dirname + '/public/python.html');
});

// Tech NameSpace
const tech = io.of('/tech');

tech.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('message', `New user joined ${data.room} room!`);
    })

    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        tech.in(data.room).emit('message', data.msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        tech.emit('message', 'user disconnected');
    })
});