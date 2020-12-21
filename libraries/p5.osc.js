(function (scope) {
  var socket, callbacks = {};

  scope.setupOsc = function (oscPortIn, oscPortOut, oscHostIn, oscHostOut) {
    oscHostIn = oscHostIn || '127.0.0.1';
    oscHostOut = oscHostOut || '127.0.0.1';

    socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });

    socket.on('connect', function () {
      socket.emit('config', {
        server: { port: oscPortIn,  host: oscHostIn  },
        client: { port: oscPortOut, host: oscHostOut }
      });
    });

    socket.on('message', function (msg) {
      var msgs;

      if (msg[0] === '#bundle')
        msgs = msg.slice(2);
      else
        msgs = [msg];

      for (var idx = 0; idx < msgs.length; idx++) {
        var callback = callbacks[msgs[idx][0]];
        if (typeof callback !== 'undefined')
          callback.apply(undefined, msgs[idx].splice(1));
      }
    });
  }

  scope.registerOsc = function (address, callback) {
    callbacks[address] = callback;
  }

  scope.sendOsc = function (address, ...values) {
    socket.emit('message', [address].concat(values));
  }
})(window);
