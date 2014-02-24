var inflection = require('inflection');
var pathProxy = require('path-proxy');

var Builder = function(baseObj, resources) {
  this.baseObj = baseObj;
  this.resources = resources;
};

Builder.prototype.build = function() {
  for (var key in this.resources) {
    this.buildResource(this.resources[key]);
  }
};

Builder.prototype.buildResource = function(resource) {
  resource.links.forEach(this.buildAction, this);
};

Builder.prototype.buildAction = function(action) {
  var constructor = pathProxy.pathProxy(this.baseObj, action.href);
  var actionName = action.title;
  console.log('building ' + actionName);

  constructor.prototype[getName(actionName)] = function (data, fn) {
    console.log('action');
    var requestPath = action.href;
    var pathParams = action.href.match(/{[^}]+}/g) || [];

    if (this.params.length !== pathParams.length) {
      throw new Error('Invalid number of params in path (expected ' + pathParams.length + ', got ' + this.params.length + ').');
    }

    this.params.forEach(function (param) {
      requestPath = requestPath.replace(/{[^}]+}/, param);
    });

    this.client = this.base;
    return this.client.request(action.method, requestPath, data, fn);
  };
  console.log('done building ' + actionName);
}

function getName(name) {
  name = name.toLowerCase();
  name = inflection.dasherize(name).replace(/-/g, '_');
  name = inflection.camelize(name, true);

  return name;
}

exports.build = function(baseObj, resources) {
  var b = new Builder(baseObj, resources);
  b.build();
};




