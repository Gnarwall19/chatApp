const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var path = require('path');
const bodyParser = require('body-parser');
const PORT = 3000;

server.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/views'));
app.use("/public", express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/views/javascript.html');
});

app.get('/cs', (req, res) => {
    res.sendFile(__dirname + '/views/cs.html');
});

app.get('/python', (req, res) => {
    res.sendFile(__dirname + '/views/python.html');
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