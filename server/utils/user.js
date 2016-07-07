'use strict';

const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const SALT_ROUNDS = 15;
let pool = null;

const setPool = poolArg => {
  pool = poolArg;
};

const checkExists = username => {
  return pool.query('SELECT EXISTS(SELECT 1 FROM users WHERE username=$1) AS "exists"', [username]).then(res => {
    return res.rows[0].exists;
  });
};

function hashPassword(unhashedPassword, saltRounds) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(unhashedPassword, saltRounds, (err, hash) => {
      if (err) {
        return reject(err);
      }
      return resolve(hash);
    });
  });
}

const createUser = ({ username, password, firstName, lastName, email }) => {
  return hashPassword(password, SALT_ROUNDS).then(hash => {
    return pool.query('INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id', [
      firstName,
      lastName,
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
    });
  });
};

function checkPassword(input, storedHash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(input, storedHash, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

const loginUser = (username, password) => {
  return pool.query('SELECT * FROM users WHERE username=$1', [username]).then(results => {
    const user = results.rows[0];
    if (!user) {
      throw new Error();
    }

    return checkPassword(password, user.password).then(valid => {
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

};

module.exports = {
  setPool: setPool,
  checkExists: checkExists,
  loginUser: loginUser,
  createUser: createUser
}
