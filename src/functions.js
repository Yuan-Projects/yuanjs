  yuanjs.bind = function(func, context) {
    var slice = Array.prototype.slice; 
    if (Function.prototype.bind) {
      return Function.prototype.bind.apply(func, Array.prototype.slice.call(arguments, 1));
    }
    var args = slice.call(arguments, 2);
    return function() {
      var innerArgs = slice.call(arguments);
      return func.apply(context, args.concat(innerArgs));
    };
  }; 