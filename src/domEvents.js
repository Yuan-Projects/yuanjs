
  // DOM Events

  function addEventListener(dom, eventName, callback) {
    if (dom.addEventListener) {
      dom.addEventListener(eventName, callback, false);
    } else if (dom.attachEvent) {
      dom.attachEvent("on" + eventName, callback);
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
    