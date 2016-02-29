'use strict';

const FB = require('fb');

let token = process.env.TOKEN;
if(!token) {
  console.log('Env vars not set!');
  process.exit(0);
}


FB.options({
  appId: 172831193073690
});


function getLeadInfo (id) {
  FB.api(id,
  {
    access_token: token
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
  });
}

// getLeadInfo('763626497075796');


module.exports = {

  lead (request, reply) {
    let qs = request.query;

    let challenge  = qs['hub.challenge'];
    let verifyToken = qs['hub.verify_token'];

    if(verifyToken !== 'abc123') {
      return reply(verifyToken || 'NOK');
    }
    reply(challenge || 'NOK');


    let data = request.payload;
    if(!data || data.object !== 'page' || !data.entry) {
      return;
    }

    var change = data.entry[0] && data.entry[0].changes && data.entry[0].changes[0];
    if(!change || change.field !== 'leadgen'){
      return;
    }

    var genid = change.value.leadgen_id;
    process.nextTick(() => {
      getLeadInfo(genid.toString());
    });
  }
};
