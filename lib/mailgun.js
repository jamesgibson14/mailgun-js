var https = require('https');
var qs = require('querystring');
var builder = require('./build');
var resources = require('./schema').definitions;

var noop = function () {
};

var Mailgun = function(options) {
  this.apiKey = options.apiKey;
  this.domain = options.domain;
  this.username = 'api';
  this.host = 'api.mailgun.net';
  this.endpoint = '/v2';
  this.auth = [this.username, this.apiKey].join(':');
};

Mailgun.prototype.request = function (method, resource, data, fn) {
  var self = this;

  if (typeof data === 'function' && !fn) {
    fn = data;
    data = {};
  }

  if (!fn) fn = noop;

  var getDomain = function () {
    var d = '/' + self.domain;
    //filter out API calls that do not require a domain specified
    if ((resource.indexOf('routes') >= 0)
      || (resource.indexOf('lists') >= 0)
      || (resource.indexOf('domains') >= 0 )) {
      d = '';
    }
    return d;
  };

  var path = ''.concat(this.endpoint, getDomain(), resource);

  var qsdata = qs.stringify(data);

  var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': qsdata.length
  };

  var opts = {
    hostname: this.host,
    path: path,
    method: method,
    headers: headers,
    auth: this.auth,
    agent: false
  };

  var req = https.request(opts, function (res) {
    var chunks = '';
    var error;

    res.on('data', function (chunk) {
      chunks += chunk;
    });

    res.on('error', function (err) {
      error = err;
    });

    res.on('end', function () {
      if (error) {
        return fn(error, res);
      }

      if (res && (res.headers['content-type'] === 'application/json')) {
        try {
          var body = JSON.parse(chunks);
          if (!error && res.statusCode !== 200) {
            error = new Error(body.message);
          }
        }
        catch (e) {
        }
      }

      return fn(error, res, body);
    });
  });

  req.on('error', function (e) {
    return fn(e);
  });

  req.write(qsdata);
  req.end();
};

Mailgun.prototype.post = function (path, data, fn) {
  return this.request('POST', path, data, fn);
};

Mailgun.prototype.get = function (path, data, fn) {
  return this.request('GET', path, data, fn);
};

Mailgun.prototype.delete = function (path, data, fn) {
  return this.request('DELETE', path, data, fn);
};

Mailgun.prototype.put = function (path, data, fn) {
  return this.request('PUT', path, data, fn);
};

builder.build(Mailgun, resources);

module.exports = Mailgun;

