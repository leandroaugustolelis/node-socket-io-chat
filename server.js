const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http)
const mongoose = require('mongoose')

app.use(express.json());
app.use(express.urlencoded());

const dbUrl = 'mongodb+srv://user:user@learning-node.9wpee.mongodb.net/test'

const Message = mongoose.model('Message', {
  name: String,
  message: String
})

app.get('/messages',(req,res) => {
  Message.find({}, (err,messages) => {
    res.send(messages)
  })
  
})

app.post('/messages',(req,res) => {
  const message = new Message(req.body)
  message.save((err) => {
    if(err) {
      res.status(500)
    }
    
  })
  io.emit('message', req.body)
  res.status(200);
})

app.use(express.static(__dirname, () => {
  console.log("lalala")
}));

io.on('connection', socket => {
  console.log("a user connected")
})

mongoose.connect(dbUrl, (err) => {
  console.log("mongodb connection", err)
})

const server = http.listen(3000, () => {
  console.log("server is running on port", server.address().port)
});