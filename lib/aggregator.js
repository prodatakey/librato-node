// Generated by CoffeeScript 1.9.3
(function() {
  var Aggregator, assert, max, min, sum,
    slice = [].slice;

  assert = require('assert');

  sum = function(values) {
    return values.reduce(function(a, b) {
      return a + b;
    });
  };

  max = function(values) {
    return values.reduce(function(a, b) {
      return Math.max(a, b);
    });
  };

  min = function(values) {
    return values.reduce(function(a, b) {
      return Math.min(a, b);
    });
  };

  Aggregator = (function() {
    function Aggregator() {
      this.cache = {};
    }

    Aggregator.prototype.flushTo = function(queue) {
      var key, name, obj, ref, ref1, results, source, values;
      ref = this.cache;
      results = [];
      for (key in ref) {
        values = ref[key];
        ref1 = key.split(';'), name = ref1[0], source = ref1[1];
        obj = {
          name: name
        };
        if (values.length > 1) {
          values.sort();
          obj.count = values.length;
          obj.sum = sum(values);
          obj.max = max(values);
          obj.min = min(values);
          obj.sum_squares = sum(values.map(function(value) {
            return Math.pow(value, 2);
          }));
        } else {
          obj.value = values[0];
        }
        if (source != null) {
          obj.source = source;
        }
        queue.push(obj);
        results.push(delete this.cache[key]);
      }
      return results;
    };

    Aggregator.prototype.measure = function(key, value) {
      var base;
      assert(value != null, 'value is required');
      return ((base = this.cache)[key] != null ? base[key] : base[key] = []).push(value);
    };

    Aggregator.prototype.timing = function(key, fn, cb) {
      var done, retval, start;
      assert(fn != null, 'function is required');
      start = process.hrtime();
      done = (function(_this) {
        return function() {
          var base, msec, ref, sec, usec;
          ref = process.hrtime(start), sec = ref[0], usec = ref[1];
          msec = (sec * 1000) + Math.max(usec / 1000 / 1000);
          return ((base = _this.cache)[key] != null ? base[key] : base[key] = []).push(msec);
        };
      })(this);
      if (fn.length) {
        return fn(function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          done();
          return cb != null ? cb.apply(this, args) : void 0;
        });
      } else {
        retval = fn();
        done();
        return retval;
      }
    };

    return Aggregator;

  })();

  module.exports = Aggregator;

}).call(this);

//# sourceMappingURL=aggregator.js.map
