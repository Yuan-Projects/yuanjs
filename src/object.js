function extend(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
}
yuanjs.extend = extend;
