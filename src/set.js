/**
 * Set Class: similar to ES2015 Set
 *
 * Browser Compatibility
 * Array.prototype.indexOf: IE 9+
 * Array.prototype.map: IE 9+
 * Array.prototype.forEach: IE 9+
 * Object.defineProperty: IE 9+
 */

function YuanSet() {
  this.dataStore = [];
}

YuanSet.prototype.add = function(value) {
  if (this.dataStore.indexOf(value) === -1) {
    this.dataStore.push(value);
  }
  return this;
};

YuanSet.prototype.clear = function() {
  this.dataStore = [];
};

YuanSet.prototype.delete = function(value) {
  var index = this.dataStore.indexOf(value);
  if (index > -1) {
    this.dataStore.splice(index, 1);
    return true;
  }
  return false;
};

YuanSet.prototype.entries = function() {
  return this.dataStore.map(function(item) {
    return [item, item];
  });
};

YuanSet.prototype.forEach = function(callbackFn, thisArg) {
  this.dataStore.forEach(function(item) {
    // TODO: Check `this` value here.
    callbackFn.call(thisArg, item, item, this);
  });
};

YuanSet.prototype.has = function(value) {
  return this.dataStore.indexOf(value) > -1;
};

YuanSet.prototype.values = function() {
  return this.dataStore.slice();
};

YuanSet.prototype.keys = YuanSet.prototype.values;

YuanSet.prototype.size = function() {
  return this.dataStore.length;
};

yuanjs.Set = YuanSet;