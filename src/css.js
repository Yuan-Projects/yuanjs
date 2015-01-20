  function css(element, name, value) {
    var translations = {
      "float": ["cssFloat", "styleFloat"]
    };
    name = name.replace(/-([a-z])/ig, 
	function(all, letter){ 
	  return letter.toUpperCase(); 
	});

    if (translations[name]) {
      name = typeof element.style[translations[name][0]] !== "undefined" ?  translations[name][0] : translations[name][1];
    } 

    if (typeof value !== "undefined") {
      element.style[name] = value;
    }

    return element.style[name];
  }

  function hasClass(element, className) {
    var originalClassName = element.className;
    if (!originalClassName) {
      return false;
    }
    var classRegExp = new RegExp("\\b" + className + "\\b");
    return classRegExp.test(originalClassName);
  }

  function width(element, newWidth) {
    if (newWidth) {
      element.style.width = newWidth;
    } else {
      if (window.getComputedStyle) {
	var style = window.getComputedStyle(element);
	return style.getPropertyValue("width");
      } else if (element.currentStyle) {
	var currentWidth = element.currentStyle.width;
	return currentWidth == "auto" ? element.offsetWidth : currentWidth;
      }
    }
  }

  function height(element, newHeight) {
    if (newHeight) {
      element.style.height = newHeight;
    } else {
      if (window.getComputedStyle) {
	var style = window.getComputedStyle(element);
	return style.getPropertyValue("height");
      } else if (element.currentStyle) {
	var currentHeight = element.currentStyle.height;
	return currentHeight == "auto" ? element.offsetHeight : currentHeight;
      }
    }
  }

  function position(element) {
    return {
      "left": element.offsetLeft,
      "top": element.offsetTop
    };
  }

  function offset(element) {
    var box = element.getBoundingClientRect();
    var body = document.body;
    var docEl = document.documentElement;
    
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop ;
    var left = box.left + scrollLeft - clientLeft;

    return {
      "top": Math.round(top),
      "left": Math.round(left)	
    };
  }
  
  yuanjs.hasClass = hasClass;
  yuanjs.width = width;
  yuanjs.height = height;
  yuanjs.position = position;
  yuanjs.offset = offset;
  yuanjs.css = css;
