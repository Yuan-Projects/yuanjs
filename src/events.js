    // Events off and off
    var Events = [];

    function on(event, callback) {
        if (!Events[event]) {
            Events[event] = [];
        }
        Events[event].push(callback);
        return callback;
    }

    function off(event, callback) {
        if (!Events[event]) {
            return ;
        }
        if (callback) {
            var index = Events[event].indexOf(callback);
            if (index !== -1) {
                Events[event].splice(index, 1);
            }
        } else {
            Events[event] = [];
        }
    }

    function trigger (event) {
        if (!Events[event]) {
            return ;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        var callbackArray = Events[event];
        for (var i = callbackArray.length - 1; i >= 0; i--) {
            callbackArray[i].apply(callbackArray[i], args);
        };
    }
    yuanjs.on = on;
    yuanjs.off = off;
    yuanjs.trigger = trigger;
    