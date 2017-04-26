var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//var redis = require("redis"),
//    client = redis.createClient("redis://redistogo:8489770cceb6990c72230ddd19efe3c2@barreleye.redistogo.com:10221/");

server.listen(80);

var fileOptions = {
  root: __dirname,
};

app.get('/', function (req, res) {
  res.sendFile('index.html', fileOptions, function (err) {
    if (err) {
      next(err);
    } else {}
  });
});

app.get('/socket.io.js', function (req, res) {
  res.sendFile('socket.io.js', fileOptions, function (err) {
    if (err) {
      next(err);
    } else {}
  });  
});

var chatNamespace = io.of('/chat');
chatNamespace.on('connection', function(socket){
  console.log('someone connected');
  socket.on('message', function(messageData){
    socket.to(messageData.message.chat_id).emit('message', messageData.message);
  });
  socket.on('joinChat', function (chatData) {
    console.log(chatData);
    socket.join(chatData.chatId);
//    client.sadd(('users:' + chatData.chatId), chatData.userId);
  })
});

