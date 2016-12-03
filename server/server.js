'use strict';

require('dotenv').config();

const Hapi = require('hapi');
const plugins = require('./plugins');

const apiKey = 'key-46c60d5f84e147872c9f0ab8115aef82';
const domain = 'duelvote.com';
const mailgun = require('mailgun-js')({ apiKey, domain })

const server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: '3000'
});

const validate = (decoded, request, callback) => {
  return callback(null, !!decoded);
};

const { User } = require('./models');

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

      User.login(request.payload.username, request.payload.password).then(token => {
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

      User.exists(request.payload.username).then(exists => {
        if (exists) {
          return reply({
            message: 'Username already taken'
          }).code(400);
        }

        const { username, email, password } = request.payload;

        const data = {
          from: 'Accounts <accounts@duelvote.com>',
          to: email,
          subject: 'Welcome',
          text: 'Welcome to Duelvote!'
        };

        return User.create({
          username,
          password,
          email
        }).then(token => {
          new Promise((resolve, reject) => {
            mailgun.messages().send(data, (error, body) => {
              if (error) {
                return reject(error);
              }
              return resolve(body);
            });
          });

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
