  /**
   * DOM Manipulation
   *
   */
   
  function id() {
    var argLength = arguments.length;
    if (argLength === 0) throw Error('No id name provided.');
    var result = [];
    for (var i = 0; i < argLength; i++) {
      var thisArg = arguments[i];
      result.push(typeof thisArg === "string" ? document.getElementById(thisArg) : thisArg);
    }
    return argLength > 1 ? result : result[0];
  }

  function tag(tagName) {
    var newArr;
    if (!window.findByTagWorksAsExpected) {
      window.findByTagWorksAsExpected = (function(){
        var div = document.createElement("div");
        div.appendChild(document.createComment("test"));
        return div.getElementsByTagName("*").length === 0;
      })();
    }
    var allElements = document.getElementsByTagName(tagName);
    if (tagName === "*") {
      if (!window.findByTagWorksAsExpected) {
        newArr = [];
        for (var n = allElements.length - 1; n >= 0; n--) {
          if (allElements[n].nodeType == 1){
            newArr.push(allElements[n]);
          }
        }
      }
    }
    return newArr ? newArr : allElements;
  }

  function cssClass(classname, parentNode) {
    parentNode = parentNode || document;
    if(document.getElementsByClassName) return parentNode.getElementsByClassName(classname);
    var classnameArr = classname.replace(/^\s+|\s+$/g,"").split(/\s+/);
    if(document.querySelectorAll) {
      classname = "." + classnameArr.join(".");
      return parentNode.querySelectorAll(classname);
    }
    var allTags = parentNode.getElementsByTagName("*");
    var nodes = [];
    if(allTags.length) {
      tagLoop:
      for(var i = 0; i < allTags.length; i++) {
        var tmpTag = allTags[i];
        var tmpClass = tmpTag.className;
        if(!tmpClass) continue tagLoop;
        if (tmpClass === classname) {
          nodes.push(tmpTag);
          continue tagLoop;
        }
        matchLoop:
        for(var j = 0; j < classnameArr.length; j++) {
          var patt = new RegExp("\\b" + classnameArr[j] + "\\b");
          if(!patt.test(tmpClass)) {
            continue tagLoop;
          }
        }
        nodes.push(tmpTag);
      }
    }
    return nodes;
  }
  
  function matchesSelector(element, selector){
    if (element.matches) {
      return element.matches(selector);
    } else if (element.matchesSelector){
      return element.matchesSelector(selector);
    } else if (element.msMatchesSelector){
      return element.msMatchesSelector(selector);
    } else if (element.mozMatchesSelector){
      return element.mozMatchesSelector(selector);
    } else if (element.webkitMatchesSelector){
      return element.webkitMatchesSelector(selector);
    } else {
      throw new Error("Not supported.");
    }
  }
  
  yuanjs.id = id;
  yuanjs.tag = tag;
  yuanjs.cssClass = cssClass;
  yuanjs.matchesSelector = matchesSelector;
