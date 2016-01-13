(function (window, undefined) {
  /* jshint -W034 */
  "use strict";
  var yuanjs = {};


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
  
  // A String.trim() method for ECMAScript 3
  if(!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g,'');
    };
  }
  
  // From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
  // Running the following code before any other code will create Array.isArray() if it's not natively available.
  if(!Array.isArray) {
    Array.isArray = function (vArg) {
      return Object.prototype.toString.call(vArg) === "[object Array]";
    };
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
  
  function isNumber(param) {
    return !isNaN(param);
  }
  
  function isString(param) {
    return typeof param === "string";
  }
  
  function isFunction(param) {
    return Object.prototype.toString.call(x) === '[object Function]';
  }
  
  function isNull(param) {
    return param === null;
  }
  
  function isUndefined(param) {
    return typeof param === "undefined";
  }
  
  function isEmpty(param) {
    return /^\s*$/.test(param);
  }
  
  
  function replaceAll(str,mapObj) {
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
  }

  yuanjs.isNumber = isNumber;
  yuanjs.isString = isString;
  yuanjs.isFunction = isFunction;
  yuanjs.isNull = isNull;
  yuanjs.isUndefined = isUndefined;
  yuanjs.isEmpty = isEmpty;
  yuanjs.replaceAll = replaceAll;

    /**
     * Ajax request
     *
     */

    function ajax(options) {
        var dtd = Deferred();
        var xhr = new XMLHttpRequest();
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
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              callBack();
            }
          };
        }

        xhr.setRequestHeader("Content-Type", contentType);
        if (headers) {
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
            if(xhr.status === 200) {
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
                errorCallBack(xhr.status, xhr);
              }
                dtd.reject(xhr);
            }
        }
        return dtd.promise();
    }
    yuanjs.ajax = ajax;
    

  /**
   * DOM Manipulation
   *
   */
   
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
  yuanjs.id = id;
  yuanjs.tag = tag;
  yuanjs.cssClass = cssClass;


    // Events on and off
    var Events = [];

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
        for (var i = callbackArray.length - 1; i >= 0; i--) {
            callbackArray[i].apply(callbackArray[i], args);
        }
    }
    yuanjs.on = on;
    yuanjs.off = off;
    yuanjs.trigger = trigger;
    

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

	event.pageX = event.clientX + 
	  (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
	  (doc && doc.clientLeft || body && body.clientLeft || 0);
	event.pageY = event.clientY + 
	  (doc && doc.scrollTop || body && body.scrollTop || 0) - 
	  (doc && doc.clientTop || body && body.clientTop || 0);
      }
      
      // Handle  key presses
      event.which = event.charCode || event.keyCode;
      // Fix button for mouse clicks:
      // 0 == left; 1 == middle; 2 == right
      if ( event.button !== null) {
	event.button = (event.button & 1 ? 0 :
	    (event.button & 4 ? 1:
	     (event.button & 2 ? 2: 0)));
      }
    }
    return event;
  }


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

    yuanjs.addEvent = addEvent;
    yuanjs.removeEvent = removeEvent;
    yuanjs.triggerEvent = triggerEvent;
  })();


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
    name = name.replace(/-([a-z])/ig, 
	function(all, letter){ 
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
    //return element.style[name];
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
    var classRegExp = new RegExp("\\b" + className + "\\b");
    return classRegExp.test(originalClassName);
  }

  function width(element, newWidth) {
    if (newWidth) {
      element.style.width = newWidth;
    } else {
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


  if ( typeof module != 'undefined' && module.exports ) {
    module.exports = yuanjs;
  } else {
    window.yuanjs = yuanjs;
  }

})(window, undefined);