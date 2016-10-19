    /**
     * Ajax request
     *
     */

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
        var headers = Object.prototype.toString.call(options.headers) === "[object Object]" ? options.headers : null;

        if(timeout) {
            var timer = setTimeout(function() {
                timedout = true;
                xhr.abort();
                xhr.message = "Canceled";
                dtd.reject(xhr);
            },timeout);
        }

        if(type === "GET" && data !== "") {
            url += (url.indexOf("?") === -1 ? "?" : "&") + data;
        }
        xhr.open(type, url, isAsyc);
        if(isAsyc) {
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              callBack();
            }
          };
        }

        xhr.setRequestHeader("Content-Type", contentType);
        if (headers) {
          for (var prop in headers) {
            if (headers.hasOwnProperty(prop)) {
              xhr.setRequestHeader(prop, headers[prop]);
            }
          }
        }

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
            if (completeCallBack) {
              completeCallBack(xhr, textStatus);
            }
            // Determine if successful
            var status = xhr.status;
            var isSuccess = status >= 200 && status < 300 || status === 304;
            if(isSuccess) {
                var resultType = xhr.getResponseHeader("Content-Type");
                if(dataType === "xml" || (resultType && resultType.indexOf("xml") !== -1 && xhr.responseXML)){
                  if (successCallBack) {
                    successCallBack(resultXML, xhr);
                  }
                } else if(dataType === "json" || resultType === "application/json") {
                  if (successCallBack) {
                    successCallBack(JSON.parse(resultText), xhr);
                  }
                }else{
                  if (successCallBack) {
                    successCallBack(resultText, xhr);
                  }
                }
                dtd.resolve(xhr);
            } else {
              if (errorCallBack) {
                errorCallBack(status, xhr);
              }
                dtd.reject(xhr);
            }
        }
        return dtd.promise();
    }
    yuanjs.ajax = ajax;
    
  // Inspired by jQuery
  function loadScript(src, successCallback, errorCallback) {
    var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = src;
    
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function() {
      var readyState = script.readyState;
      if (!readyState || /loaded|complete/.test(readyState)) {
        
        // Handle memory leak in IE
        script.onload = script.onreadystatechange = null;
        
        // Remove the script
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        
        // Dereference the script
        script = null;
        
        // Callback 
        successCallback();
      }
    };
    
    if("onerror" in script) {
      script.onerror = function(){
        errorCallback();
      };
    }
    // Circumvent IE6 bugs with base elements by prepending
	  // Use native DOM manipulation to avoid our domManip AJAX trickery
    head.insertBefore(script, head.firstChild);
  }
  
  yuanjs.loadScript = loadScript;