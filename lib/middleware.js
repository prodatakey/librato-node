// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = function(librato) {
    return function(arg) {
      var ref, requestCountKey, responseTimeKey, statusCodeKey;
      ref = arg != null ? arg : {}, requestCountKey = ref.requestCountKey, responseTimeKey = ref.responseTimeKey, statusCodeKey = ref.statusCodeKey;
      return function(req, res, next) {
        var end;
        req._libratoStartTime = new Date;
        if (req._librato != null) {
          return next();
        }
        req._librato = true;
        librato.increment(requestCountKey != null ? requestCountKey : 'requestCount');
        end = res.end;
        res.end = function(chunk, encoding) {
          res.end = end;
          res.end(chunk, encoding);
          librato.measure(responseTimeKey != null ? responseTimeKey : 'responseTime', new Date - req._libratoStartTime);
          return librato.increment((statusCodeKey != null ? statusCodeKey : 'statusCode') + "." + (Math.floor(res.statusCode / 100)) + "xx");
        };
        return next();
      };
    };
  };

}).call(this);

//# sourceMappingURL=middleware.js.map