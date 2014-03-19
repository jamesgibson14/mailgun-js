var auth = require('./auth.json');
var fixture = require('./fixture.json');
var assert = require('assert');
var Mailgun = require('../lib/mailgun');

var mailgun;

function cleanup(fn) {
  var counter = 0;
  // lame hack
  var finishAfter = function () {
    counter = counter + 1;
    if (counter >= 1) {
      if (fn) {
        fn();
      }
    }
  };

  /*mailgun.mailboxes.del(fixture.mailbox.mailbox, function (err, res, body) {
   finishAfter();
   });

   mailgun.routes.del(routeId, function (err, res, body) {
   finishAfter();
   });

   mailgun.lists.del(fixture.mailingList.address, function (err, res, body) {
   finishAfter();
   });*/

  mailgun.domains(fixture.domain.name).delete(function (err, res, body) {
    finishAfter();
  });
}

module.exports = {
  before: function (fn) {
    mailgun = new Mailgun({apiKey: auth.api_key, domain: auth.domain});

    console.log('Setup');
    // first clean up so we hopefully don't run into limit errors
    cleanup(function () {
      var counter = 0;
      var finish = function () {
        counter = counter + 1;
        if (counter >= 1) {
          if (fn) {
            console.log('Starting tests...\n');
            fn();
          }
        }
      };

      /*mailgun.mailboxes.create(fixture.mailbox, function (err, res, body) {
       if (err) {
       console.log(err);
       throw new Error('Failed to create sample mailbox for test setup');
       }
       finish();
       });

       mailgun.routes.create(fixture.route, function (err, res, body) {
       if (err) {
       console.log(err);
       throw new Error('Failed to create sample route for test setup');
       }
       else {
       routeId = body.route.id;
       }
       finish();
       });

       mailgun.lists.create(fixture.mailingList, function (err, res, body) {
       if (err) {
       console.log(err);
       throw new Error('Failed to create sample mailing list for test setup');
       }
       finish();
       });*/

      /*mailgun.domains().create(fixture.domain, function (err, res, body) {
        if (err) {
          console.log(err);
          throw new Error('Failed to create sample domain for test setup');
        }
        finish();
      });*/

       finish();
    });
  },

  'test messages.send() invalid "to"': function (done) {
    mailgun.messages().send({}, function (err, res, body) {
      assert.ok(err);
      assert(/Must include "to" parameter/.test(err.message));
      done();
    });
  },

  'test messages.send() invalid "from"': function (done) {
    mailgun.messages().send({to: fixture.message.to}, function (err, res, body) {
      assert.ok(err);
      assert(/Must include "from" parameter/.test(err.message));
      done();
    });
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

  'test domains().list()': function (done) {
    mailgun.domains().list(function (err, res, body) {
      console.dir(body);
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test domains().create() invalid missing address': function (done) {
    mailgun.domains().create({}, function (err, res, body) {
      assert.ok(err);
      assert(/Must include \"name\"/.test(err.message));
      done();
    });
  },

  'test domains().create() invalid missing smtp password': function (done) {
    mailgun.domains().create({ name: fixture.domain.name }, function (err, res, body) {
      assert.ok(err);
      assert(/Must include \"smtp_password\"/.test(err.message));
      done();
    });
  },

  'test domains().create() ': function (done) {
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
  },

  'test domains().info()': function (done) {
    mailgun.domains(fixture.domain.name).info(function (err, res, body) {
      //console.dir(res);
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.domain);
      assert.equal(fixture.domain.name, body.domain.name);
      assert.equal(fixture.domain.smtp_password, body.domain.smtp_password);
      done();
    });
  },

  'test domains().credentials().list()': function (done) {
    mailgun.domains(fixture.domain.name).credentials().list(function (err, res, body) {
      assert.ifError(err);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test domains().credentials().create() missing login': function (done) {
    mailgun.domains(fixture.domain.name).credentials().create({}, function (err, res, body) {
      assert.ok(err);
      assert(/Must include \"login\"/.test(err.message));
      done();
    });
  },

  'test domains().credentials().create() missing password': function (done) {
    mailgun.domains(fixture.domain.name).credentials().create({ login: fixture.credentials.login }, function (err, res, body) {
      assert.ok(err);
      assert(/Must include \"password\"/.test(err.message));
      done();
    });
  },

  'test domains().credentials().create() invalid login type': function (done) {
    mailgun.domains(fixture.domain.name).credentials().create({ login: 123, password: 'test' }, function (err, res, body) {
      assert.ok(err);
      assert(/Invalid parameter type./.test(err.message));
      done();
    });
  },

  'test domains().credentials().create() invalid password type': function (done) {
    mailgun.domains(fixture.domain.name).credentials().create({ login: fixture.credentials.login, password: 123 }, function (err, res, body) {
      assert.ok(err);
      assert(/Invalid parameter type./.test(err.message));
      done();
    });
  },

  'test domains().credentials().create()': function (done) {
    mailgun.domains(fixture.domain.name).credentials().create({ login: fixture.credentials.login, password: fixture.credentials.password }, function (err, res, body) {
      assert.ifError(err);
      assert.ok(body.message);
      done();
    });
  },

  'test domains().credentials().update() missing password': function (done) {
    mailgun.domains(fixture.domain.name).credentials(fixture.credentials.login).update({}, function (err, res, body) {
      assert.ok(err);
      assert(/Must include \"password\"/.test(err.message));
      done();
    });
  },

  'test domains().credentials().update() invalid password type': function (done) {
    mailgun.domains(fixture.domain.name).credentials(fixture.credentials.login).update({ password: 123 }, function (err, res, body) {
      assert.ok(err);
      assert(/Invalid parameter type./.test(err.message));
      done();
    });
  },

  'test domains().credentials().update()': function (done) {
    mailgun.domains(fixture.domain.name).credentials(fixture.credentials.login).update({ password: fixture.credentials.password }, function (err, res, body) {
      assert.ifError(err);
      assert.ok(body.message);
      done();
    });
  },

  'test domains().credentials().delete()': function (done) {
    mailgun.domains(fixture.domain.name).credentials(fixture.credentials.login).delete(function (err, res, body) {
      assert.ifError(err);
      assert.ok(body.message);
      done();
    });
  },

  'test domains().delete()': function (done) {
    var domain = fixture.domain.name;
    mailgun.domains(domain).delete(function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Domain has been deleted/.test(body.message));
      done();
    });
  }
};