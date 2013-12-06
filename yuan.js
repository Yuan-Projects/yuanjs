(function (window, undefined) {
    "use strict";

    function Deferred() {
        var slice = Array.prototype.slice;
        var status = "pending";
        var callbacks = { ok: [], fail: [] };
        var values;

        function resolveInternal(state, args) {
            if (status !== "pending") {
                throw new Error("Deferred has already been resolved");
            }
            status = state;
            values = slice.call(args, 0);
            callbacks[state].forEach(function (e) {
                e.apply(e, values);
            });
        }

        return {
            resolve: function () {
                resolveInternal("ok", arguments);
            },
            reject: function () {
                resolveInternal("fail", arguments);
            },
            promise: function () {
                var self;

                function promiseInternal(state, func) {
                    if (typeof func !== "function") {
                        throw new Error("Callback argument must be a Function");
                    }

                    if (status === state) {
                        func.apply(func, values);
                    } else {
                        callbacks[state].push(func);
                    }
                    return self;
                }

                self = {
                    done: function (func) {
                        return promiseInternal("ok", func);
                    },
                    fail: function (func) {
                        return promiseInternal("fail", func);
                    },
                    then: function (done, error) {
                        return this.done(done).fail(error);
                    }
                };

                return self;
            }
        };
    }

    function encodeFormatData(data) {
        if (!data) return ""; // Always return a string
        if(typeof data === "string") return data;
        var pairs = []; // To hold name=value pairs
        for(var name in data) { // For each name
            if (!data.hasOwnProperty(name)) continue; // Skip inherited
            if (typeof data[name] === "function") continue; // Skip methods
            var value = data[name].toString(); // Value as string
            name = encodeURIComponent(name.replace(" ", "+")); // Encode name
            value = encodeURIComponent(value.replace(" ", "+")); // Encode value
            pairs.push(name + "=" + value); // Remember name=value pair
        }
        return pairs.join('&'); // Return joined pairs separated with &
    }

    // Emulate the XMLHttpRequest() constructor in IE5 and IE6
    if (window.XMLHttpRequest === undefined) {
        window.XMLHttpRequest = function() {
            try {
                // Use the latest version of the ActiveX object if available
                return new ActiveXObject("Msxml2.XMLHTTP.6.0");
            } catch (e1) {
                try {
                    // Otherwise fall back on an older version
                    return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                } catch(e2) {
                    // Otherwise, throw an error
                    throw new Error("XMLHttpRequest is not supported");
                }
            }
        };
    }

    function ajax(options) {
        var dtd = Deferred();
        var xhr = new XMLHttpRequest();
        var url = options.url;
        var type = options.type ? options.type.toUpperCase() : "GET";
        var isAsyc = !!options.asyc || true;
        var successCallBack = options.success;
        var errorCallBack = options.error;
        var completeCallBack = options.complete;
        var data = options.data ? encodeFormatData(options.data) : "";
        var dataType = options.dataType || "text";
        var contentType = options.contentType || "application/x-www-form-urlencoded";
        var timeout = (options.timeout && !isNaN(options.timeout) && options.timeout > 0) ? options.timeout : 0;
        var timedout = false;
        if(timeout) {
            var timer = setTimeout(function() {
                timedout = true;
                xhr.abort();
                xhr.message = "Canceled";
                dtd.reject(xhr);
            },timeout);
        }

        if(type === "GET" && data !== "") {
            url += "?" + data;
        }
        xhr.open(type, url, isAsyc);
        if(isAsyc) {
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4) {
                    callBack();
                }
            }
        }

        xhr.setRequestHeader("Content-Type", contentType);

        switch(type) {
            case "POST":
                xhr.send(data);
                break;
            case "GET":
                xhr.send(null);
        }
        if(!isAsyc) {
            callBack();
        }

        function callBack() {
            if(timedout){
                return;
            }
            clearTimeout(timer);
            var resultText = xhr.responseText;
            var resultXML = xhr.responseXML;
            var textStatus = xhr.statusText;
            completeCallBack && completeCallBack(xhr, textStatus);
            if(xhr.status === 200) {
                var resultType = xhr.getResponseHeader("Content-Type");
                if(dataType === "xml" || (resultType.indexOf("xml") !== -1 && xhr.responseXML)){
                    successCallBack && successCallBack(resultXML, xhr);
                } else if(dataType === "json" || resultType === "application/json") {
                    successCallBack && successCallBack(JSON.parse(resultText), xhr);
                }else{
                    successCallBack && successCallBack(resultText, xhr);
                }
                dtd.resolve(xhr);
            } else {
                errorCallBack && errorCallBack(xhr.status, xhr);
                dtd.reject(xhr);
            }
        }
        return dtd.promise();
    }

    window.yuanjs = {};
    yuanjs.Deferred = Deferred;
    yuanjs.ajax = ajax;

})(window, undefined);
