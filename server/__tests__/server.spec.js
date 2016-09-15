const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const sinon = require('sinon');
require('sinon-as-promised');

const server = require('../server.js');
const { User } = require('../models');

lab.test('should return a 400 when registering a user that already exists', done => {
  sinon.stub(User, 'exists').resolves(true);

  const options = {
    method: 'POST',
    url: '/auth/register',
    payload: {}
  };

  server.inject(options, response => {
    User.exists.restore();
    Code.expect(response.statusCode).to.equal(400);
    Code.expect(response.result.message).to.equal('Username already taken');
    done();
  });
});

lab.test('should create user with payload information', done => {
  sinon.stub(User, 'exists').resolves(false);
  var createUserStub = sinon.stub(User, 'create').resolves('tokenabc123');

  const options = {
    method: 'POST',
    url: '/auth/register',
    payload: {
      username: 'foo',
      password: 'helloworld',
      email: 'Foobar@helloworld.com'
    }
  };

  server.inject(options, () => {
    User.exists.restore();
    User.create.restore();

    sinon.assert.calledWith(createUserStub, sinon.match({
      username: 'foo',
      password: 'helloworld',
      email: 'Foobar@helloworld.com'
    }));
    done();
  });
});

lab.test('should return a token upon successfully creating a user', done => {
  sinon.stub(User, 'exists').resolves(false);
  sinon.stub(User, 'create').resolves('tokenabc123');

  const options = {
    method: 'POST',
    url: '/auth/register',
    payload: {}
  };

  server.inject(options, response => {
    User.exists.restore();
    User.create.restore();

    Code.expect(response.statusCode).to.equal(200);
    Code.expect(response.result.token).to.equal('tokenabc123');

    done();
  });
});

lab.test('should return a token given a correct username and password', done => {
  sinon.stub(User, 'login').resolves('tokenabc123');
  const options = {
    method: 'POST',
    url: '/auth',
    payload: {
      username: 'foo',
      password: 'helloworld'
    }
  };

  server.inject(options, response => {
    User.login.restore();

    Code.expect(response.statusCode).to.equal(200);
    Code.expect(response.result.token).to.equal('tokenabc123');

    done();
  });
});

lab.test('should provide an error if either username or password is incorrect', done => {
  sinon.stub(User, 'login').rejects();
  const options = {
    method: 'POST',
    url: '/auth',
    payload: {
      username: 'hacker',
      password: 'wrongpassword'
    }
  };

  server.inject(options, response => {
    User.login.restore();

    Code.expect(response.statusCode).to.equal(401);
    Code.expect(response.result.message).to.equal('Incorrect username or password');

    done();
  });
});
