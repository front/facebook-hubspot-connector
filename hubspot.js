'use strict';

const request = require('request');

const endpoint = 'https://api.hubapi.com/contacts/v1';
const apiKey = process.env.HS_KEY;
const listId = process.env.HS_LIST;

if(!apiKey || !listId) {
  return console.log('Hubspot vars not set!');
}


function createContact (email, firstname, lastname) {
  let data = {
    properties: [{
      property: 'email',
      value: email
    }, {
      property: 'firstname',
      value: firstname
    }, {
      property: 'lastname',
      value: lastname
    }]
  };

  request({
    method: 'POST',
    url: endpoint + '/contact',
    qs: {
      hapikey: apiKey
    },
    json: true,
    body: data
  },
  (err, res, body) => {
    if(err) {
      return console.log(err);
    }
    console.log(body);
    console.log('----------------');

    let data2 = {
      vids: [ body.vid ]
    };

    request({
      method: 'POST',
      url: endpoint + '/lists/' + listId + '/add',
      qs: {
        hapikey: apiKey
      },
      json: true,
      body: data2
    },
    (err, res, body) => {
      if(err) {
        return console.log(err);
      }
      console.log(body);
    });
  });
}


module.exports = {
  createContact
};
