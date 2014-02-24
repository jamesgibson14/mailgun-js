var auth = require('./auth.json');
var fixture = require('./fixture.json');
var assert = require('assert');
var Mailgun = require('../lib/mailgun');

var mailgun;

module.exports = {
  before: function (fn) {
    mailgun = new Mailgun({apiKey: auth.api_key, domain: auth.domain});

    fn();
  },

  'test messages().send()': function (done) {
    mailgun.messages().send(fixture.message, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  }
};