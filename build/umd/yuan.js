(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.yuanjs = {}));
})(this, (function (exports) { 'use strict';

  // @ts-nocheck
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
                  }
                  else {
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
                  },
              };
              return self;
          },
      };
  }

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
  function YuanSet(iterable) {
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

  /**
   * Helper functions
   *
   */
  function encodeFormatData(data) {
      if (!data)
          return ""; // Always return a string
      if (typeof data === "string")
          return data;
      var pairs = []; // To hold name=value pairs
      for (var name in data) {
          // For each name
          if (!data.hasOwnProperty(name))
              continue; // Skip inherited
          if (typeof data[name] === "function")
              continue; // Skip methods
          if (Object.prototype.toString.call(data[name]) ===
              "[object Array]") {
              for (var i = 0, len = data[name].length; i < len; i++) {
                  pairs.push(encodeURIComponent(name) +
                      "[]=" +
                      encodeURIComponent(data[name][i].toString()));
              }
              continue;
          }
          var value = data[name].toString(); // Value as string
          name = encodeURIComponent(name); // Encode name
          value = encodeURIComponent(value); // Encode value
          pairs.push(name + "=" + value); // Remember name=value pair
      }
      return pairs.join("&"); // Return joined pairs separated with &
  }
  function trim(str) {
      if (String.prototype.trim) {
          return str.trim();
      }
      else {
          return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
      }
  }
  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
  if (!Object.keys) {
      Object.keys = (function () {
          var hasOwnProperty = Object.prototype.hasOwnProperty, hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString"), dontEnums = [
              "toString",
              "toLocaleString",
              "valueOf",
              "hasOwnProperty",
              "isPrototypeOf",
              "propertyIsEnumerable",
              "constructor",
          ], dontEnumsLength = dontEnums.length;
          return function (obj) {
              if (typeof obj !== "object" &&
                  (typeof obj !== "function" || obj === null)) {
                  throw new TypeError("Object.keys called on non-object");
              }
              var result = [], prop, i;
              for (prop in obj) {
                  if (hasOwnProperty.call(obj, prop)) {
                      result.push(prop);
                  }
              }
              if (hasDontEnumBug) {
                  for (i = 0; i < dontEnumsLength; i++) {
                      if (hasOwnProperty.call(obj, dontEnums[i])) {
                          result.push(dontEnums[i]);
                      }
                  }
              }
              return result;
          };
      })();
  }
  /**
   * Determine whether the argument is an array.
   * @param {Object} param Object to test whether or not it is an array
   * @returns {Boolean}
   */
  function isArray(param) {
      if (Array.isArray) {
          return Array.isArray(param);
      }
      return Object.prototype.toString.call(param) === "[object Array]";
  }
  /**
   * Search for a specified value within an array and return its index (or -1 if not found).
   *
   * @param {*} value - Element to locate
   * @param {Array} array - The array to search from
   * @return {number} Returns the first index at which a given element can be found in the array, or -1 not found.
   */
  function inArray(value, array, fromIndex) {
      return Array.prototype.indexOf.call(array, value, fromIndex);
  }
  /**
   * Check to see if an object is empty (contains no enumerable properties).
   *
   */
  function isEmptyObject(obj) {
      var name;
      for (name in obj) {
          return false;
      }
      return true;
  }
  function isNumber(param) {
      return !isNaN(param);
  }
  /**
   * Determine if the argument passed is a string.
   *
   * @param {Object} param Object to test whether or not it is a string.
   * @returns {Boolean}
   */
  function isString(param) {
      return typeof param === "string";
  }
  /**
   * Determine if the argument passed is a JavaScript function object.
   * Note: Functions provided by the browser like alert() and DOM element methods
   *       like getAttribute() are not guaranteed to be detected as functions in browsers such as Internet Explorer.
   *
   * @param {Object} param Object to test whether or not it is a function
   * @returns {Boolean}
   */
  function isFunction(param) {
      return Object.prototype.toString.call(param) === "[object Function]";
  }
  function isNumeric(obj) {
      return !isNaN(parseFloat(obj)) && isFinite(obj);
  }
  /**
   * Determine whether a variable has been declared.
   * @param {*} param - The variable to test
   * @returns {boolean} Return true if the variable hasn't been declared, otherwise false.
   */
  function isUndefined(param) {
      return typeof param === "undefined";
  }
  /**
   * Determine whether a string is either empty or filled with white spaces.
   * @param {string} param - The string to test
   * @return {boolean} Returns true if it is empty or filled with white spaces, otherwise false.
   */
  function isEmpty(param) {
      return /^\s*$/.test(param);
  }
  /**
   * Replace multiple strings with multiple other strings.
   * @param {string} str - The original string to modify
   * @param {Object} mapObj - Keys/value pairs to do the replacement.
   * @return {string} A new string
   */
  // http://stackoverflow.com/a/15604206
  function replaceAll(str, mapObj) {
      var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
      return str.replace(re, function (matched) {
          return mapObj[matched.toLowerCase()];
      });
  }
  /**
   * Returns query string parameters from a query string.
   *
   * @param {string} [queryString] - The query string, defaults to the document query string of current page.
   * @return {Object} Returns all key/value pairs in the query string.
   */
  function urlArgs(queryString) {
      queryString = queryString || location.search;
      var args = {}; // Start with an empty object
      var decodeParam = function (str) {
          return decodeURIComponent(str.replace(/\+/g, " "));
      };
      var query = queryString.substring(1); // Get query string, minus '?'
      var pairs = query.split("&"); // Split at ampersands
      for (var i = 0; i < pairs.length; i++) {
          // For each fragment
          var pos = pairs[i].indexOf("="); // Look for "name=value"
          if (pos == -1)
              continue; // If not found, skip it
          var name = pairs[i].substring(0, pos); // Extract the name
          var value = pairs[i].substring(pos + 1); // Extract the value
          name = decodeParam(name); // Decode the name
          value = decodeParam(value); // Decode the value
          args[name] = value; // Store as a property
      }
      return args; // Return the parsed arguments
  }
  /**
   * Check whether a value is an integer.
   * @param {*} value - The value to test.
   * @return {boolean} Returns true if the value is an integer, otherwise false.
   */
  function isInteger(value) {
      if (Number.isInteger) {
          return Number.isInteger(value);
      }
      return (typeof value === "number" && isFinite(value) && Math.floor(value) === value);
  }
  // A function for defining simple classes.
  function createClass(Constructor, protoProps, staticProps) {
      function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) {
                  descriptor.writable = true;
              }
              Object.defineProperty(target, descriptor.key, descriptor);
          }
      }
      function objectToArray(obj) {
          var arr = [];
          for (var prop in obj) {
              if (!obj.hasOwnProperty(prop))
                  continue;
              arr.push({
                  key: prop,
                  value: obj[prop],
              });
          }
          return arr;
      }
      if (protoProps) {
          var props = objectToArray(protoProps);
          defineProperties(Constructor.prototype, props);
      }
      if (staticProps) {
          var props = objectToArray(staticProps);
          defineProperties(Constructor, props);
      }
      return Constructor;
  }

  /**
   * Ajax request
   *
   */
  function ajax(options) {
      var dtd = Deferred();
      var xhr = getXHR();
      var url = options.url;
      var type = options.type ? options.type.toUpperCase() : "GET";
      var isAsyc = !!options.asyc || true;
      var successCallBack = options.success;
      var errorCallBack = options.error;
      var completeCallBack = options.complete;
      var data = options.data ? encodeFormatData(options.data) : "";
      var dataType = options.dataType || "text";
      var contentType = options.contentType || "application/x-www-form-urlencoded";
      var timeout = options.timeout && !isNaN(options.timeout) && options.timeout > 0
          ? options.timeout
          : 0;
      var timedout = false;
      var headers = Object.prototype.toString.call(options.headers) === "[object Object]"
          ? options.headers
          : null;
      if (timeout) {
          var timer = setTimeout(function () {
              timedout = true;
              xhr.abort();
              xhr.message = "Canceled";
              dtd.reject(xhr);
          }, timeout);
      }
      if (type === "GET" && data !== "") {
          url += (url.indexOf("?") === -1 ? "?" : "&") + data;
      }
      xhr.open(type, url, isAsyc);
      if (isAsyc) {
          if ("onreadystatechange" in xhr) {
              xhr.onreadystatechange = function () {
                  if (xhr.readyState === 4) {
                      callBack();
                  }
              };
          }
          else {
              xhr.onload = callBack;
              xhr.onerror = function () {
                  if (errorCallBack) {
                      errorCallBack("error", xhr);
                  }
                  dtd.reject(xhr);
              };
          }
      }
      if (xhr.setRequestHeader) {
          xhr.setRequestHeader("Content-Type", contentType);
      }
      if (headers && xhr.setRequestHeader) {
          // No custom headers may be added to the request in the XDomainRequest object
          for (var prop in headers) {
              if (headers.hasOwnProperty(prop)) {
                  // @ts-ignore
                  xhr.setRequestHeader(prop, headers[prop]);
              }
          }
      }
      switch (type) {
          case "POST":
              xhr.send(data);
              break;
          case "GET":
              xhr.send(null);
      }
      if (!isAsyc) {
          callBack();
      }
      function getXHR() {
          var xhr = new XMLHttpRequest();
          return xhr;
      }
      function callBack() {
          if (timedout) {
              return;
          }
          clearTimeout(timer);
          var resultText = xhr.responseText;
          var resultXML = xhr.responseXML;
          var textStatus = xhr.statusText;
          if (completeCallBack) {
              completeCallBack(xhr, textStatus);
          }
          // Determine if successful
          if ("status" in xhr) {
              var status = xhr.status;
              var isSuccess = (status >= 200 && status < 300) || status === 304;
              if (isSuccess) {
                  var resultType = xhr.getResponseHeader("Content-Type");
                  if (dataType === "xml" ||
                      (resultType && resultType.indexOf("xml") !== -1 && xhr.responseXML)) {
                      if (successCallBack) {
                          successCallBack(resultXML, xhr);
                      }
                  }
                  else if (dataType === "json" || resultType === "application/json") {
                      if (successCallBack) {
                          successCallBack(JSON.parse(resultText), xhr);
                      }
                  }
                  else {
                      if (successCallBack) {
                          successCallBack(resultText, xhr);
                      }
                  }
                  dtd.resolve(xhr);
              }
              else {
                  if (errorCallBack) {
                      errorCallBack(status, xhr);
                  }
                  dtd.reject(xhr);
              }
          }
          else {
              // XDomainRequest
              if (dataType === "xml" || xhr.responseXML) {
                  if (successCallBack) {
                      successCallBack(resultXML, xhr);
                  }
              }
              else if (dataType === "json") {
                  if (successCallBack) {
                      successCallBack(JSON.parse(resultText), xhr);
                  }
              }
              else {
                  if (successCallBack) {
                      successCallBack(resultText, xhr);
                  }
              }
              dtd.resolve(xhr);
          }
      }
      return dtd.promise();
  }
  // Inspired by jQuery
  function loadScript(src, successCallback, errorCallback) {
      var head = document.head ||
          document.getElementsByTagName("head")[0] ||
          document.documentElement;
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = src;
      script.async = true;
      script.charset = "UTF-8";
      // Attach handlers for all browsers
      script.onload = script.onreadystatechange = function () {
          var readyState = script.readyState;
          if (!readyState || /loaded|complete/.test(readyState)) {
              // Handle memory leak in IE
              script.onload = script.onreadystatechange = null;
              // Remove the script
              if (script.parentNode) {
                  script.parentNode.removeChild(script);
              }
              // Dereference the script
              script = null;
              // Callback
              successCallback();
          }
      };
      if ("onerror" in script) {
          script.onerror = function () {
              errorCallback();
          };
      }
      // Circumvent IE6 bugs with base elements by prepending
      // Use native DOM manipulation to avoid our domManip AJAX trickery
      head.insertBefore(script, head.firstChild);
  }

  function addClass(element, className) {
      if (hasClass(element, className))
          return false;
      if (element.classList) {
          element.classList.add(className);
      }
      else {
          element.className += " " + className;
      }
  }
  function isVisible(element) {
      return !(element.offsetHeight === 0 && element.offsetWidth === 0);
  }
  function isOpacitySupported() {
      var div = document.createElement("div");
      div.setAttribute("style", "opacity:.5");
      return div.style.opacity === "0.5";
  }
  function getOpacity(element) {
      var defaultValue = 1.0;
      if (isOpacitySupported()) {
          return parseFloat(element.style.opacity) || defaultValue;
      }
      else {
          if (element.style.cssText) {
              var regExp = /alpha\(.*opacity=(\d+).*\)/i;
              var matchResult = element.style.cssText.match(regExp);
              if (matchResult && matchResult[1]) {
                  return parseFloat(matchResult[1]) / 100;
              }
          }
      }
      return defaultValue;
  }
  /**
   * Get the top and height value for hidden elements.
   */
  function getDimensions(element) {
      var properties = {
          position: "absolute",
          visibility: "hidden",
          display: "block",
      };
      var previous = {};
      for (var prop in properties) {
          if (properties.hasOwnProperty(prop)) {
              previous[prop] = element.style[prop];
              element.style[prop] =
                  properties[prop];
          }
      }
      var result = {
          width: element.offsetWidth,
          height: element.offsetHeight,
      };
      for (prop in properties) {
          if (properties.hasOwnProperty(prop)) {
              element.style[prop] =
                  previous[prop];
          }
      }
      return result;
  }
  function css(element, name, value) {
      var translations = {
          float: ["cssFloat", "styleFloat"],
      };
      name = name.replace(/-([a-z])/gi, function (all, letter) {
          return letter.toUpperCase();
      });
      if (translations.hasOwnProperty(name)) {
          var val = translations[name];
          var v1 = val[0];
          var cssStyle = element.style;
          name =
              typeof cssStyle[v1] !== "undefined"
                  ? val[0]
                  : val[1];
      }
      if (typeof value !== "undefined") {
          // @ts-ignore
          element.style[name] = value;
      }
      if (name === "opacity") {
          return getOpacity(element);
      }
      return fetchComputedStyle(element, name);
  }
  function fetchComputedStyle(element, property) {
      if (window.getComputedStyle) {
          var computedStyle = window.getComputedStyle(element);
          if (computedStyle) {
              property = property.replace(/([A-Z])/g, "-$1").toLowerCase();
              return computedStyle.getPropertyValue(property);
          }
      }
  }
  function hasClass(element, className) {
      var originalClassName = element.className;
      if (!originalClassName) {
          return false;
      }
      if (element.classList) {
          return element.classList.contains(className);
      }
      else {
          var classRegExp = new RegExp("\\b" + className + "\\b");
          return classRegExp.test(originalClassName);
      }
  }
  function getWindowSize() {
      var pageWidth = window.innerWidth, pageHeight = window.innerHeight;
      if (typeof pageWidth != "number") {
          pageWidth = document.documentElement.clientWidth;
          pageHeight = document.documentElement.clientHeight;
      }
      return {
          width: pageWidth,
          height: pageHeight,
      };
  }
  function width(element, newWidth) {
      if (newWidth && "style" in element) {
          element.style.width = newWidth;
      }
      else {
          if (element === window) {
              var windowSize = getWindowSize();
              return windowSize.width;
          }
          if (!isVisible(element)) {
              return getDimensions(element).width;
          }
          if (window.getComputedStyle) {
              var style = window.getComputedStyle(element);
              return style.getPropertyValue("width");
          }
      }
  }
  function height(element, newHeight) {
      if (newHeight) {
          element.style.height = newHeight;
      }
      else {
          if (!isVisible(element)) {
              return getDimensions(element).height;
          }
          if (window.getComputedStyle) {
              var style = window.getComputedStyle(element);
              return style.getPropertyValue("height");
          }
      }
  }
  function position(element) {
      return {
          left: element.offsetLeft,
          top: element.offsetTop,
      };
  }
  function offset(element) {
      var box = element.getBoundingClientRect();
      var body = document.body;
      var docEl = document.documentElement;
      var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
      var clientTop = docEl.clientTop || body.clientTop || 0;
      var clientLeft = docEl.clientLeft || body.clientLeft || 0;
      var top = box.top + scrollTop - clientTop;
      var left = box.left + scrollLeft - clientLeft;
      return {
          top: Math.round(top),
          left: Math.round(left),
      };
  }
  /**
   * Get the current coordinates of the element, relative to the document.
   * Note: Works on IE7+
   */
  function getOffset(elem) {
      var current = elem.offsetParent, actualLeft = elem.offsetLeft, actualTop = elem.offsetTop;
      while (current.offsetParent) {
          current = current.offsetParent;
          actualLeft += current.offsetLeft;
          actualTop += current.offsetTop;
      }
      return {
          left: actualLeft,
          top: actualTop,
      };
  }
  function getTranslateXValue(domElement) {
      var val = getTranslateValue(domElement);
      return val.m41;
  }
  function getTranslateYValue(domElement) {
      var val = getTranslateValue(domElement);
      return val.m42;
  }
  /**
   * Return the CSS3 translate value of a DOM element.
   * @param {Object} domElement : A native DOM element
   * @returns {mixed}
   */
  function getTranslateValue(domElement) {
      var cssMatrixObject = null;
      if (typeof WebKitCSSMatrix !== "undefined") {
          cssMatrixObject = WebKitCSSMatrix;
      }
      else if (typeof MSCSSMatrix !== "undefined") {
          cssMatrixObject = MSCSSMatrix;
      }
      else if (typeof DOMMatrix !== "undefined") {
          cssMatrixObject = DOMMatrix;
      }
      var style = window.getComputedStyle(domElement);
      var matrixString = "";
      if (typeof style.webkitTransform !== "undefined") {
          matrixString = style.webkitTransform;
          //} else if (typeof style.mozTransform !== "undefined") {
      }
      else if ("mozTransform" in style) {
          matrixString = style.mozTransform;
      }
      else if ("msTransform" in style) {
          matrixString = style.msTransform;
      }
      else if (typeof style.transform !== "undefined") {
          matrixString = style.transform;
      }
      return new cssMatrixObject(matrixString);
  }
  function getTransitionEndEventName() {
      var i, el = document.createElement("div"), transitions = {
          WebkitTransition: "webkitTransitionEnd",
          transition: "transitionend",
          OTransition: "otransitionend",
          MozTransition: "transitionend",
      };
      for (i in transitions) {
          if (transitions.hasOwnProperty(i) &&
              el.style[i] !== undefined) {
              return transitions[i];
          }
      }
      //TODO: throw 'TransitionEnd event is not supported in this browser';
      return "";
  }
  function has3dTransforms() {
      var el = document.createElement("p"), has3d, transforms = {
          webkitTransform: "-webkit-transform",
          OTransform: "-o-transform",
          msTransform: "-ms-transform",
          MozTransform: "-moz-transform",
          transform: "transform",
      };
      // Add it to the body to get the computed style
      document.body.insertBefore(el, null);
      for (var t in transforms) {
          if (transforms.hasOwnProperty(t) &&
              el.style[t] !== undefined) {
              // @ts-ignore
              el.style[t] = "translate3d(1px,1px,1px)";
              // @ts-ignore
              has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
          }
      }
      document.body.removeChild(el);
      return has3d !== undefined && has3d.length > 0 && has3d !== "none";
  }
  function removeClass(element, className) {
      if (!element || !element.className)
          return false;
      if (element.classList) {
          element.classList.remove(className);
      }
      else {
          var newClassName = element.className
              .split(/\s+/g)
              .filter(function (cls) {
              return cls !== className;
          })
              .join(" ");
          if (newClassName !== element.className) {
              element.className = newClassName;
          }
      }
  }
  function toggleClass(element, className) {
      if (hasClass(element, className)) {
          removeClass(element, className);
      }
      else {
          addClass(element, className);
      }
  }

  /**
   * DOM Manipulation
   *
   */
  // https://stackoverflow.com/questions/814564/inserting-html-elements-with-javascript/814649#814649
  function createDOMFromString(string) {
      var frag = document.createDocumentFragment(), div = document.createElement("div");
      div.innerHTML = string;
      while (div.firstChild) {
          frag.appendChild(div.firstChild);
      }
      return frag;
  }
  function isDOMNode(node) {
      return node && node.nodeType;
  }
  function after(element, content) {
      // insertAdjacentHTML method is useful but has many problems, so we don't use it here.
      // See https://github.com/jquery/jquery/pull/1200
      var newElement = null;
      if (typeof content === "string") {
          newElement = createDOMFromString(content);
      }
      else if (isDOMNode(content)) {
          newElement = content;
      }
      if (!newElement)
          return;
      element.parentNode.insertBefore(newElement, element.nextSibling);
  }
  function append(element, content) {
      var newElement = null;
      if (typeof content === "string") {
          newElement = createDOMFromString(content);
      }
      else if (isDOMNode(content)) {
          newElement = content;
      }
      if (!newElement)
          return;
      element.appendChild(newElement);
  }
  function before(element, content) {
      var newElement = null;
      if (typeof content === "string") {
          newElement = createDOMFromString(content);
      }
      else if (isDOMNode(content)) {
          newElement = content;
      }
      if (!newElement)
          return;
      element.parentNode.insertBefore(newElement, element);
  }
  function children(element) {
      // Note: Internet Explorer 6, 7 and 8 supported it, but erroneously includes Comment nodes.
      return element.children;
  }
  function clone(element) {
      return element.cloneNode(true);
  }
  function html(element, domString) {
      if (domString) {
          element.innerHTML = domString;
      }
      return element.innerHTML;
  }
  function id() {
      var argLength = arguments.length;
      if (argLength === 0)
          throw Error("No id name provided.");
      var result = [];
      for (var i = 0; i < argLength; i++) {
          var thisArg = arguments[i];
          result.push(typeof thisArg === "string" ? document.getElementById(thisArg) : thisArg);
      }
      return argLength > 1 ? result : result[0];
  }
  function tag(tagName) {
      var newArr;
      var allElements = document.getElementsByTagName(tagName);
      if (tagName === "*") {
          newArr = [];
          for (var n = allElements.length - 1; n >= 0; n--) {
              if (allElements[n].nodeType == 1) {
                  newArr.push(allElements[n]);
              }
          }
      }
      return newArr ? newArr : allElements;
  }
  function cssClass(classname, parentNode) {
      parentNode = parentNode || document;
      if (document.getElementsByClassName)
          return parentNode.getElementsByClassName(classname);
      var classnameArr = classname.replace(/^\s+|\s+$/g, "").split(/\s+/);
      if (document.querySelectorAll) {
          classname = "." + classnameArr.join(".");
          return parentNode.querySelectorAll(classname);
      }
      var allTags = parentNode.getElementsByTagName("*");
      var nodes = [];
      if (allTags.length) {
          tagLoop: for (var i = 0; i < allTags.length; i++) {
              var tmpTag = allTags[i];
              var tmpClass = tmpTag.className;
              if (!tmpClass)
                  continue tagLoop;
              if (tmpClass === classname) {
                  nodes.push(tmpTag);
                  continue tagLoop;
              }
              for (var j = 0; j < classnameArr.length; j++) {
                  var patt = new RegExp("\\b" + classnameArr[j] + "\\b");
                  if (!patt.test(tmpClass)) {
                      continue tagLoop;
                  }
              }
              nodes.push(tmpTag);
          }
      }
      return nodes;
  }
  function empty(element) {
      element.innerHTML = "";
  }
  function filterNode(domList, filterCondition) {
      var filterFn = function () {
          return false;
      };
      if (typeof filterCondition === "string") {
          filterFn = function (element) {
              return matchesSelector(element, filterCondition);
          };
      }
      else if (typeof filterCondition === "function") {
          filterFn = filterCondition;
      }
      return Array.prototype.filter.call(domList, filterFn);
  }
  function findNode(parentNode, selector) {
      return parentNode.querySelectorAll(selector);
  }
  function matchesSelector(element, selector) {
      if (element.matches) {
          return element.matches(selector);
      }
      else if (element.matchesSelector) {
          return element.matchesSelector(selector);
      }
      else if (element.msMatchesSelector) {
          return element.msMatchesSelector(selector);
      }
      else if (element.mozMatchesSelector) {
          return element.mozMatchesSelector(selector);
      }
      else if (element.webkitMatchesSelector) {
          return element.webkitMatchesSelector(selector);
      }
      else {
          throw new Error("Not supported.");
      }
  }
  function contains(parentNode, childNode) {
      if (parentNode.compareDocumentPosition) {
          return !!(parentNode.compareDocumentPosition(childNode) & 16);
      }
      else if (typeof parentNode.contains === "function") {
          return parentNode.contains(childNode);
      }
      else {
          if (childNode) {
              while ((childNode = childNode.parentNode)) {
                  if (childNode === parentNode) {
                      return true;
                  }
              }
          }
          return false;
      }
  }
  function offsetParent(element) {
      var parent = element.offsetParent;
      while (parent && css(parent, "position") === "static") {
          parent = parent.offsetParent;
      }
      return parent || document.body;
  }
  function parent(element) {
      var parentNode = element.parentNode;
      return parentNode && parentNode.nodeType !== 11 ? parentNode : null;
  }
  function prepend(parentNode, content) {
      var newElement = null;
      if (typeof content === "string") {
          newElement = createDOMFromString(content);
      }
      else if (isDOMNode(content)) {
          newElement = content;
      }
      if (!newElement)
          return;
      parentNode.insertBefore(newElement, parentNode.firstChild);
  }
  function remove(element) {
      if (element.parentNode) {
          element.parentNode.removeChild(element);
      }
  }
  function siblings(element) {
      var arr = [];
      var parent = element.parentNode;
      var node = parent.firstChild;
      while (node) {
          if (node.nodeType === 1 && node !== element) {
              arr.push(node);
          }
          node = node.nextSibling;
      }
      return arr;
  }
  function text(element, newText) {
      if (newText === undefined) {
          return typeof element.textContent === "string"
              ? element.textContent
              : element.innerText;
      }
      else if (typeof newText === "string") {
          if (typeof element.textContent === "string") {
              element.textContent = newText;
          }
          else {
              element.innerText = newText;
          }
      }
  }
  var filter = filterNode;
  var find = findNode;

  // Events on and off
  var Events = {};
  function on(event, callback) {
      if (!Events[event]) {
          Events[event] = [];
      }
      Events[event].push(callback);
      return callback;
  }
  function off(event, callback) {
      if (!Events[event]) {
          return;
      }
      if (callback) {
          var index = Events[event].indexOf(callback);
          if (index !== -1) {
              Events[event].splice(index, 1);
          }
      }
      else {
          Events[event] = [];
      }
  }
  function trigger(event) {
      if (!Events[event]) {
          return;
      }
      var args = Array.prototype.slice.call(arguments, 1);
      var callbackArray = Events[event];
      for (var i = 0, len = callbackArray.length; i < len; i++) {
          callbackArray[i].apply(callbackArray[i], args);
      }
  }

  function bind(func, context) {
      var slice = Array.prototype.slice;
      var args = slice.call(arguments, 2);
      return function () {
          var innerArgs = slice.call(arguments);
          return func.apply(context, args.concat(innerArgs));
      };
  }

  var cache = {}, guidCounter = 1, expando = "data" + new Date().getTime();
  function getData(elem) {
      var guid = elem[expando];
      if (!guid) {
          guid = elem[expando] = guidCounter++;
          cache[guid] = {};
      }
      return cache[guid];
  }
  function removeData(elem) {
      var guid = elem[expando];
      if (!guid)
          return;
      delete cache[guid];
      try {
          delete elem[expando];
      }
      catch (e) {
          if (elem.removeAttribute) {
              elem.removeAttribute(expando);
          }
      }
  }

  function fixEvent(event) {
      // Predefines often-used functions
      function returnTrue() {
          return true;
      }
      function returnFalse() {
          return false;
      }
      // Tests if fixing up is needed
      if (!event || !event.stopPropagation) {
          var old = event || window.event;
          // Clone the old object so that we can modify the values
          event = {};
          for (var prop in old) {
              event[prop] = old[prop];
          }
          // The event occurrecd on this element
          if (!event.target) {
              event.target = event.srcElement || document;
          }
          // Handle which other element the event is related to
          event.relatedTarget =
              event.fromElement === event.target ? event.toElement : event.fromElement;
          // Stop the default browser action
          event.preventDefault = function () {
              event.returnValue = false;
              event.isDefaultPrevented = returnTrue;
          };
          event.isDefaultPrevented = returnFalse;
          // Stop the event from bubbling
          event.stopPropagation = function () {
              event.cancelBubble = true;
              event.isPropagationStopped = returnTrue;
          };
          event.isPropagationStopped = returnFalse;
          // Stop the event from bubbling and executing other handlers
          event.stopImmediatePropagation = function () {
              this.isImmediatePropagationStopped = returnTrue;
              this.stopPropagation();
          };
          event.isImmediatePropagationStopped = returnFalse;
          // Handle mouse position
          if (event.clientX !== null) {
              var doc = document.documentElement, body = document.body;
              event.pageX =
                  event.clientX +
                      ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
                      ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
              event.pageY =
                  event.clientY +
                      ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
                      ((doc && doc.clientTop) || (body && body.clientTop) || 0);
          }
          // Handle  key presses
          event.which = event.charCode || event.keyCode;
          // Fix button for mouse clicks:
          // 0 == left; 1 == middle; 2 == right
          if (event.button !== null) {
              event.button =
                  event.button & 1 ? 0 : event.button & 4 ? 1 : event.button & 2 ? 2 : 0;
          }
      }
      return event;
  }
  // DOM Events
  var nextGuid = 1;
  function addEvent(elem, type, fn) {
      var data = getData(elem);
      if (!data.handlers) {
          data.handlers = {};
      }
      if (!data.handlers[type]) {
          data.handlers[type] = [];
      }
      if (!fn.guid) {
          fn.guid = nextGuid++;
      }
      data.handlers[type].push(fn);
      if (!data.dispatcher) {
          data.disabled = false;
          data.dispatcher = function (event) {
              if (data.disabled)
                  return;
              event = fixEvent(event);
              var handlers = data.handlers[event.type];
              if (handlers) {
                  for (var n = 0; n < handlers.length; n++) {
                      handlers[n].call(elem, event);
                  }
              }
          };
      }
      if (data.handlers[type].length == 1) {
          if (document.addEventListener) {
              elem.addEventListener(type, data.dispatcher, false);
          }
      }
  }
  function removeEvent(elem, type, fn) {
      var data = getData(elem);
      if (!data.handlers)
          return;
      var removeType = function (t) {
          data.handlers[t] = [];
          tidyUp(elem, t);
      };
      if (!type) {
          for (var t in data.handlers) {
              removeType(t);
          }
          return;
      }
      var handlers = data.handlers[type];
      if (!handlers)
          return;
      if (!fn) {
          removeType(type);
          return;
      }
      if (fn.guid) {
          for (var n = 0; n < handlers.length; n++) {
              if (handlers[n].guid == fn.guid) {
                  handlers.splice(n--, 1);
              }
          }
      }
      tidyUp(elem, type);
  }
  function triggerEvent(elem, event) {
      var elemData = getData(elem), parent = (elem.parentNode || elem.ownerDocument);
      if (typeof event === "string") {
          event = { type: event, target: elem };
      }
      event = fixEvent(event);
      if (elemData.dispatcher) {
          elemData.dispatcher.call(elem, event);
      }
      if (parent && !event.isPropagationStopped()) {
          triggerEvent(parent, event);
      }
      else if (!parent && !event.isDefaultPrevented()) {
          var targetData = getData(event.target);
          if (event.target[event.type]) {
              targetData.disabled = true;
              event.target[event.type]();
              targetData.disabled = false;
          }
      }
  }
  function tidyUp(elem, type) {
      function isEmpty(obj) {
          for (var prop in obj) {
              return false;
          }
          return true;
      }
      var data = getData(elem);
      if (data.handlers[type].length === 0) {
          delete data.handlers[type];
          if (document.removeEventListener) {
              elem.removeEventListener(type, data.dispatcher, false);
          }
      }
      if (isEmpty(data.handlers)) {
          delete data.handlers;
          delete data.dispatchers;
      }
      if (isEmpty(data)) {
          removeData(elem);
      }
  }
  // Document ready event.
  // http://stackoverflow.com/a/9899701
  var documentReady = (function () {
      // The public function name defaults to window.docReady
      // but you can pass in your own object and own function name and those will be used
      // if you want to put them in a different namespace
      //funcName = funcName || "docReady";
      //baseObj = baseObj || window;
      var readyList = [];
      var readyFired = false;
      var readyEventHandlersInstalled = false;
      // call this when the document is ready
      // this function protects itself against being called more than once
      function ready() {
          if (!readyFired) {
              // this must be set to true before we start calling callbacks
              readyFired = true;
              for (var i = 0; i < readyList.length; i++) {
                  // if a callback here happens to add new ready handlers,
                  // the docReady() function will see that it already fired
                  // and will schedule the callback to run right after
                  // this event loop finishes so all handlers will still execute
                  // in order and no new ones will be added to the readyList
                  // while we are processing the list
                  readyList[i].fn.call(window, readyList[i].ctx);
              }
              // allow any closures held by these functions to free
              readyList = [];
          }
      }
      // This is the one public interface
      // docReady(fn, context);
      // the context argument is optional - if present, it will be passed
      // as an argument to the callback
      return function (callback, context) {
          // if ready has already fired, then just schedule the callback
          // to fire asynchronously, but right away
          if (readyFired) {
              setTimeout(function () {
                  callback(context);
              }, 1);
              return;
          }
          else {
              // add the function and context to the list
              readyList.push({ fn: callback, ctx: context });
          }
          // if document already ready to go, schedule the ready function to run
          if (document.readyState === "complete") {
              setTimeout(ready, 1);
          }
          else if (!readyEventHandlersInstalled) {
              // otherwise if we don't have event handlers installed, install them
              if (document.addEventListener) {
                  // first choice is DOMContentLoaded event
                  document.addEventListener("DOMContentLoaded", ready, false);
                  // backup is window load event
                  window.addEventListener("load", ready, false);
              }
              readyEventHandlersInstalled = true;
          }
      };
  })();

  var version = "0.1.0";

  exports.Deferred = Deferred;
  exports.Set = YuanSet;
  exports.addClass = addClass;
  exports.addEvent = addEvent;
  exports.after = after;
  exports.ajax = ajax;
  exports.append = append;
  exports.before = before;
  exports.bind = bind;
  exports.children = children;
  exports.clone = clone;
  exports.contains = contains;
  exports.createClass = createClass;
  exports.css = css;
  exports.cssClass = cssClass;
  exports.documentReady = documentReady;
  exports.empty = empty;
  exports.encodeFormatData = encodeFormatData;
  exports.filter = filter;
  exports.find = find;
  exports.getOffset = getOffset;
  exports.getTransitionEndEventName = getTransitionEndEventName;
  exports.getTranslateXValue = getTranslateXValue;
  exports.getTranslateYValue = getTranslateYValue;
  exports.has3dTransforms = has3dTransforms;
  exports.hasClass = hasClass;
  exports.height = height;
  exports.html = html;
  exports.id = id;
  exports.inArray = inArray;
  exports.isArray = isArray;
  exports.isEmpty = isEmpty;
  exports.isEmptyObject = isEmptyObject;
  exports.isFunction = isFunction;
  exports.isInteger = isInteger;
  exports.isNumber = isNumber;
  exports.isNumeric = isNumeric;
  exports.isString = isString;
  exports.isUndefined = isUndefined;
  exports.loadScript = loadScript;
  exports.matchesSelector = matchesSelector;
  exports.off = off;
  exports.offset = offset;
  exports.offsetParent = offsetParent;
  exports.on = on;
  exports.parent = parent;
  exports.position = position;
  exports.prepend = prepend;
  exports.remove = remove;
  exports.removeClass = removeClass;
  exports.removeEvent = removeEvent;
  exports.replaceAll = replaceAll;
  exports.siblings = siblings;
  exports.tag = tag;
  exports.text = text;
  exports.toggleClass = toggleClass;
  exports.trigger = trigger;
  exports.triggerEvent = triggerEvent;
  exports.trim = trim;
  exports.urlArgs = urlArgs;
  exports.version = version;
  exports.width = width;

}));
