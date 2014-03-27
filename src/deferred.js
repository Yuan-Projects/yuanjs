  /**
   * Deferred Object
   */
  function Deferred() {
    var slice = Array.prototype.slice;
    var status = "pending";
    var callbacks = { ok: [], fail: [] };
    var values;
  
    function resolveInternal(state, args) {
      if (status !== "pending") {
        throw new Error("Deferred has already been resolved");
      }
      status = state;
      values = slice.call(args, 0);
      callbacks[state].forEach(function (e) {
        e.apply(e, values);
      });
    }
  
    return {
      resolve: function () {
        resolveInternal("ok", arguments);
      },
      reject: function () {
        resolveInternal("fail", arguments);
      },
      promise: function () {
        var self;
  
        function promiseInternal(state, func) {
          if (typeof func !== "function") {
            throw new Error("Callback argument must be a Function");
          }
  
          if (status === state) {
            func.apply(func, values);
          } else {
            callbacks[state].push(func);
          }
          return self;
        }
  
        self = {
          done: function (func) {
            return promiseInternal("ok", func);
          },
          fail: function (func) {
            return promiseInternal("fail", func);
          },
          then: function (done, error) {
            return this.done(done).fail(error);
          }
        };
  
        return self;
      }
    };
  }
  
  yuanjs.Deferred = Deferred;
  