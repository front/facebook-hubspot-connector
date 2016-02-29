'use strict';

const FB = require('fb');
const hubspot = require('./hubspot');

const access_token = process.env.PAGE_TOKEN;
const verify_token = process.env.FB_VERIFY;

if(!access_token || !verify_token) {
  console.log('Env vars not set!');
  process.exit(0);
}


function getLeadInfo (id) {
  FB.api(id,
  {
    access_token: access_token
  },
  function (res) {
    if(res.error) {
      return console.log(res.error);
    }

    let user = {};
    for(let prop of res.field_data) {
      user[prop.name] = prop.values[0];
    }
    console.log(user);

    let parts = user.full_name.split(' ');
    let last = parts.splice(-1).toString();
    let first = parts.join(' ');

    hubspot.createContact(user.email, first, last);
  });
}


function extractLeadData (data) {
  if(!data || data.object !== 'page' || !data.entry) {
    return;
  }

  let change = data.entry[0] && data.entry[0].changes && data.entry[0].changes[0];
  if(!change || change.field !== 'leadgen'){
    return;
  }

  let genid = change.value.leadgen_id;
  getLeadInfo(genid.toString());
}


function fbRequest (request, reply) {
  let qs = request.query;

  let challenge  = qs['hub.challenge'];
  let token = qs['hub.verify_token'];

  reply(token === verify_token && challenge || 'FB');

  process.nextTick(() => {
    extractLeadData(request.payload);
  });
}


module.exports = {
  fbRequest
};
