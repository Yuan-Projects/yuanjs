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
    
  function loadScript(src, successCallback, errorCallback) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = src;
    if("onload" in script) {
      script.onload = successCallback;
      script.onerror = errorCallback;
    } else if ("onreadystatechange" in script) {
      // onreadystatechange is not a reliable way to detect script file load status
      // It's your responsibility to check whether it's loaded successfully or not!
      script.onreadystatechange = function() {
        var readyState = script.readyState;
        // readyState property 
        // https://msdn.microsoft.com/en-us/library/ms534359(v=vs.85).aspx
        if (readyState === "complete" || readyState === "loaded") {
          script.onreadystatechange = null;
          successCallback();
        }
      };
    }
    document.body.appendChild(script);
  }
  
  yuanjs.loadScript = loadScript;