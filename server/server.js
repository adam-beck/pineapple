'use strict';

require('dotenv').config();

const Hapi = require('hapi');
const plugins = require('./plugins');
const JWT = require('jsonwebtoken');
const pg = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 15;


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
  port: '80'
});

const validate = (decoded, request, callback) => {
  return callback(null, !!decoded);
};

const pool = new pg.Pool(postgresConfig);

pool.connect(err => {
  if (err) {
    return server.log('error', 'error fetching client from pool: ' + err);
  }
});

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
    method: 'GET',
    path: '/status',
    handler: (request, reply) => {
      reply('yes');
    }
  });

  server.route({
    method: 'POST',
    path: '/auth',
    config: { auth: false },
    handler: (request, reply) => {
      pool.query('SELECT * FROM users WHERE username=$1', [request.payload.username], (err, result) => {

        if (err) {
          return server.log('error', err);
        }

        const user = result.rows[0];

        if (!user) {
          return reply({ message: 'Incorrect username or password' }).code(401);
        }

        bcrypt.compare(request.payload.password, user.password, (err, result) => {
          if (err) {
            return server.log('error', err);
          }

          if (result) {
            const session = {
              valid: true,
              id: user.id,
              exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes
            };
            const token = JWT.sign(session, process.env.JWT_SECRET);

            return reply({
              token: token
            }).code(200);
          }

          reply({ message: 'Incorrect username or password' }).code(401);

        });
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/auth/register',
    config: { auth: false },
    handler: (request, reply) => {

      pool.query('SELECT * FROM users WHERE username=$1', [request.payload.username], (err, result) => {

        if (err) {
          return server.log('error', err);
        }

        if (result.rows.length >= 1) {
          return reply({
            error: 'username_taken'
          }).code(400);
        }

        bcrypt.hash(request.payload.password, saltRounds, (err, hash) => {
          pool.query('INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id', [
            request.payload.firstName,
            request.payload.lastName,
            request.payload.username,
            request.payload.email,
            hash
          ], (err, result) => {

            if (err) {
              server.log('error', err);
            }

            const session = {
              valid: true,
              id: result.rows[0].id,
              exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes
            };
            const token = JWT.sign(session, process.env.JWT_SECRET);

            return reply({
              token: token
            }).code(200);

          });
        });
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
