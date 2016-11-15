'use strict';

const request = require('request');
const Global = require('./exports.js');
const APP_ID = '';
const MonzoSkill = require('./monzoSkill.js');
const ACCOUNT_ID = Global.ACCOUNT_ID;
const balanceURL = 'https://api.monzo.com/balance?account_id=' + ACCOUNT_ID;

let Monzo = function() {
  MonzoSkill.call(this, APP_ID);
};

Monzo.prototype = Object.create(MonzoSkill.prototype);
Monzo.prototype.constructor = Monzo;

Monzo.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
  // Can we grab the account id from Monzo here and store it?
};

Monzo.prototype.intentHandlers = {
  'GetBalance': function (intent, session, response) {
    getUserBalance(intent, session, response);
  },
  'AMAZON.HelpIntent': function (intent, session, response) {
    response.ask('You can ask Monzo for your balance.', 'You can ask Monzo for your balance.');
  }
};

function getUserBalance(intent, session, AlexaResponse) {
  request({
    url: balanceURL,
    headers: {
      'Authorization': 'Bearer ' + session.user.accessToken
    }
  }, function(err, res) {
    let data = JSON.parse(res.body);
    let balance = data.balance / 100;
    
    AlexaResponse.tell('Your balance is ' + balance + ' pounds');
  }); 
}

exports.handler = function (event, context) {
  let monzo = new Monzo();
  monzo.execute(event, context);
};
