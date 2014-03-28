function extend(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
}
function namespace(str) {
  var arr = str.split("."), obj = window;
  for ( var i = 0; i < arr.length; i++) {
    obj[arr[i]] = obj[arr[i]] || {};
    obj = obj[arr[i]];
  }
}
yuanjs.extend = extend;
yuanjs.namespace = namespace;
