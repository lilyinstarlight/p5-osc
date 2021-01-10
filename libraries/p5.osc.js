(function (scope) {
  let socket, callbacks = {};

  scope.setupOsc = function (oscPortIn, oscPortOut, oscHostIn, oscHostOut, bridgeUrl) {
    oscHostIn = oscHostIn || 'localhost';
    oscHostOut = oscHostOut || 'localhost';

    bridgeUrl = bridgeUrl || 'http://localhost:8081';

    socket = io(bridgeUrl, { transports: ['websocket'] });

    socket.on('connect', function () {
      socket.emit('config', {
        server: { port: oscPortIn,  host: oscHostIn  },
        client: { port: oscPortOut, host: oscHostOut }
      });
    });

    socket.on('message', function (msg) {
      let msgs;

      if (msg[0] === '#bundle')
        msgs = msg.slice(2);
      else
        msgs = [msg];

      for (let idx = 0; idx < msgs.length; idx++) {
        let callback = callbacks[msgs[idx][0]];
        if (typeof callback !== 'undefined')
          callback(...msgs[idx].splice(1));
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
