  function isVisible(element) {
    return !(element.offsetHeight === 0 && element.offsetWidth === 0);
  }

  function isOpacitySupported() {
    var div = document.createElement("div");
    div.setAttribute("style", "opacity:.5");
    return div.style.opacity === "0.5";
  }

  function getOpacity(element) {
    var defaultValue = 1.0;
    if (isOpacitySupported()) {
      return parseFloat(element.style.opacity) || defaultValue; 
    } else {
      if (element.style.cssText) {
	var regExp = /alpha\(.*opacity=(\d+).*\)/i;
	var matchResult = element.style.cssText.match(regExp);
	if (matchResult && matchResult[1]) {
	  return parseFloat(matchResult[1] / 100);
	}
      }
    }
    return defaultValue;
  }

  /**
   * Get the top and height value for hidden elements. 
   */
  function getDimensions(element) {
    var properties = {
      position: "absolute",
      visibility: "hidden",
      display: "block"
    };

    var previous = {};
    for ( var prop in properties){
      previous[prop] = element.style[prop];
      element.style[prop] = properties[prop];
    }
    var result = {
      width: element.offsetWidth,
      height: element.offsetHeight
    };
    for (prop in properties) {
      element.style[prop] = previous[prop];
    }
    return result;
  }

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

    if (name === "opacity") {
      return getOpacity(element);
    }
    //return element.style[name];
    return fetchComputedStyle(element, name);
  }

  function fetchComputedStyle(element, property) {
    if (window.getComputedStyle) {
      var computedStyle = window.getComputedStyle(element);
      if (computedStyle) {
	property = property.replace(/([A-Z])/g, '-$1').toLowerCase();
	return computedStyle.getPropertyValue(property);
      }
    } else if (element.currentStyle) {
      property = property.replace(/-([a-z])/ig, function(all, letter) { return letter.toUpperCase(); });
      return element.currentStyle[property];
    }
  }

  function hasClass(element, className) {
    var originalClassName = element.className;
    if (!originalClassName) {
      return false;
    }
    var classRegExp = new RegExp("\\b" + className + "\\b");
    return classRegExp.test(originalClassName);
  }
  
  function getWindowSize() {
    var pageWidth = window.innerWidth,
        pageHeight = window.innerHeight;
    if (typeof pageWidth != "number") {
      pageWidth = document.documentElement.clientWidth;
      pageHeight = document.documentElement.clientHeight;
    }
    return {
      width: pageWidth,
      height: pageHeight
    };
  }

  function width(element, newWidth) {
    if (newWidth) {
      element.style.width = newWidth;
    } else {
      if (element === window) {
        var windowSize = getWindowSize();
        return windowSize.width;
      }
      if (!isVisible(element)) {
        return getDimensions(element).width;
      }
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
      if (!isVisible(element)) {
	return getDimensions(element).height;
      }
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
  
  function getTranslateXValue(domElement) {
    var val = getTranslateValue(domElement);
    return val.m41;
  }

  function getTranslateYValue(domElement) {
    var val = getTranslateValue(domElement);
    return val.m42;
  }

  /**
   * Return the CSS3 translate value of a DOM element. 
   * Note: IE 9+
   * @param {Object} domElement : A native DOM element
   * @returns {mixed}
   */
  function getTranslateValue(domElement) {
    var cssMatrixObject = null;
    if (typeof WebKitCSSMatrix !== "undefined") {
      cssMatrixObject = WebKitCSSMatrix;
    } else if (typeof MSCSSMatrix !== "undefined") {
      cssMatrixObject = MSCSSMatrix;
    } else if (typeof DOMMatrix !== "undefined") {
      cssMatrixObject = DOMMatrix;
    }

    var style = window.getComputedStyle(domElement);

    var matrixString = '';
    if (typeof style.webkitTransform !== "undefined") {
      matrixString = style.webkitTransform;
    } else if (typeof style.mozTransform !== "undefined") {
      matrixString = style.mozTransform;
    } else if (typeof style.msTransform !== "undefined") {
      matrixString = style.msTransform;
    } else if (typeof style.transform !== "undefined") {
      matrixString = style.transform;
    }

    return new cssMatrixObject(matrixString);
  }
  
  function getTransitionEndEventName() {
    var i,
      el = document.createElement('div'),
      transitions = {
        'WebkitTransition':'webkitTransitionEnd',
        'transition':'transitionend',
        'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
        'MozTransition':'transitionend'
      };
    
    for (i in transitions) {
      if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
        return transitions[i];
      }
    }
    //TODO: throw 'TransitionEnd event is not supported in this browser';
    return '';
  }
  
  function has3dTransforms(){
      var el = document.createElement('p'),
      has3d,
      transforms = {
          'webkitTransform':'-webkit-transform',
          'OTransform':'-o-transform',
          'msTransform':'-ms-transform',
          'MozTransform':'-moz-transform',
          'transform':'transform'
      };
   
      // Add it to the body to get the computed style
      document.body.insertBefore(el, null);
   
      for(var t in transforms){
          if( el.style[t] !== undefined ){
              el.style[t] = 'translate3d(1px,1px,1px)';
              has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
          }
      }
   
      document.body.removeChild(el);
   
      return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
  }
  
  yuanjs.hasClass = hasClass;
  yuanjs.width = width;
  yuanjs.height = height;
  yuanjs.position = position;
  yuanjs.offset = offset;
  yuanjs.css = css;
  yuanjs.getTranslateXValue = getTranslateXValue;
  yuanjs.getTranslateYValue = getTranslateYValue;
  yuanjs.getTransitionEndEventName = getTransitionEndEventName;
  yuanjs.has3dTransforms = has3dTransforms;
