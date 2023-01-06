// @ts-nocheck

function bind(func, context) {
  var slice = Array.prototype.slice;
  var args = slice.call(arguments, 2);
  return function () {
    var innerArgs = slice.call(arguments);
    return func.apply(context, args.concat(innerArgs));
  };
}
export { bind };
