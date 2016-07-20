const plugins = [];

plugins.push({
  register: require('good'),
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          log: '*',
          response: '*'
        }]
      },{
        module: 'good-console'
      }, 'stdout']
    }
  }
});

plugins.push({
  register: require('hapi-auth-jwt2'),
});

module.exports = plugins;
