var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var MongoClient = require('mongodb').MongoClient;
var redis = require("redis");

/*Stablish connection to DB*/
var database, redisCllient;
function initRedisConnection(){
  redisCllient = redis.createClient("redis://redistogo:8489770cceb6990c72230ddd19efe3c2@barreleye.redistogo.com:10221/");
  redisCllient.on("ready", function () {
    server.listen(80);
    console.log('listening on port 80');
  });
  redisCllient.on("error", function (error) {
    console.log("Error " + error);
  });
}

function initMongoConnection(){
  MongoClient.connect('mongodb://tedma4:tm671216@ds133428.mlab.com:33428/veritas_db', (error, db) => {
    if (error) return console.log(error);
    database = db;
    initRedisConnection();
  });
}

initMongoConnection();

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
    var message = messageData.message;
    message.time_stamp = new Date(message.time_stamp);
    database.collection('messages').save(message, (error, result) => {
      if (error) return console.log(error);
    });    
  });
  socket.on('joinChat', function (chatData) {
    socket.join(chatData.chatId);
    client.sadd(('users:' + chatData.chatId), chatData.userId);
  })
});

