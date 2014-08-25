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
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              callBack();
            }
          };
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
            if (completeCallBack) {
              completeCallBack(xhr, textStatus);
            }
            if(xhr.status === 200) {
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
                errorCallBack(xhr.status, xhr);
              }
                dtd.reject(xhr);
            }
        }
        return dtd.promise();
    }
    yuanjs.ajax = ajax;
    