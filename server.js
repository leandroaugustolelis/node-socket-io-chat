require('dotenv/config');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http)
const mongoose = require('mongoose')

app.use(express.json());
app.use(express.urlencoded());

mongoose.Promise = Promise

const dbUrl = process.env.MONGO_DB_CONNECTION;

const Message = mongoose.model('Message', {
  name: String,
  message: String
})

app.get('/messages',(req,res) => {
  Message.find({}, (err,messages) => {
    res.send(messages)
  })
  
})


app.post('/messages', async (req,res) => {

  try {
    const message = new Message(req.body)
    const savedMessage = await message.save()
    console.log('saved')
    const censored = await Message.findOne({message: 'badword'})

    if(censored) {
      await Message.remove({ _id: censored.id })
    } else {
      io.emit('message', req.body)
    }
    
    res.sendStatus(200)
  } catch(error) {
    res.sendStatus(500)
    return console.error(error)
  } finally {
    console.log('message post called')
  }
})

app.use(express.static(__dirname, () => {
  console.log("lalala")
}));

io.on('connection', socket => {
  console.log("a user connected")
})

mongoose.connect(dbUrl, { useUnifiedTopology: true }, (err) => {
  console.log("mongodb connection", err)
})

const server = http.listen(3000, () => {
  console.log("server is running on port", server.address().port)
})