(function (window, undefined) {
  /* jshint -W034 */
  "use strict";
  var yuanjs = {};
  yuanjs.version = "0.0.3";
  
  var previousYuanJS = window.yuanjs;
  
  yuanjs.noConflict = function() {
    window.yuanjs = previousYuanJS;
    return this;
  };
