// @ts-nocheck

/**
 * Set Class: similar to ES2015 Set
 *
 * Browser Compatibility
 * Array.prototype.indexOf: IE 9+
 * Array.prototype.map: IE 9+
 * Array.prototype.forEach: IE 9+
 * Object.defineProperty: IE 9+
 * Array.isArray: IE 9+
 * Array.prototype.filter: IE 9+
 */

function YuanSet(iterable?: any) {
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  this.dataStore = Array.isArray(iterable) ? iterable.filter(onlyUnique) : [];
}

YuanSet.prototype.add = function (value) {
  if (this.dataStore.indexOf(value) === -1) {
    this.dataStore.push(value);
  }
  return this;
};

YuanSet.prototype.clear = function () {
  this.dataStore = [];
};

YuanSet.prototype.delete = function (value) {
  var index = this.dataStore.indexOf(value);
  if (index > -1) {
    this.dataStore.splice(index, 1);
    return true;
  }
  return false;
};

YuanSet.prototype.entries = function () {
  return this.dataStore.map(function (item) {
    return [item, item];
  });
};

YuanSet.prototype.forEach = function (callbackFn, thisArg) {
  var that = this;
  this.dataStore.forEach(function (item) {
    callbackFn.call(thisArg, item, item, that);
  });
};

YuanSet.prototype.has = function (value) {
  return this.dataStore.indexOf(value) > -1;
};

YuanSet.prototype.values = function () {
  return this.dataStore.slice();
};

YuanSet.prototype.keys = YuanSet.prototype.values;

YuanSet.prototype.size = function () {
  return this.dataStore.length;
};

YuanSet.isSuperset = function (set, subSet) {
  var subSetValues = subSet.values();
  for (var i = subSetValues.length - 1; i >= 0; i--) {
    if (!set.has(subSetValues[i])) {
      return false;
    }
  }
  return true;
};

YuanSet.union = function (setA, setB) {
  var _union = new YuanSet();
  var _func = function (item) {
    _union.add(item);
  };
  setA.forEach(_func);
  setB.forEach(_func);
  return _union;
};

YuanSet.intersection = function (setA, setB) {
  var _intersection = new YuanSet();
  setA.forEach(function (item) {
    if (setB.has(item)) {
      _intersection.add(item);
    }
  });
  return _intersection;
};

YuanSet.difference = function (setA, setB) {
  var _difference = new YuanSet();
  setA.forEach(function (item) {
    if (!setB.has(item)) {
      _difference.add(item);
    }
  });
  return _difference;
};

export default YuanSet;
