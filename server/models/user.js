'use strict';

require('dotenv').config();

const passwordUtils = require('../utils/passwordUtils');
const JWT = require('jsonwebtoken');
const SALT_ROUNDS = 15;

let _pool;

const exists = username => {
    return _pool.query('SELECT EXISTS(SELECT 1 FROM users WHERE username=$1) AS "exists"', [username]).then(res => {
      return res.rows[0].exists;
    });
}

const create = ({ username, password, fullName, email }) => {

  return passwordUtils.hashPassword(password, SALT_ROUNDS).then(hash => {
    return _pool.query('INSERT INTO users (full_name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id', [
      fullName,
      username,
      email,
      hash
    ]).then(result => {
      const session = {
        valid: true,
        id: result.rows[0].id,
        exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes
      };

      return JWT.sign(session, process.env.JWT_SECRET);
    }).catch(error => {
        if (error.code === '23505') {
          throw new Error('Unique constraint violation. Username already exists.');
        }
      });
  });
};

const login = (username, password) => {

  return _pool.query('SELECT * FROM users WHERE username=$1', [username]).then(result => {
    const user = result.rows[0];
    if (!user) {
      throw new Error();
    }

    return passwordUtils.checkPassword(password, user.password).then(valid => {
      if (!valid) {
        throw new Error();
      }

      return user;
    });
  }).then(user => {
    const session = {
      valid: true,
      id: user.id,
      exp: new Date().getTime() + 30 * 60 * 1000
    };

    return JWT.sign(session, process.env.JWT_SECRET);
  });

}

const User = {
  _set: pool => _pool = pool,
  exists,
  create,
  login
};

module.exports = User;
