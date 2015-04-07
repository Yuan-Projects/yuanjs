(function(){
  function loadScript(url) {
    var script = document.createElement("script");
    script.type= "text/javascript";
    script.src = url;
    document.body.appendChild(script);
  }

  function jsonp(url, callback) {
    var timeStamp = (new Date()).getTime();
    var callbackfn = "myjspnp_" + timeStamp;
    
    url = url.replace("{callback}", callbackfn);
    window[callbackfn] = callback;

    loadScript(url);
  }

  function $(selector) {
    return document.querySelectorAll(selector);
  }

  // Replace placeholders in the URL string
  function updateUrlArgs(url) {
    return url;
  }

  // Replace this with your own.
  var apiUrl = "http://127.0.0.1/test/jsonp.php?callback={callback}";
  apiUrl = updateUrlArgs(apiUrl);

  // Write your own logic within this function
  function handleJSONP(response) {
    console.log($("#d").item(0).innerHTML = response.data);
  }
  

  jsonp(apiUrl, handleJSONP);
})();
