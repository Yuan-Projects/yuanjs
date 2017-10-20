  /**
   * DOM Manipulation
   *
   */

  // https://stackoverflow.com/questions/814564/inserting-html-elements-with-javascript/814649#814649
  function createDOMFromString(string) {
    var frag = document.createDocumentFragment(),
        div = document.createElement('div');
    div.innerHTML = string;
    while (div.firstChild) {
      frag.appendChild(div.firstChild);
    }
    return frag;
  }

  function isDOMNode(node) {
    return node && node.nodeType;
  }

  function after(element, content) {
    // insertAdjacentHTML method is useful but has many problems, so we don't use it here.
    // See https://github.com/jquery/jquery/pull/1200
    var newElement = null;
    if (typeof content === "string") {
      newElement = createDOMFromString(content);
    } else if (isDOMNode(content)) {
      newElement = content;
    }
    if (!newElement) return false;
    element.parentNode.insertBefore(newElement, element.nextSibling);
  }

  function append(element, content) {
    var newElement = null;
    if (typeof content === "string") {
      newElement = createDOMFromString(content);
    } else if (isDOMNode(content)) {
      newElement = content;
    }
    if (!newElement) return false;
    element.appendChild(newElement);
  }

  function before(element, content) {
    var newElement = null;
    if (typeof content === "string") {
      newElement = createDOMFromString(content);
    } else if (isDOMNode(content)) {
      newElement = content;
    }
    if (!newElement) return false;
    element.parentNode.insertBefore(newElement, element);
  }

  function children(element) {
    // Note: Internet Explorer 6, 7 and 8 supported it, but erroneously includes Comment nodes.
    return element.children;
  }


  function clone(element) {
    return element.cloneNode(true);
  }

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

  function empty(element) {
    element.innerHTML = '';
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

  function contains(parentNode, childNode) {
    if (parentNode.compareDocumentPosition) {
      return !!(parentNode.compareDocumentPosition(childNode) & 16);
    } else if (typeof parentNode.contains === "function") {
      return parentNode.contains(childNode);
    } else {
      if (childNode) {
        while ((childNode = childNode.parentNode)) {
          if (childNode === parentNode) {
            return true;
          }
        }
      }
      return false;
    }
  }

  function text(element, newText) {
    if (newText === undefined) {
      return (typeof element.textContent === "string") ? element.textContent : element.innerText;
    } else if (typeof newText === "string") {
      if (typeof element.textContent === "string") {
        element.textContent = newText;
      } else {
        element.innerText = newText;
      }
    }
  }

  yuanjs.after = after;
  yuanjs.append = append;
  yuanjs.before = before;
  yuanjs.children = children;
  yuanjs.clone = clone;
  yuanjs.empty = empty;
  yuanjs.id = id;
  yuanjs.tag = tag;
  yuanjs.cssClass = cssClass;
  yuanjs.matchesSelector = matchesSelector;
  yuanjs.contains = contains;
  yuanjs.text = text;
