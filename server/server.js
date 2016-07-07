'use strict';

require('dotenv').config();

const Hapi = require('hapi');
const plugins = require('./plugins');
const pg = require('pg');

const postgresConfig = {
  database: 'pineapple',
  user: 'postgres',
  password: '',
  host: 'db',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};


const server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: '3000'
});

const validate = (decoded, request, callback) => {
  return callback(null, !!decoded);
};

const pool = new pg.Pool(postgresConfig);
const User = require('./utils/user');
User.setPool(pool);

server.register(plugins, () => {

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validateFunc: validate,
    verifyOptions: {
      algorithms: ['HS256']
    },
    urlKey: false
  });

  server.route({
    method: 'POST',
    path: '/auth',
    config: { auth: false },
    handler: (request, reply) => {

      User.loginUser(request.payload.username, request.payload.password).then(token => {
        reply({
          token: token
        }).code(200);
      }).catch(err => {
        server.log('error', err);
        reply({ message: 'Incorrect username or password' }).code(401);
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/auth/register',
    config: { auth: false },
    handler: (request, reply) => {

      User.checkExists(request.payload.username).then(exists => {
        if (exists) {
          return reply({
            message: 'Username already taken'
          }).code(400);
        }

        const { firstName, lastName, username, email, password } = request.payload;

        return User.createUser({
          username,
          password,
          firstName,
          lastName,
          email
        }).then(token => {
          return reply({
            token: token
          }).code(200);
        });
      }).catch(err => {
        server.log('error', err);
      });
    }
  });
});

server.start(err => {

  if (err) {
    throw err;
  }

  server.log('info', `Server running at: ${server.info.uri}`);
});

module.exports = server;
