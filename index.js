'use strict';

const Hapi = require('hapi');
const handler = require('./handler');


const appId = process.env.APP_ID;
if(!appId) {
  console.log('Env vars not set!');
  process.exit(0);
}

const server = new Hapi.Server();
server.connection({
  port: process.env.PORT || 5000,
  routes: {
    cors: true
  }
});


server.register([
  require('vision')
], function (err) {
  if(err) {
    return console.log('Hapi: Error loading plugins');
  }

  server.views({
    engines: {
      html: require('handlebars')
    },
    path: './www'
  });

  server.route([
    {
      method: '*',
      path: '/',
      handler (request, reply) {
        reply('Facebook Hubspot Connector');
      }
    }, {
      method: 'GET',
      path: '/setup',
      handler: {
        view: {
          template: 'index',
          context: {
            appId
          }
        }
      }
    }, {
      method: '*',
      path: '/facebook',
      handler: handler.fbRequest
    }
  ]);

  server.start(() => {
    console.log('Facebook Hubspot Connector:', 'Started on ' + server.info.port);
  });
});
