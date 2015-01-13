
  // DOM Events

  function addEventListener(dom, eventName, callback) {
    if (dom.addEventListener) {
      dom.addEventListener(eventName, callback, false);
      return callback;
    } else if (dom.attachEvent) {
      var bound = function() {
	return callback.apply(dom, arguments);
      };
      dom.attachEvent("on" + eventName, bound);
      return bound;
    }
  }

  function removeEventListener(dom, eventName, callback) {
    if (dom.removeEventListener) {
      dom.removeEventListener(eventName, callback, false);
    } else if (dom.detachEvent) {
      dom.detachEvent("on" + eventName, callback);
    }
  }

  yuanjs.addEventListener = addEventListener;
  yuanjs.removeEventListener = removeEventListener;
    
