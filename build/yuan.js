(function (window, undefined) {
  /* jshint -W034 */
  "use strict";
  
  // Save the previous value of the `yuanjs` variable, so that it can be restored later on, if ｀noConflict｀ is used.
  var previousYuanJS = window.yuanjs;
  
  var yuanjs = {};
  yuanjs.version = "0.0.3";
  
  yuanjs.noConflict = function() {
    window.yuanjs = previousYuanJS;
    return this;
  };


  function log() {
    try {
      console.log.apply(console, arguments);
    } catch (e) {
      try {
	opera.postError.apply(opera, arguments);
      } catch(err) {
	alert(Array.prototype.join.call(arguments, " "));
      }
    }
  }
  yuanjs.log = log;

  /**
   * Setting and getting attribute values
   *
   */
  
  function attr(element, name, value) {
    var translations = {
      "for": "htmlFor",
      "class": "className",
      "readonly": "readOnly",
      "maxlength": "maxLength",
      "cellspacing": "cellSpacing",
      "rowspan": "rowSpan",
      "colspan": "colSpan",
      "tabindex": "tabIndex",
      "cellpadding": "cellPadding",
      "usemap": "useMap",
      "frameborder": "frameBorder",
      "contenteditable": "contentEditable"
    };
    var specialAttributes = ["id", "action"];
    var property = translations[name] || name,
        propertyExists = typeof element[property] !== "undefined";
        
    if (typeof value !== "undefined" && property != "type") {
      if (propertyExists) {
        element[property] = value;
      } else {
        element.setAttribute(name, value);
      }
    }

    if (property === "href") {
      return element.getAttribute("href", 2);
    }
    if (property === "style") {
      return typeof element.style.cssText === "string" ? element.style.cssText : element.getAttribute("style");
    }

    if (specialAttributes.indexOf(property) != -1) {
      return element.getAttributeNode(property).nodeValue; 
    }
    
    return propertyExists ? element[property] : element.getAttribute(name);
  }
  
  yuanjs.attr = attr;

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
          } else {
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
          }
        };
  
        return self;
      }
    };
  }
  
  yuanjs.Deferred = Deferred;
  
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
  /**
   * Helper functions
   *
   */

  function encodeFormatData(data) {
      if (!data) return ""; // Always return a string
      if(typeof data === "string") return data;
      var pairs = []; // To hold name=value pairs
      for(var name in data) { // For each name
          if (!data.hasOwnProperty(name)) continue; // Skip inherited
          if (typeof data[name] === "function") continue; // Skip methods
          if (Object.prototype.toString.call(data[name]) === "[object Array]") {
              for (var i = 0, len = data[name].length; i < len; i++) {
                  pairs.push(encodeURIComponent(name) + "[]=" + encodeURIComponent(data[name][i].toString()));
              }
              continue;
          }
          var value = data[name].toString(); // Value as string
          name = encodeURIComponent(name); // Encode name
          value = encodeURIComponent(value); // Encode value
          pairs.push(name + "=" + value); // Remember name=value pair
      }
      return pairs.join('&'); // Return joined pairs separated with &
  }

  /**
   * Polyfill
   *
   */

  // Emulate the XMLHttpRequest() constructor in IE5 and IE6
  if (window.XMLHttpRequest === undefined) {
      window.XMLHttpRequest = function() {
          try {
              // Use the latest version of the ActiveX object if available
              return new ActiveXObject("Msxml2.XMLHTTP.6.0");
          } catch (e1) {
              try {
                  // Otherwise fall back on an older version
                  return new ActiveXObject("Msxml2.XMLHTTP.3.0");
              } catch(e2) {
                  // Otherwise, throw an error
                  throw new Error("XMLHttpRequest is not supported");
              }
          }
      };
  }

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
      "use strict";
      if (this === null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
          n = 0;
        } else if (n !== 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }
  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  // Production steps of ECMA-262, Edition 5, 15.4.4.18
  // Reference: http://es5.github.com/#x15.4.4.18
  if (!Array.prototype.forEach) {

    Array.prototype.forEach = function forEach(callback, thisArg) {
      'use strict';
      var T, k;

      if (this === null) {
        throw new TypeError("this is null or not defined");
      }

      var kValue,
          // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
          O = Object(this),

          // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
          // 3. Let len be ToUint32(lenValue).
          len = O.length >>> 0; // Hack to convert O.length to a UInt32

      // 4. If IsCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if ({}.toString.call(callback) !== "[object Function]") {
        throw new TypeError(callback + " is not a function");
      }

      // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if (arguments.length >= 2) {
        T = thisArg;
      }

      // 6. Let k be 0
      k = 0;

      // 7. Repeat, while k < len
      while (k < len) {

        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        if (k in O) {

          // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
          kValue = O[k];

          // ii. Call the Call internal method of callback with T as the this value and
          // argument list containing kValue, k, and O.
          callback.call(T, kValue, k, O);
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined
    };
  }

  function trim(str) {
    if (String.prototype.trim) {
      return str.trim();
    } else {
      return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    }
  }

  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
  if (!Object.keys) {
    Object.keys = (function() {
      'use strict';
      var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
          dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
          ],
          dontEnumsLength = dontEnums.length;

      return function(obj) {
        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
          throw new TypeError('Object.keys called on non-object');
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
    }());
  }

  /**
   * Determine whether the argument is an array.
   * @param {Object} param Object to test whether or not it is an array
   * @returns {Boolean}
   */
  yuanjs.isArray =  Array.isArray || function(param) {
    return Object.prototype.toString.call(param) === "[object Array]";
  };

  function inArray(value, array, fromIndex) {
    return Array.prototype.indexOf.call(array, value, fromIndex);
  }

  yuanjs.inArray = inArray;


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
    return Object.prototype.toString.call(param) === '[object Function]';
  }

  function isNull(param) {
    return param === null;
  }

  function isNumeric(obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
  }

  function isUndefined(param) {
    return typeof param === "undefined";
  }

  function isEmpty(param) {
    return /^\s*$/.test(param);
  }

  // http://stackoverflow.com/a/15604206
  function replaceAll(str,mapObj) {
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
  }

  function urlArgs() {
    var args = {};                             // Start with an empty object
    var query = location.search.substring(1);  // Get query string, minus '?'
    var pairs = query.split("&");              // Split at ampersands
    for(var i = 0; i < pairs.length; i++) {    // For each fragment
        var pos = pairs[i].indexOf('=');       // Look for "name=value"
        if (pos == -1) continue;               // If not found, skip it
        var name = pairs[i].substring(0,pos);  // Extract the name
        var value = pairs[i].substring(pos+1); // Extract the value
        name = decodeURIComponent(name);       // Decode the name
        value = decodeURIComponent(value);     // Decode the value
        args[name] = value;                    // Store as a property
    }
    return args;                               // Return the parsed arguments
  }

  function isInteger(value) {
    if (Number.isInteger) {
      return Number.isInteger(value);
    }
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  }


  // A function for defining simple classes.
  function _createClass(Constructor, protoProps, staticProps) {
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
        if (!obj.hasOwnProperty(prop)) continue;
        arr.push({
          key: prop,
          value: obj[prop]
        });
      }
      return arr;
    }
    if (protoProps) {
      protoProps = objectToArray(protoProps);
      defineProperties(Constructor.prototype, protoProps);
    }
    if (staticProps) {
      staticProps = objectToArray(staticProps);
      defineProperties(Constructor, staticProps);
    }
    return Constructor;
  }

  yuanjs.createClass = _createClass;
  yuanjs.isEmptyObject = isEmptyObject;
  yuanjs.isNumber = isNumber;
  yuanjs.isNumeric = isNumeric;
  yuanjs.isInteger = isInteger;
  yuanjs.isString = isString;
  yuanjs.isFunction = isFunction;
  yuanjs.isNull = isNull;
  yuanjs.isUndefined = isUndefined;
  yuanjs.isEmpty = isEmpty;
  yuanjs.replaceAll = replaceAll;
  yuanjs.trim = trim;
  yuanjs.urlArgs = urlArgs;

  /**
   * Ajax request
   *
   */

  function ajax(options) {
    var dtd = Deferred();
    var xhr = getXHR(options.crossDomain);
    var url = options.url;
    var type = options.type ? options.type.toUpperCase() : "GET";
    var isAsyc = !!options.asyc || true;
    var successCallBack = options.success;
    var errorCallBack = options.error;
    var completeCallBack = options.complete;
    var data = options.data ? encodeFormatData(options.data) : "";
    var dataType = options.dataType || "text";
    var contentType = options.contentType || "application/x-www-form-urlencoded";
    var timeout = (options.timeout && !isNaN(options.timeout) && options.timeout > 0) ? options.timeout : 0;
    var timedout = false;
    var headers = Object.prototype.toString.call(options.headers) === "[object Object]" ? options.headers : null;

    if(timeout) {
      var timer = setTimeout(function() {
        timedout = true;
        xhr.abort();
        xhr.message = "Canceled";
        dtd.reject(xhr);
      },timeout);
    }

    if(type === "GET" && data !== "") {
      url += (url.indexOf("?") === -1 ? "?" : "&") + data;
    }
    xhr.open(type, url, isAsyc);
    if(isAsyc) {
      if ("onreadystatechange" in xhr) {
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            callBack();
          }
        };
      } else {
        xhr.onload = callBack;
        xhr.onerror = function(){
          if (errorCallBack) {
            errorCallBack(xhr);
          }
          dtd.reject(xhr);
        };
      }
    }

    if (xhr.setRequestHeader) {
      xhr.setRequestHeader("Content-Type", contentType);
    }
    if (headers && xhr.setRequestHeader) { // No custom headers may be added to the request in the XDomainRequest object
      for (var prop in headers) {
        if (headers.hasOwnProperty(prop)) {
          xhr.setRequestHeader(prop, headers[prop]);
        }
      }
    }

    switch(type) {
      case "POST":
        xhr.send(data);
        break;
      case "GET":
        xhr.send(null);
    }
    if(!isAsyc) {
      callBack();
    }
    
    function getXHR(crossDomain) {
      var xhr = new XMLHttpRequest();
      if (crossDomain && typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
      }
      return xhr;
    }

    function callBack() {
      if(timedout){
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
        var isSuccess = status >= 200 && status < 300 || status === 304;
        if(isSuccess) {
          var resultType = xhr.getResponseHeader("Content-Type");
          if(dataType === "xml" || (resultType && resultType.indexOf("xml") !== -1 && xhr.responseXML)){
            if (successCallBack) {
              successCallBack(resultXML, xhr);
            }
          } else if(dataType === "json" || resultType === "application/json") {
            if (successCallBack) {
              successCallBack(JSON.parse(resultText), xhr);
            }
          }else{
            if (successCallBack) {
              successCallBack(resultText, xhr);
            }
          }
          dtd.resolve(xhr);
        } else {
          if (errorCallBack) {
            errorCallBack(status, xhr);
          }
          dtd.reject(xhr);
        }        
      } else { // XDomainRequest
        if(dataType === "xml" || xhr.responseXML){
          if (successCallBack) {
            successCallBack(resultXML, xhr);
          }
        } else if(dataType === "json") {
          if (successCallBack) {
            successCallBack(JSON.parse(resultText), xhr);
          }
        }else{
          if (successCallBack) {
            successCallBack(resultText, xhr);
          }
        }
        dtd.resolve(xhr);
      }
    }
    return dtd.promise();
  }
  yuanjs.ajax = ajax;
    
  // Inspired by jQuery
  function loadScript(src, successCallback, errorCallback) {
    var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = src;
    script.async = true;
    script.charset = "UTF-8";
    
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function() {
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
    
    if("onerror" in script) {
      script.onerror = function(){
        errorCallback();
      };
    }
    // Circumvent IE6 bugs with base elements by prepending
	  // Use native DOM manipulation to avoid our domManip AJAX trickery
    head.insertBefore(script, head.firstChild);
  }
  
  yuanjs.loadScript = loadScript;
  /**
   * DOM Manipulation
   *
   */

  // https://stackoverflow.com/questions/814564/inserting-html-elements-with-javascript/814649#814649
  function createDOMFromString(string) {
    var frag = document.createDocumentFragment(),
        div = document.createElement('div');
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
    } else if (isDOMNode(content)) {
      newElement = content;
    }
    if (!newElement) return false;
    element.parentNode.insertBefore(newElement, element.nextSibling);
  }

  function append(element, content) {
    var newElement = null;
    if (typeof content === "string") {
      newElement = createDOMFromString(content);
    } else if (isDOMNode(content)) {
      newElement = content;
    }
    if (!newElement) return false;
    element.appendChild(newElement);
  }

  function before(element, content) {
    var newElement = null;
    if (typeof content === "string") {
      newElement = createDOMFromString(content);
    } else if (isDOMNode(content)) {
      newElement = content;
    }
    if (!newElement) return false;
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
    if (argLength === 0) throw Error('No id name provided.');
    var result = [];
    for (var i = 0; i < argLength; i++) {
      var thisArg = arguments[i];
      result.push(typeof thisArg === "string" ? document.getElementById(thisArg) : thisArg);
    }
    return argLength > 1 ? result : result[0];
  }

  function tag(tagName) {
    var newArr;
    if (!window.findByTagWorksAsExpected) {
      window.findByTagWorksAsExpected = (function(){
        var div = document.createElement("div");
        div.appendChild(document.createComment("test"));
        return div.getElementsByTagName("*").length === 0;
      })();
    }
    var allElements = document.getElementsByTagName(tagName);
    if (tagName === "*") {
      if (!window.findByTagWorksAsExpected) {
        newArr = [];
        for (var n = allElements.length - 1; n >= 0; n--) {
          if (allElements[n].nodeType == 1){
            newArr.push(allElements[n]);
          }
        }
      }
    }
    return newArr ? newArr : allElements;
  }

  function cssClass(classname, parentNode) {
    parentNode = parentNode || document;
    if(document.getElementsByClassName) return parentNode.getElementsByClassName(classname);
    var classnameArr = classname.replace(/^\s+|\s+$/g,"").split(/\s+/);
    if(document.querySelectorAll) {
      classname = "." + classnameArr.join(".");
      return parentNode.querySelectorAll(classname);
    }
    var allTags = parentNode.getElementsByTagName("*");
    var nodes = [];
    if(allTags.length) {
      tagLoop:
      for(var i = 0; i < allTags.length; i++) {
        var tmpTag = allTags[i];
        var tmpClass = tmpTag.className;
        if(!tmpClass) continue tagLoop;
        if (tmpClass === classname) {
          nodes.push(tmpTag);
          continue tagLoop;
        }
        matchLoop:
        for(var j = 0; j < classnameArr.length; j++) {
          var patt = new RegExp("\\b" + classnameArr[j] + "\\b");
          if(!patt.test(tmpClass)) {
            continue tagLoop;
          }
        }
        nodes.push(tmpTag);
      }
    }
    return nodes;
  }

  function empty(element) {
    element.innerHTML = '';
  }

  function filterNode(domList, filterCondition) {
    var filterFn = function() { return false; };
    if (typeof filterCondition === "string") {
      filterFn = function(element) {
        return matchesSelector(element, filterCondition);
      };
    } else if (typeof filterCondition === "function") {
      filterFn = filterCondition;
    }
    return Array.prototype.filter.call(domList, filterFn);
  }

  function findNode(parentNode, selector) {
    return parentNode.querySelectorAll(selector);
  }

  function matchesSelector(element, selector){
    if (element.matches) {
      return element.matches(selector);
    } else if (element.matchesSelector){
      return element.matchesSelector(selector);
    } else if (element.msMatchesSelector){
      return element.msMatchesSelector(selector);
    } else if (element.mozMatchesSelector){
      return element.mozMatchesSelector(selector);
    } else if (element.webkitMatchesSelector){
      return element.webkitMatchesSelector(selector);
    } else {
      throw new Error("Not supported.");
    }
  }

  function contains(parentNode, childNode) {
    if (parentNode.compareDocumentPosition) {
      return !!(parentNode.compareDocumentPosition(childNode) & 16);
    } else if (typeof parentNode.contains === "function") {
      return parentNode.contains(childNode);
    } else {
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

  function text(element, newText) {
    if (newText === undefined) {
      return (typeof element.textContent === "string") ? element.textContent : element.innerText;
    } else if (typeof newText === "string") {
      if (typeof element.textContent === "string") {
        element.textContent = newText;
      } else {
        element.innerText = newText;
      }
    }
  }

  yuanjs.after = after;
  yuanjs.append = append;
  yuanjs.before = before;
  yuanjs.children = children;
  yuanjs.clone = clone;
  yuanjs.empty = empty;
  yuanjs.filter = filterNode;
  yuanjs.find = findNode;
  yuanjs.html = html;
  yuanjs.id = id;
  yuanjs.tag = tag;
  yuanjs.cssClass = cssClass;
  yuanjs.matchesSelector = matchesSelector;
  yuanjs.contains = contains;
  yuanjs.text = text;

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
      return ;
    }
    if (callback) {
      var index = Events[event].indexOf(callback);
      if (index !== -1) {
        Events[event].splice(index, 1);
      }
    } else {
      Events[event] = [];
    }
  }

  function trigger (event) {
    if (!Events[event]) {
      return ;
    }
    var args = Array.prototype.slice.call(arguments, 1);
    var callbackArray = Events[event];
    for (var i = 0, len = callbackArray.length; i < len; i++) {
      callbackArray[i].apply(callbackArray[i], args);
    }
  }
  yuanjs.on = on;
  yuanjs.off = off;
  yuanjs.trigger = trigger;


  (function(){
    var cache = {},
        guidCounter = 1,
        expando = "data" + (new Date()).getTime();
    
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
      if (!guid) return;
      delete cache[guid];
      try {
        delete elem[expando];
      } catch (e) {
        if (elem.removeAttribute) {
          elem.removeAttribute(expando);
        }
      }
    }

    yuanjs.getData = getData;
    yuanjs.removeData = removeData;
  })();

  function fixEvent(event) {
    // Predefines often-used functions
    function returnTrue() { return true; }
    function returnFalse() { return false; }

    // Tests if fixing up is needed
    if (!event || !event.stopPropagation) {
      var old = event || window.event;

      // Clone the old object so that we can modify the values
      event = {};
      for(var prop in old) {
        event[prop] = old[prop];
      }

      // The event occurrecd on this element 
      if (!event.target) {
        event.target = event.srcElement || document;
      } 

      // Handle which other element the event is related to
      event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;

      // Stop the default browser action
      event.preventDefault = function() {
        event.returnValue = false;
        event.isDefaultPrevented = returnTrue;
      };

      event.isDefaultPrevented = returnFalse;

      // Stop the event from bubbling
      event.stopPropagation = function() {
        event.cancelBubble = true;
        event.isPropagationStopped = returnTrue;
      };

      event.isPropagationStopped = returnFalse;

      // Stop the event from bubbling and executing other handlers
      event.stopImmediatePropagation = function() {
        this.isImmediatePropagationStopped = returnTrue;
        this.stopPropagation();
      };

      event.isImmediatePropagationStopped = returnFalse;

      // Handle mouse position
      if (event.clientX !== null) {
        var doc = document.documentElement, body = document.body;

        event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
      }
      
      // Handle  key presses
      event.which = event.charCode || event.keyCode;
      // Fix button for mouse clicks:
      // 0 == left; 1 == middle; 2 == right
      if ( event.button !== null) {
        event.button = (event.button & 1 ? 0 : (event.button & 4 ? 1: (event.button & 2 ? 2: 0)));
      }
    }
    return event;
  }
  
  // DOM Events

  (function(){
    var nextGuid = 1;
    function addEvent(elem, type, fn) {
      var data = yuanjs.getData(elem);
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
        data.dispatcher = function(event) {
          if (data.disabled) return;
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
        if(document.addEventListener) {
          elem.addEventListener(type, data.dispatcher, false);
        } else if (document.attachEvent) {
          elem.attachEvent("on" + type, data.dispatcher);
        }
      }
    }

    function removeEvent(elem, type, fn) {
      var data = yuanjs.getData(elem);
      if (!data.handlers) return ;
      var removeType = function(t) {
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
      if (!handlers) return;
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
      var elemData = yuanjs.getData(elem),
          parent = elem.parentNode || elem.ownerDocument;

      if ( typeof event === "string") {
        event = { type: event, target: elem};
      }
      event = fixEvent(event);

      if (elemData.dispatcher) {
        elemData.dispatcher.call(elem, event);
      }

      if (parent && !event.isPropagationStopped()) {
        triggerEvent(parent, event);
      } else if (!parent && !event.isDefaultPrevented()) {
        var targetData = yuanjs.getData(event.target);
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

      var data = yuanjs.getData(elem);

      if (data.handlers[type].length === 0) {
        delete data.handlers[type];

        if (document.removeEventListener) {
          elem.removeEventListener(type, data.dispatcher, false);
        } else if (document.detachEvent) {
          elem.detachEvent("on" + type, data.dispatcher);
        }
      }

      if (isEmpty(data.handlers)) {
        delete data.handlers;
        delete data.dispatchers;
      }

      if (isEmpty(data)) {
        yuanjs.removeData(elem);
      }
    }
    
    // Document ready event.
    // http://stackoverflow.com/a/9899701
    (function(funcName, baseObj) {
      // The public function name defaults to window.docReady
      // but you can pass in your own object and own function name and those will be used
      // if you want to put them in a different namespace
      funcName = funcName || "docReady";
      baseObj = baseObj || window;
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

      function readyStateChange() {
        if ( document.readyState === "complete" ) {
          ready();
        }
      }

      // This is the one public interface
      // docReady(fn, context);
      // the context argument is optional - if present, it will be passed
      // as an argument to the callback
      baseObj[funcName] = function(callback, context) {
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
          setTimeout(function() {callback(context);}, 1);
          return;
        } else {
          // add the function and context to the list
          readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
          setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
          // otherwise if we don't have event handlers installed, install them
          if (document.addEventListener) {
            // first choice is DOMContentLoaded event
            document.addEventListener("DOMContentLoaded", ready, false);
            // backup is window load event
            window.addEventListener("load", ready, false);
          } else {
            // must be IE
            document.attachEvent("onreadystatechange", readyStateChange);
            window.attachEvent("onload", ready);
          }
          readyEventHandlersInstalled = true;
        }
      };
    })("documentReady", yuanjs);

    yuanjs.addEvent = addEvent;
    yuanjs.removeEvent = removeEvent;
    yuanjs.triggerEvent = triggerEvent;
  })();

  function addClass(element, className) {
    if (hasClass(element, className)) return false;
    var cssClass = element.className;
    if (element.classList) {
      element.classList.add(className);
    } else {
      element.className += ' ' + className;
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
    } else {
      if (element.style.cssText) {
        var regExp = /alpha\(.*opacity=(\d+).*\)/i;
        var matchResult = element.style.cssText.match(regExp);
        if (matchResult && matchResult[1]) {
          return parseFloat(matchResult[1] / 100);
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
      display: "block"
    };

    var previous = {};
    for ( var prop in properties){
      previous[prop] = element.style[prop];
      element.style[prop] = properties[prop];
    }
    var result = {
      width: element.offsetWidth,
      height: element.offsetHeight
    };
    for (prop in properties) {
      element.style[prop] = previous[prop];
    }
    return result;
  }

  function css(element, name, value) {
    var translations = {
      "float": ["cssFloat", "styleFloat"]
    };
    name = name.replace(/-([a-z])/ig, function(all, letter){
      return letter.toUpperCase();
    });

    if (translations[name]) {
      name = typeof element.style[translations[name][0]] !== "undefined" ?  translations[name][0] : translations[name][1];
    }

    if (typeof value !== "undefined") {
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
        property = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        return computedStyle.getPropertyValue(property);
      }
    } else if (element.currentStyle) {
      property = property.replace(/-([a-z])/ig, function(all, letter) { return letter.toUpperCase(); });
      return element.currentStyle[property];
    }
  }

  function hasClass(element, className) {
    var originalClassName = element.className;
    if (!originalClassName) {
      return false;
    }
    if (element.classList) {
      return element.classList.contains(className);
    } else {
      var classRegExp = new RegExp("\\b" + className + "\\b");
      return classRegExp.test(originalClassName);
    }
  }

  function getWindowSize() {
    var pageWidth = window.innerWidth,
        pageHeight = window.innerHeight;
    if (typeof pageWidth != "number") {
      pageWidth = document.documentElement.clientWidth;
      pageHeight = document.documentElement.clientHeight;
    }
    return {
      width: pageWidth,
      height: pageHeight
    };
  }

  function width(element, newWidth) {
    if (newWidth) {
      element.style.width = newWidth;
    } else {
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
      } else if (element.currentStyle) {
        var currentWidth = element.currentStyle.width;
        return currentWidth == "auto" ? element.offsetWidth : currentWidth;
      }
    }
  }

  function height(element, newHeight) {
    if (newHeight) {
      element.style.height = newHeight;
    } else {
      if (!isVisible(element)) {
        return getDimensions(element).height;
      }
      if (window.getComputedStyle) {
        var style = window.getComputedStyle(element);
        return style.getPropertyValue("height");
      } else if (element.currentStyle) {
        var currentHeight = element.currentStyle.height;
        return currentHeight == "auto" ? element.offsetHeight : currentHeight;
      }
    }
  }

  function position(element) {
    return {
      "left": element.offsetLeft,
      "top": element.offsetTop
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

    var top = box.top + scrollTop - clientTop ;
    var left = box.left + scrollLeft - clientLeft;

    return {
      "top": Math.round(top),
      "left": Math.round(left)
    };
  }

  /**
   * Get the current coordinates of the element, relative to the document.
   * Note: Works on IE7+
   */
  function getOffset(elem) {
    var current = elem.offsetParent,
        actualLeft = elem.offsetLeft,
        actualTop = elem.offsetTop;

    while ((current = current.offsetParent)) {
      actualLeft += current.offsetLeft;
      actualTop += current.offsetTop;
    }

    return {
      left: actualLeft,
      top: actualTop
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
   * Note: IE 9+
   * @param {Object} domElement : A native DOM element
   * @returns {mixed}
   */
  function getTranslateValue(domElement) {
    var cssMatrixObject = null;
    if (typeof WebKitCSSMatrix !== "undefined") {
      cssMatrixObject = WebKitCSSMatrix;
    } else if (typeof MSCSSMatrix !== "undefined") {
      cssMatrixObject = MSCSSMatrix;
    } else if (typeof DOMMatrix !== "undefined") {
      cssMatrixObject = DOMMatrix;
    }

    var style = window.getComputedStyle(domElement);

    var matrixString = '';
    if (typeof style.webkitTransform !== "undefined") {
      matrixString = style.webkitTransform;
    } else if (typeof style.mozTransform !== "undefined") {
      matrixString = style.mozTransform;
    } else if (typeof style.msTransform !== "undefined") {
      matrixString = style.msTransform;
    } else if (typeof style.transform !== "undefined") {
      matrixString = style.transform;
    }

    return new cssMatrixObject(matrixString);
  }

  function getTransitionEndEventName() {
    var i,
      el = document.createElement('div'),
      transitions = {
        'WebkitTransition':'webkitTransitionEnd',
        'transition':'transitionend',
        'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
        'MozTransition':'transitionend'
      };

    for (i in transitions) {
      if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
        return transitions[i];
      }
    }
    //TODO: throw 'TransitionEnd event is not supported in this browser';
    return '';
  }

  function has3dTransforms(){
    var el = document.createElement('p'),
        has3d,
        transforms = {
          'webkitTransform':'-webkit-transform',
          'OTransform':'-o-transform',
          'msTransform':'-ms-transform',
          'MozTransform':'-moz-transform',
          'transform':'transform'
        };

    // Add it to the body to get the computed style
    document.body.insertBefore(el, null);

    for(var t in transforms){
      if( el.style[t] !== undefined ){
        el.style[t] = 'translate3d(1px,1px,1px)';
        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
      }
    }

    document.body.removeChild(el);
    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
  }

  yuanjs.addClass = addClass;
  yuanjs.hasClass = hasClass;
  yuanjs.width = width;
  yuanjs.height = height;
  yuanjs.position = position;
  yuanjs.offset = offset;
  yuanjs.css = css;
  yuanjs.getTranslateXValue = getTranslateXValue;
  yuanjs.getTranslateYValue = getTranslateYValue;
  yuanjs.getTransitionEndEventName = getTransitionEndEventName;
  yuanjs.has3dTransforms = has3dTransforms;
  yuanjs.getOffset = getOffset;

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
 * @param {object} args The Array-like object.
 * @return {array}
 */
function getArgumentsArray(args) {
  var result = [],
      len = args.length,
      i;
  for (i = 0; i < len; i++) {
    result.push(args[i]);
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

  /**
   * Create synthetic DOM events.
   * @param {String} eventName The name of the event
   * @param {Object} [params] Event parameters, can have the following fields:
   *        1) "bubbles":  A Boolean indicating whether the event bubbles. The default is false.
   *        2) "cancelable": A Boolean indicating whether the event can be canceled. The default is false.
   *        3) "scoped": A Boolean indicating whether the given event bubbles.If this value is true, deepPath will only contain a target node.
   *        4) "composed": A Boolean indicating whether the event will trigger listeners outside of a shadow root. The default is false.
   *        5) "detail": optional and defaulting to null, of type any, that is an event-dependent value associated with the event.
   * NOTE: IE 8 and earlier require the `eventName` to be an event name that supported natively. Such as click, blur, focus...
   */
  function SyntheticEvent(eventName, params) {
    if (typeof eventName !== "string") {
      throw new Error("The eventName parameter should be a string");
    }
    params = {
      "bubbles": Boolean(params && params.bubbles),
      "cancelable": Boolean(params && params.cancelable),
      "composed": Boolean(params && params.composed),
      "scoped": Boolean(params && params.scoped),
      "detail": params ? params.detail : null
    };
    var event;    
    // Use the CustomEvent interface : https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
    try {
      event = new CustomEvent(eventName, params);
    } catch(e) { // The old-fashioned way
      try {
        // DOM Level 3 Events Custom event module
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);
      } catch(ex) {
        // DOM Level 3 Events Basic events module
        event = document.createEvent('Event');
        event.initEvent(eventName, params.bubbles, params.cancelable);
        event.detail = params.detail; // Attach the detail data to the event object
      } finally {
        if (!event) {
          // Internet Explorer 8 and earlier
          event = document.createEventObject();// create event object
          event.type = eventName;// Event type
          var detail = params.detail;
          if (detail) { // Suppose it's an object
            for (var prop in detail) { // initialize the event object
              if (detail.hasOwnProperty(prop)) {
                event[prop] = detail[prop];
              }
            }
          }
        }
      }
    } finally {
      if (event) {
        return event;
      } else {
        throw new Error('Your browser doest not support custom events.');
      }
    }
  }
  
  function dispatchSyntheticEvent(elem, event) {
    if (elem.dispatchEvent) {
      elem.dispatchEvent(event);
    } else if (elem.fireEvent) {
      elem.fireEvent("on" + event.type, event);
    }
  }

  yuanjs.CustomEvent = SyntheticEvent;
  yuanjs.dispatchCustomEvent = dispatchSyntheticEvent;

  if ( typeof module != 'undefined' && module.exports ) {
    module.exports = yuanjs;
  } else {
    window.yuanjs = yuanjs;
  }

})(window, undefined);