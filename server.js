var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var MongoClient = require('mongodb').MongoClient;
var redis = require("redis");

var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];

/*Stablish connection to DB*/
var database, redisCllient;
function initRedisConnection(){
  var redisConfiguration = config.redisDatabase;
  var connectionString = 'redis://'+ redisConfiguration.username +':'
  + redisConfiguration.password +'@'+  redisConfiguration.host +':'
  + redisConfiguration.port +'/'+ redisConfiguration.db;

  redisCllient = redis.createClient(connectionString);
  redisCllient.on("ready", function () {
    server.listen(config.server.port);
    console.log('listening on port ' + config.server.port);
  });
  redisCllient.on("error", function (error) {
    console.log("Error " + error);
  });
}

function initMongoConnection(){
  var mongoConfiguration = config.mongoDatabase;
  var connectionString = 'mongodb://'+ mongoConfiguration.username +':'
  + mongoConfiguration.password +'@'+  mongoConfiguration.host +':'
  + mongoConfiguration.port +'/'+ mongoConfiguration.db;

  MongoClient.connect(connectionString, (error, db) => {
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
    redisCllient.sadd(('users:' + chatData.chatId), chatData.userId);
  })
});

