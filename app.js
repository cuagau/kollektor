var app = require('http').createServer(handler),
  sockets = require('socket.io'),
  static = require('node-static'),
  Socket = require('socket.io/lib/socket'),
  sql = require('./tools/sqlite').sqlite,
  db = require('./common/data').data;

console.log(db);
// This will make all the files in the current folder
// accessible from the web
var fileServer = new static.Server('./', {'cache': 0});

// This is the port for our web server.
// you will need to go to http://localhost:8080 to see it
var port = process.env.PORT || 8080;
console.log('Listening on ' + port);
app.listen(port);
var io = sockets.listen(app);

// If the URL of the socket server is opened in a browser
function handler(request, response) {
  //request.addListener('end', function () {
  fileServer.serve(request, response);
  //});
}

//get data from database
sql.exec("SELECT mediaid, title, hash, rating, path FROM media", function(rows) {
  for(i in rows) {
    var media = rows[i];
    db.addMedia(media.hash, media.path);
    db.addCategory(media.hash, 'rating', media.rating);
    db.addCategory(media.hash, 'title', media.title);
  }
  sql.exec("SELECT * FROM tags JOIN media ON media.mediaid = tags.mediaid", function (rows) {
    for (i in rows) {
      var tag = rows[i];
      if (tag.kind) {
        db.addCategory(tag.hash, tag.name, tag.kind);
      }
    }
  });
});

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {
  socket.on('logIn', function (data) {
    if (!socket.username) { //don't let user change username once logged in
      if (!data.username) {
        socket.emit('loginFailed', {'message': 'Username cannot be empty.'});
        return;
      }
      var allClients = io.sockets.connected;
      for (var id in allClients) {
        if (data.username == allClients[id].username) {
          socket.emit('loginFailed', {'message': 'Another player has that username.'});
          return;
        }
      }

      socket.username = data.username;
    }
  });

  socket.on('refresh', function(data) {
    console.log('Sending search results...');
    socket.emit('refreshed', db.get())
  });
});

console.log('Listening...');