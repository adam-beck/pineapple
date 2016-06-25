'use strict';

const Hapi = require('hapi');
const plugins = require('./plugins');

const server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: '80'
});

server.register(plugins, () => {

  server.start(err => {

    if (err) {
      throw err;
    }

    server.log(`Server running at: ${server.info.uri}`);
  });
});
