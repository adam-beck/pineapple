const pg = require('pg');
const { assert } = require('chai');
const testUtilities = require('../test/test-utilities.js');
const { describe, beforeEach, it } = require('mocha');

const config = {
  database: 'pineapple_qa',
  user: 'postgres',
  password: '',
  host: 'localhost',
  port: 5000,
  max: 10,
  idleTimeoutMillis: 30000
};

let pool = new pg.Pool(config);
const User = require('../user.js');
User._set(pool);

beforeEach(done => {
  pool.end().then(() => {
    testUtilities.reset();
    pool = new pg.Pool(config);
    User._set(pool);
    done();
  });
});

describe('User', () => {

  describe('existence', () => {

    it('should find the existing user', done => {
      User.exists('foobar').then(exists => {
        assert.equal(exists, true);
        done();
      }).catch(done);
    });

    it('should not find user if non existant', done => {
      User.exists('DoesNotExist').then(exists => {
        assert.equal(exists, false);
        done();
      }).catch(done);
    });

  });

  describe('creation', () => {

    // cannot use arrow function here because we need to bind to the test context
    it('should return a JWT', function(done) {
      this.timeout(5000); // this test generates a password hash which takes ~3 seconds
      User.create({ username: 'exampleuser', password: 'abc123' }).then(jwt => {
        assert.isDefined(jwt);
        done();
      }).catch(done);
    });

  });

  describe('login', () => {

    it('should throw if user doesn\'t exist', done => {
      User.login('unknownuser', 'password').catch(err => {
        assert.isDefined(err);
        done();
      });
    });

    it('should throw if password is invalid', done => {
      User.login('foobar', 'invalidpassword').catch(err => {
        assert.isDefined(err);
        done();
      });
    });

    it('should return jwt on succesfull login', function(done) {
      this.timeout(9000); // longer timeout since we are creating a user and then attempting a login
      User.create({ username: 'johndoe', password: 'abc123xyz' }).then(() => {
        return User.login('johndoe', 'abc123xyz');
      }).then(jwt => {
        assert.isDefined(jwt);
        done();
      }).catch(done);
    });

  });

});
