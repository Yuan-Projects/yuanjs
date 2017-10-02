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
