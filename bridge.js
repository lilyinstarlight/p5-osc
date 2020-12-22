var osc = require('node-osc'),
    http = require('http').createServer();
    io = require('socket.io')(http, { cors: { origin: true } });

http.listen(8081, 'localhost');

io.on('connection', function (socket) {
  var oscServer, oscClient;

  socket.on('config', function (obj) {
    console.log('config', obj);
    oscServer = new osc.Server(obj.server.port, obj.server.host);
    oscClient = new osc.Client(obj.client.host, obj.client.port);

    oscClient.send('/status', socket.id + ' connected');

    oscServer.on('message', function(msg, rinfo) {
      socket.emit('message', msg);
      console.log('sent OSC message to WS', msg, rinfo);
    });
  });

  socket.on('message', function (obj) {
    oscClient.send(...obj);
    console.log('sent WS message to OSC', obj);
  });

  socket.on('disconnect', function () {
    oscClient.close();
    oscServer.close();
  })
});
