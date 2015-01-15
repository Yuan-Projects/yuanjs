
  (function(){
    var cache = {},
	guidCounter = 1,
	expando = "data" + (new Date()).getTime();
    
    function getData(elem) {
      var guid = elem[expando];
      if (!guid) {
	guid = elem[expando] = guidCounter++;
	cache[guid] = {}; 
      }
      return cache[guid];
    }

    function removeData(elem) {
      var guid = elem[expando];
      if (!guid) return;
      delete cache[guid];
      try {
	delete elem[expando];
      } catch (e) {
	if (elem.removeAttribute) {
	  elem.removeAttribute(expando);
	}
      }
    }

    yuanjs.getData = getData;
    yuanjs.removeData = removeData;
  })();
