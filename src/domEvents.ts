import { getData, removeData } from "./data";

function fixEvent(event: any): object {
  // Predefines often-used functions
  function returnTrue() {
    return true;
  }
  function returnFalse() {
    return false;
  }

  // Tests if fixing up is needed
  if (!event || !event.stopPropagation) {
    var old = event || window.event;

    // Clone the old object so that we can modify the values
    event = {};
    for (var prop in old) {
      event[prop] = old[prop];
    }

    // The event occurrecd on this element
    if (!event.target) {
      event.target = event.srcElement || document;
    }

    // Handle which other element the event is related to
    event.relatedTarget =
      event.fromElement === event.target ? event.toElement : event.fromElement;

    // Stop the default browser action
    event.preventDefault = function () {
      event.returnValue = false;
      event.isDefaultPrevented = returnTrue;
    };

    event.isDefaultPrevented = returnFalse;

    // Stop the event from bubbling
    event.stopPropagation = function () {
      event.cancelBubble = true;
      event.isPropagationStopped = returnTrue;
    };

    event.isPropagationStopped = returnFalse;

    // Stop the event from bubbling and executing other handlers
    event.stopImmediatePropagation = function () {
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
    };

    event.isImmediatePropagationStopped = returnFalse;

    // Handle mouse position
    if (event.clientX !== null) {
      var doc = document.documentElement,
        body = document.body;

      event.pageX =
        event.clientX +
        ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
        ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
      event.pageY =
        event.clientY +
        ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
        ((doc && doc.clientTop) || (body && body.clientTop) || 0);
    }

    // Handle  key presses
    event.which = event.charCode || event.keyCode;
    // Fix button for mouse clicks:
    // 0 == left; 1 == middle; 2 == right
    if (event.button !== null) {
      event.button =
        event.button & 1 ? 0 : event.button & 4 ? 1 : event.button & 2 ? 2 : 0;
    }
  }
  return event;
}

// DOM Events

var nextGuid = 1;
function addEvent(elem: HTMLElement, type: any, fn: any): void {
  var data = getData(elem);
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
    data.dispatcher = function (event: any) {
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
    if (document.addEventListener) {
      elem.addEventListener(type, data.dispatcher, false);
    }
  }
}

function removeEvent(elem: HTMLElement, type: any, fn: any) {
  var data = getData(elem);
  if (!data.handlers) return;
  var removeType = function (t: any) {
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

function triggerEvent(elem: HTMLElement, event: any) {
  var elemData = getData(elem),
    parent = (elem.parentNode || elem.ownerDocument) as HTMLElement;

  if (typeof event === "string") {
    event = { type: event, target: elem };
  }
  event = fixEvent(event);

  if (elemData.dispatcher) {
    elemData.dispatcher.call(elem, event);
  }

  if (parent && !event.isPropagationStopped()) {
    triggerEvent(parent, event);
  } else if (!parent && !event.isDefaultPrevented()) {
    var targetData = getData(event.target);
    if (event.target[event.type]) {
      targetData.disabled = true;
      event.target[event.type]();
      targetData.disabled = false;
    }
  }
}

function tidyUp(elem: HTMLElement, type: string) {
  function isEmpty(obj: object) {
    for (var prop in obj) {
      return false;
    }
    return true;
  }

  var data = getData(elem);

  if (data.handlers[type].length === 0) {
    delete data.handlers[type];

    if (document.removeEventListener) {
      elem.removeEventListener(type, data.dispatcher, false);
    }
  }

  if (isEmpty(data.handlers)) {
    delete data.handlers;
    delete data.dispatchers;
  }

  if (isEmpty(data)) {
    removeData(elem);
  }
}

// Document ready event.
// http://stackoverflow.com/a/9899701
const documentReady = (function () {
  // The public function name defaults to window.docReady
  // but you can pass in your own object and own function name and those will be used
  // if you want to put them in a different namespace
  //funcName = funcName || "docReady";
  //baseObj = baseObj || window;
  var readyList: any = [];
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
    if (document.readyState === "complete") {
      ready();
    }
  }

  // This is the one public interface
  // docReady(fn, context);
  // the context argument is optional - if present, it will be passed
  // as an argument to the callback
  return function (callback: Function, context: any) {
    // if ready has already fired, then just schedule the callback
    // to fire asynchronously, but right away
    if (readyFired) {
      setTimeout(function () {
        callback(context);
      }, 1);
      return;
    } else {
      // add the function and context to the list
      readyList.push({ fn: callback, ctx: context });
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
      }
      readyEventHandlersInstalled = true;
    }
  };
})();

export { addEvent, documentReady, removeEvent, triggerEvent };
