const pg = require('pg');
const User = require('./user.js');

const postgresConfig = {
  database: 'pineapple',
  user: 'postgres',
  password: '',
  host: 'db',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

const pool = new pg.Pool(postgresConfig);

User._set(pool);

module.exports = exports = {
  User
};

