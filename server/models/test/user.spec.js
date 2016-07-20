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

describe('User', () => {

  beforeEach(done => {
    pool.end().then(() => {
      testUtilities.reset();
      pool = new pg.Pool(config);
      User._set(pool);
      done();
    });
  });

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
