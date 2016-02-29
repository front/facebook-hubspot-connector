'use strict';


const Hapi = require('hapi');
const handler = require('./handler');


const server = new Hapi.Server();
server.connection({
  port: process.env.PORT || 5000,
  routes: {
    cors: true
  }
});


server.register([
  require('inert')
], function (err) {
  if(err) {
    return console.log('Hapi: Error loading plugins');
  }

  server.route([
    {
      method: '*',
      path: '/',
      handler (request, reply) {
        reply('Facebook Hubspot Connector');
      }
    },
    {
      method: 'GET',
      path: '/setup/{something*}',
      handler: {
        directory: {
          path: 'public',
          index: true
        }
      }
    },
    {
      method: '*',
      path: '/facebook',
      handler: handler.lead
    }
  ]);


  server.start(() => {
    console.log('Facebook Leads POC:', 'Started on ' + server.info.port);
  });

});
