'use strict';

const Hapi = require('hapi');
const facebook = require('./facebook');

const appId = process.env.APP_ID;

if(!appId) {
  return console.log('AppId var not set!');
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

  server.route({
    method: '*',
    path: '/',
    handler (request, reply) {
      reply('Facebook Hubspot Connector');
    }
  });

  server.route({
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
  });

  if(facebook.handler) {
    server.route({
      method: '*',
      path: '/facebook',
      handler: facebook.handler
    });
  }

  server.start(() => {
    console.log('Facebook Hubspot Connector:', 'Started on ' + server.info.port);
  });
});
