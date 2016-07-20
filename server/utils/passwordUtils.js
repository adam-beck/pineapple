const bcrypt = require('bcrypt');

function hashPassword(password, rounds) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, rounds, (err, hash) => {
      if (err) {
        return reject(err);
      }

      return resolve(hash);
    });
  });
}

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

module.exports = {
  hashPassword,
  checkPassword
};
