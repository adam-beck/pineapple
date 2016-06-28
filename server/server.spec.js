const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const sinon = require('sinon');
require('sinon-as-promised');

const server = require('./server');
const User = require('./utils/user');

lab.test('should return a 400 when registering a user that already exists', done => {
  sinon.stub(User, 'checkExists').resolves(true);

  const options = {
    method: 'POST',
    url: '/auth/register',
    payload: {
      username: 'foo',
      password: 'helloworld',
      firstName: 'Foo',
      lastName: 'Bar',
      email: 'Foobar@helloworld.com'
    }
  };

  server.inject(options, response => {
    User.checkExists.restore();
    Code.expect(response.statusCode).to.equal(400);
    Code.expect(response.result.message).to.equal('Username already taken');
    done();
  });
});

lab.test('should create user with payload information', done => {
  sinon.stub(User, 'checkExists').resolves(false);
  var createUserStub = sinon.stub(User, 'createUser').resolves('tokenabc123');

  const options = {
    method: 'POST',
    url: '/auth/register',
    payload: {
      username: 'foo',
      password: 'helloworld',
      firstName: 'Foo',
      lastName: 'Bar',
      email: 'Foobar@helloworld.com'
    }
  };

  server.inject(options, () => {
    User.checkExists.restore();
    User.createUser.restore();

    sinon.assert.calledWith(createUserStub, {
      username: 'foo',
      password: 'helloworld',
      firstName: 'Foo',
      lastName: 'Bar',
      email: 'Foobar@helloworld.com'
    });
    done();
  });
});

lab.test('should return a token upon successfully creating a user', done => {
  sinon.stub(User, 'checkExists').resolves(false);
  sinon.stub(User, 'createUser').resolves('tokenabc123');

  const options = {
    method: 'POST',
    url: '/auth/register',
    payload: {
      username: 'foo',
      password: 'helloworld',
      firstName: 'Foo',
      lastName: 'Bar',
      email: 'Foobar@helloworld.com'
    }
  };

  server.inject(options, response => {
    User.checkExists.restore();
    User.createUser.restore();

    Code.expect(response.statusCode).to.equal(200);
    Code.expect(response.result.token).to.equal('tokenabc123');

    done();
  });
});

lab.test('should return a token given a correct username and password', done => {
  sinon.stub(User, 'loginUser').resolves('tokenabc123');
  const options = {
    method: 'POST',
    url: '/auth',
    payload: {
      username: 'foo',
      password: 'helloworld'
    }
  };

  server.inject(options, response => {
    User.loginUser.restore();

    Code.expect(response.statusCode).to.equal(200);
    Code.expect(response.result.token).to.equal('tokenabc123');

    done();
  });
});

lab.test('should provide an error if either username or password is incorrect', done => {
  sinon.stub(User, 'loginUser').rejects();
  const options = {
    method: 'POST',
    url: '/auth',
    payload: {
      username: 'hacker',
      password: 'wrongpassword'
    }
  };

  server.inject(options, response => {
    User.loginUser.restore();

    Code.expect(response.statusCode).to.equal(401);
    Code.expect(response.result.message).to.equal('Incorrect username or password');

    done();
  });
});
