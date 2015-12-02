/**
 * Merge multiple objects dynamically with modifying either arguments.
 * Inspired by http://stackoverflow.com/questions/171251#16178864
 * @example extend(obj1, obj2, ....);
 * @return {object} The merged object.
 */
function extend() {
  var result = {}, 
      src, 
      prop, 
      args = getArgumentsArray(arguments),
      toString = Object.prototype.toString;
      
  while (args.length > 0) {
    src = args.shift();
    if (toString.call(src) === "[object Object]") {
      for (prop in src) {
        if (src.hasOwnProperty(prop)) {
          if (toString.call(src[prop]) == '[object Object]') {
            result[prop] = extend(result[prop] || {}, src[prop]);
          } else {
            result[prop] = src[prop];
          }
        }
      }
    }
  }
  return result;
}

/**
 *
 * Convert function arguments to an array.
 * The arguments object can be converted to a real Array by using:
 * var args = Array.prototype.slice.call(arguments);
 * But it prevents optimizations in JavaScript engines(V8 for example).
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
 * @param {object} arguments The Array-like object.
 * @return {array}
 */
function getArgumentsArray(arguments) {
  var result = [],
      len = arguments.length,
      i;
  for (i = 0; i < len; i++) {
    result.push(arguments[i]);
  }
  return result;
}

function namespace(str, value) {
  var arr = str.split("."), obj = window;
  for ( var i = 0, len = arr.length, len2 = len - 1; i < len; i++) {
    if (i === len2) {
      obj[arr[i]] = value;
    } else {
      obj[arr[i]] = obj[arr[i]] || {};
      obj = obj[arr[i]];
    }
  }
}
yuanjs.extend = extend;
yuanjs.namespace = namespace;
