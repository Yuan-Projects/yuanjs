  yuanjs.bind = function(func, context) {
    if (Function.prototype.bind) {
      return Function.prototype.bind.apply(func, Array.prototype.slice.call(arguments, 1));
    }
    var args = Array.prototype.slice.call(arguments, 2);
    return function() {
      return func.apply(context, args);
    };
  }; 