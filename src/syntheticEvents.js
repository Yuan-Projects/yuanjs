  /**
   * Create synthetic DOM events.
   * @param {String} eventName The name of the event
   * @param {Object} [params] Event parameters, can have the following fields:
   *        1) "bubbles":  A Boolean indicating whether the event bubbles. The default is false.
   *        2) "cancelable": A Boolean indicating whether the event can be canceled. The default is false.
   *        3) "scoped": A Boolean indicating whether the given event bubbles.If this value is true, deepPath will only contain a target node.
   *        4) "composed": A Boolean indicating whether the event will trigger listeners outside of a shadow root. The default is false.
   *        5) "detail": optional and defaulting to null, of type any, that is an event-dependent value associated with the event.
   */
  function SyntheticEvent(eventName, params) {
    if (typeof eventName !== "string") {
      throw new Error("The eventName parameter should be a string");
    }
    params = {
      "bubbles": Boolean(params && params.bubbles),
      "cancelable": Boolean(params && params.cancelable),
      "composed": Boolean(params && params.composed),
      "scoped": Boolean(params && params.scoped),
      "detail": params ? params.detail : null
    };
    var event;    
    try {
      event = new CustomEvent(eventName, params);
    } catch(e) {
      try {
        // DOM Level 3 Events Custom event module
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);
      } catch(ex) {
        // DOM Level 3 Events Basic events module
        event = document.createEvent('Event');
        event.initEvent(eventName, params.bubbles, params.cancelable);
        event.detail = params.detail; // Attach the detail data to the event object
      } finally {
        if (!event) {
          event = document.createEventObject();
          event.type = eventName;
          event.eventType = eventName;
          var detail = params.detail;
          if (detail) {
            for (var prop in detail) {
              if (detail.hasOwnProperty(prop)) {
                event[prop] = detail[prop];
              }
            }
          }
        }
      }
    } finally {
      if (event) {
        return event;
      } else {
        throw new Error('Your browser doest not support custom events.');
      }
    }
  }
  
  function dispatchSyntheticEvent(elem, event) {
    if (elem.dispatchEvent) {
      elem.dispatchEvent(event);
    } else if (elem.fireEvent) {
      elem.fireEvent("on" + event.type, event);
    }
  }

  yuanjs.CustomEvent = SyntheticEvent;
  yuanjs.dispatchCustomEvent = dispatchSyntheticEvent;