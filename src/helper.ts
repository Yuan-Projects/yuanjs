/**
 * Helper functions
 *
 */

function encodeFormatData(data: string | object) {
  if (!data) return ""; // Always return a string
  if (typeof data === "string") return data;
  var pairs: any = []; // To hold name=value pairs
  for (var name in data) {
    // For each name
    if (!data.hasOwnProperty(name)) continue; // Skip inherited
    if (typeof data[name as keyof typeof data] === "function") continue; // Skip methods
    if (
      Object.prototype.toString.call(data[name as keyof typeof data]) ===
      "[object Array]"
    ) {
      for (
        var i = 0, len = (data[name as keyof typeof data] as Array<any>).length;
        i < len;
        i++
      ) {
        pairs.push(
          encodeURIComponent(name) +
            "[]=" +
            encodeURIComponent(
              (data[name as keyof typeof data][i] as any).toString()
            )
        );
      }
      continue;
    }
    var value = (data[name as keyof typeof data] as any).toString(); // Value as string
    name = encodeURIComponent(name); // Encode name
    value = encodeURIComponent(value); // Encode value
    pairs.push(name + "=" + value); // Remember name=value pair
  }
  return pairs.join("&"); // Return joined pairs separated with &
}

function trim(str: string) {
  if (String.prototype.trim) {
    return str.trim();
  } else {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  }
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    "use strict";
    var hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString"),
      dontEnums = [
        "toString",
        "toLocaleString",
        "valueOf",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "constructor",
      ],
      dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (
        typeof obj !== "object" &&
        (typeof obj !== "function" || obj === null)
      ) {
        throw new TypeError("Object.keys called on non-object");
      }

      var result = [],
        prop,
        i;

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
function isArray(param: any) {
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
function inArray(value: any, array: any[], fromIndex: number) {
  return Array.prototype.indexOf.call(array, value, fromIndex);
}

/**
 * Check to see if an object is empty (contains no enumerable properties).
 *
 */
function isEmptyObject(obj: object) {
  var name;
  for (name in obj) {
    return false;
  }
  return true;
}

function isNumber(param: any) {
  return !isNaN(param);
}

/**
 * Determine if the argument passed is a string.
 *
 * @param {Object} param Object to test whether or not it is a string.
 * @returns {Boolean}
 */
function isString(param: any) {
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
function isFunction(param: any) {
  return Object.prototype.toString.call(param) === "[object Function]";
}

function isNumeric(obj: any) {
  return !isNaN(parseFloat(obj)) && isFinite(obj);
}

/**
 * Determine whether a variable has been declared.
 * @param {*} param - The variable to test
 * @returns {boolean} Return true if the variable hasn't been declared, otherwise false.
 */
function isUndefined(param: any) {
  return typeof param === "undefined";
}

/**
 * Determine whether a string is either empty or filled with white spaces.
 * @param {string} param - The string to test
 * @return {boolean} Returns true if it is empty or filled with white spaces, otherwise false.
 */
function isEmpty(param: string) {
  return /^\s*$/.test(param);
}

/**
 * Replace multiple strings with multiple other strings.
 * @param {string} str - The original string to modify
 * @param {Object} mapObj - Keys/value pairs to do the replacement.
 * @return {string} A new string
 */
// http://stackoverflow.com/a/15604206
function replaceAll(str: string, mapObj: object) {
  var re = new RegExp(Object.keys(mapObj).join("|"), "gi");

  return str.replace(re, function (matched) {
    return mapObj[matched.toLowerCase() as keyof typeof mapObj];
  });
}

/**
 * Returns query string parameters from a query string.
 *
 * @param {string} [queryString] - The query string, defaults to the document query string of current page.
 * @return {Object} Returns all key/value pairs in the query string.
 */
function urlArgs(queryString: string) {
  queryString = queryString || location.search;
  var args: any = {}; // Start with an empty object
  var decodeParam = function (str: string) {
    return decodeURIComponent(str.replace(/\+/g, " "));
  };
  var query = queryString.substring(1); // Get query string, minus '?'
  var pairs = query.split("&"); // Split at ampersands
  for (var i = 0; i < pairs.length; i++) {
    // For each fragment
    var pos = pairs[i].indexOf("="); // Look for "name=value"
    if (pos == -1) continue; // If not found, skip it
    var name = pairs[i].substring(0, pos); // Extract the name
    var value = pairs[i].substring(pos + 1); // Extract the value
    name = decodeParam(name); // Decode the name
    value = decodeParam(value); // Decode the value
    args[name as keyof typeof args] = value; // Store as a property
  }
  return args; // Return the parsed arguments
}

/**
 * Check whether a value is an integer.
 * @param {*} value - The value to test.
 * @return {boolean} Returns true if the value is an integer, otherwise false.
 */
function isInteger(value: any) {
  // @ts-ignore
  if (Number.isInteger) {
    // @ts-ignore
    return Number.isInteger(value);
  }
  return (
    typeof value === "number" && isFinite(value) && Math.floor(value) === value
  );
}

// A function for defining simple classes.
function createClass(
  Constructor: any,
  protoProps: object,
  staticProps: object
) {
  function defineProperties(target: object, props: Array<any>) {
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
  function objectToArray(obj: object) {
    var arr = [];
    for (var prop in obj) {
      if (!obj.hasOwnProperty(prop)) continue;
      arr.push({
        key: prop,
        value: obj[prop as keyof typeof obj],
      });
    }
    return arr;
  }
  if (protoProps) {
    const props = objectToArray(protoProps);
    defineProperties(Constructor.prototype, props);
  }
  if (staticProps) {
    const props = objectToArray(staticProps);
    defineProperties(Constructor, props);
  }
  return Constructor;
}

export {
  createClass,
  encodeFormatData,
  isArray,
  isEmptyObject,
  isNumber,
  isNumeric,
  isInteger,
  isString,
  isFunction,
  isUndefined,
  isEmpty,
  inArray,
  replaceAll,
  trim,
  urlArgs,
};
