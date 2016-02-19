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
