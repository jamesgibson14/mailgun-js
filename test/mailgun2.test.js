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
  },

  'test domains.list()': function (done) {
    mailgun.domains().list(function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test domains.get()': function (done) {
    mailgun.domains(fixture.domain.name).info(function (err, res, body) {
      console.dir(res);
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.domain);
      assert.equal(fixture.domain.name, body.domain.name);
      assert.equal(fixture.domain.smtp_password, body.domain.smtp_password);
      done();
    });
  },

  'test domains.create() ': function (done) {
    mailgun.domains().create(fixture.domain, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Domain has been created/.test(body.message));
      assert.ok(body.domain);
      assert.equal(fixture.domain.name, body.domain.name);
      assert.equal(fixture.domain.smtp_password, body.domain.smtp_password);
      done();
    });
  }
};