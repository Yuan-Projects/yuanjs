
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

