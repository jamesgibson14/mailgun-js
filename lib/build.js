var inflection = require('inflection');
var pathProxy = require('path-proxy');

var Builder = function (baseObj, resources) {
  this.baseObj = baseObj;
  this.resources = resources;
};

Builder.prototype.build = function () {
  for (var key in this.resources) {
    console.log('building ' + key);
    this.buildResource(this.resources[key]);
  }
};

Builder.prototype.buildResource = function (resource) {
  resource.links.forEach(this.buildAction, this);
};

Builder.prototype.buildAction = function (action) {
  var constructor = pathProxy.pathProxy(this.baseObj, action.href);
  var actionName = action.title;
  var properties = action.properties;
  var requiredProps = action.required;

  constructor.prototype[getName(actionName)] = function (data, fn) {
    var requestPath = action.href;
    var pathParams = action.href.match(/{[^}]+}/g) || [];

    if (this.params.length !== pathParams.length) {
      return fn(new Error('Invalid number of params in path (expected ' + pathParams.length + ', got ' + this.params.length + ').'));
    }

    this.params.forEach(function (param) {
      requestPath = requestPath.replace(/{[^}]+}/, param);
    });

    var err;

    // check required payload properties
    if (requiredProps && requiredProps.length > 0) {
      for (var i = 0; i < requiredProps.length; i++) {
        var prop = requiredProps[i];
        if (!data[prop]) {
          err = new Error('Must include \"' + prop + '\" parameter.');
          break;
        }
      }
    }

    if (err) {
      return fn(err);
    }

    // check payload property types
    for (var key in properties) {
      var type = properties[key].type;
      var dataParam = data[key];
      if (dataParam && type) {
        if (typeof dataParam !== type) {
          err = new Error('Invalid parameter type. ' + key + ' must be of type: ' + type + '.');
          break;
        }
      }
    }

    if (err) {
      return fn(err);
    }

    this.client = this.base;
    return this.client.request(action.method, requestPath, data, fn);
  };
};

function getName(name) {
  name = name.toLowerCase();
  name = inflection.dasherize(name).replace(/-/g, '_');
  name = inflection.camelize(name, true);

  return name;
}

exports.build = function (baseObj, resources) {
  var b = new Builder(baseObj, resources);
  b.build();
};




