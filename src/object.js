function extend(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
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
