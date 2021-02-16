const express = require('express');
const path = require ('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http)


app.use(express.json());
app.use(express.urlencoded());


const messages = [
  {name: 'Leandro', message: 'Hi'},
  {name: 'Joana', message: 'Hello'},
]

app.get('/messages',(req,res) => {
  res.send(messages)
})

app.post('/messages',(req,res) => {
  messages.push(req.body)
  io.emit('message', req.body)
  res.sendStatus(200);
})

app.use(express.static(__dirname, () => {
  console.log("lalala")
}));

io.on('connection', socket => {
  console.log("a user connected")
})

const server = http.listen(3000, () => {
  console.log("server is running on port", server.address().port)
});