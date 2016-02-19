
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
