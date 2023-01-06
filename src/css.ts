type MSCSSMatrix = DOMMatrix;
declare var MSCSSMatrix: typeof DOMMatrix;

function addClass(element: HTMLElement, className: string) {
  if (hasClass(element, className)) return false;
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += " " + className;
  }
}

function isVisible(element: HTMLElement) {
  return !(element.offsetHeight === 0 && element.offsetWidth === 0);
}

function isOpacitySupported() {
  var div = document.createElement("div");
  div.setAttribute("style", "opacity:.5");
  return div.style.opacity === "0.5";
}

function getOpacity(element: HTMLElement) {
  var defaultValue = 1.0;
  if (isOpacitySupported()) {
    return parseFloat(element.style.opacity) || defaultValue;
  } else {
    if (element.style.cssText) {
      var regExp = /alpha\(.*opacity=(\d+).*\)/i;
      var matchResult = element.style.cssText.match(regExp);
      if (matchResult && matchResult[1]) {
        return parseFloat(matchResult[1]) / 100;
      }
    }
  }
  return defaultValue;
}

/**
 * Get the top and height value for hidden elements.
 */
function getDimensions(element: HTMLElement) {
  var properties = {
    position: "absolute",
    visibility: "hidden",
    display: "block",
  };

  var previous: any = {};
  for (var prop in properties) {
    if (properties.hasOwnProperty(prop)) {
      previous[prop] = element.style[prop as keyof typeof properties];
      element.style[prop as keyof typeof properties] =
        properties[prop as keyof typeof properties];
    }
  }
  var result = {
    width: element.offsetWidth,
    height: element.offsetHeight,
  };
  for (prop in properties) {
    if (properties.hasOwnProperty(prop)) {
      element.style[prop as keyof typeof properties] =
        previous[prop as keyof typeof properties];
    }
  }
  return result;
}

function css(element: HTMLElement, name: string, value?: any) {
  var translations = {
    float: ["cssFloat", "styleFloat"],
  };
  name = name.replace(/-([a-z])/gi, function (all, letter) {
    return letter.toUpperCase();
  });

  if (translations.hasOwnProperty(name)) {
    const val: string[] = translations[name as keyof typeof translations];
    const v1 = val[0];
    const cssStyle = element.style;
    name =
      typeof cssStyle[v1 as keyof typeof cssStyle] !== "undefined"
        ? val[0]
        : val[1];
  }

  if (typeof value !== "undefined") {
    // @ts-ignore
    element.style[name] = value;
  }

  if (name === "opacity") {
    return getOpacity(element);
  }
  return fetchComputedStyle(element, name);
}

function fetchComputedStyle(element: HTMLElement, property: string) {
  if (window.getComputedStyle) {
    var computedStyle = window.getComputedStyle(element);
    if (computedStyle) {
      property = property.replace(/([A-Z])/g, "-$1").toLowerCase();
      return computedStyle.getPropertyValue(property);
    }
  }
}

function hasClass(element: HTMLElement, className: string) {
  var originalClassName = element.className;
  if (!originalClassName) {
    return false;
  }
  if (element.classList) {
    return element.classList.contains(className);
  } else {
    var classRegExp = new RegExp("\\b" + className + "\\b");
    return classRegExp.test(originalClassName);
  }
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
    height: pageHeight,
  };
}

function width(element: HTMLElement | Window, newWidth: string) {
  if (newWidth && "style" in element) {
    element.style.width = newWidth;
  } else {
    if (element === window) {
      var windowSize = getWindowSize();
      return windowSize.width;
    }
    if (!isVisible(element as HTMLElement)) {
      return getDimensions(element as HTMLElement).width;
    }
    if (window.getComputedStyle) {
      var style = window.getComputedStyle(element as HTMLElement);
      return style.getPropertyValue("width");
    }
  }
}

function height(element: HTMLElement, newHeight: string) {
  if (newHeight) {
    element.style.height = newHeight;
  } else {
    if (!isVisible(element)) {
      return getDimensions(element).height;
    }
    if (window.getComputedStyle) {
      var style = window.getComputedStyle(element);
      return style.getPropertyValue("height");
    }
  }
}

function position(element: HTMLElement) {
  return {
    left: element.offsetLeft,
    top: element.offsetTop,
  };
}

function offset(element: HTMLElement) {
  var box = element.getBoundingClientRect();
  var body = document.body;
  var docEl = document.documentElement;

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return {
    top: Math.round(top),
    left: Math.round(left),
  };
}

/**
 * Get the current coordinates of the element, relative to the document.
 * Note: Works on IE7+
 */
function getOffset(elem: HTMLElement) {
  var current: any = elem.offsetParent,
    actualLeft = elem.offsetLeft,
    actualTop = elem.offsetTop;

  while (current.offsetParent) {
    current = current.offsetParent;
    actualLeft += current.offsetLeft;
    actualTop += current.offsetTop;
  }

  return {
    left: actualLeft,
    top: actualTop,
  };
}

function getTranslateXValue(domElement: HTMLElement) {
  var val = getTranslateValue(domElement);
  return val.m41;
}

function getTranslateYValue(domElement: HTMLElement) {
  var val = getTranslateValue(domElement);
  return val.m42;
}

/**
 * Return the CSS3 translate value of a DOM element.
 * @param {Object} domElement : A native DOM element
 * @returns {mixed}
 */
function getTranslateValue(domElement: HTMLElement) {
  var cssMatrixObject = null;
  if (typeof WebKitCSSMatrix !== "undefined") {
    cssMatrixObject = WebKitCSSMatrix;
  } else if (typeof MSCSSMatrix !== "undefined") {
    cssMatrixObject = MSCSSMatrix;
  } else if (typeof DOMMatrix !== "undefined") {
    cssMatrixObject = DOMMatrix;
  }

  var style = window.getComputedStyle(domElement);

  var matrixString = "";
  if (typeof style.webkitTransform !== "undefined") {
    matrixString = style.webkitTransform;
    //} else if (typeof style.mozTransform !== "undefined") {
  } else if ("mozTransform" in style) {
    matrixString = style.mozTransform as string;
  } else if ("msTransform" in style) {
    matrixString = style.msTransform as string;
  } else if (typeof style.transform !== "undefined") {
    matrixString = style.transform;
  }

  return new cssMatrixObject(matrixString);
}

function getTransitionEndEventName() {
  var i,
    el = document.createElement("div"),
    transitions = {
      WebkitTransition: "webkitTransitionEnd",
      transition: "transitionend",
      OTransition: "otransitionend", // oTransitionEnd in very old Opera
      MozTransition: "transitionend",
    };

  for (i in transitions) {
    if (
      transitions.hasOwnProperty(i) &&
      el.style[i as keyof typeof el.style] !== undefined
    ) {
      return transitions[i as keyof typeof transitions];
    }
  }
  //TODO: throw 'TransitionEnd event is not supported in this browser';
  return "";
}

function has3dTransforms() {
  var el = document.createElement("p"),
    has3d,
    transforms = {
      webkitTransform: "-webkit-transform",
      OTransform: "-o-transform",
      msTransform: "-ms-transform",
      MozTransform: "-moz-transform",
      transform: "transform",
    };

  // Add it to the body to get the computed style
  document.body.insertBefore(el, null);

  for (var t in transforms) {
    if (
      transforms.hasOwnProperty(t) &&
      el.style[t as keyof typeof el.style] !== undefined
    ) {
      // @ts-ignore
      el.style[t] = "translate3d(1px,1px,1px)";
      // @ts-ignore
      has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
    }
  }

  document.body.removeChild(el);
  return has3d !== undefined && has3d.length > 0 && has3d !== "none";
}

function removeClass(element: HTMLElement, className: string) {
  if (!element || !element.className) return false;
  if (element.classList) {
    element.classList.remove(className);
  } else {
    var newClassName = element.className
      .split(/\s+/g)
      .filter(function (cls) {
        return cls !== className;
      })
      .join(" ");

    if (newClassName !== element.className) {
      element.className = newClassName;
    }
  }
}

function toggleClass(element: HTMLElement, className: string) {
  if (hasClass(element, className)) {
    removeClass(element, className);
  } else {
    addClass(element, className);
  }
}

export {
  addClass,
  hasClass,
  width,
  height,
  position,
  offset,
  removeClass,
  css,
  getTranslateXValue,
  getTranslateYValue,
  getTransitionEndEventName,
  has3dTransforms,
  getOffset,
  toggleClass,
};
