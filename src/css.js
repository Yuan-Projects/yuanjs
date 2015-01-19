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
  
  yuanjs.hasClass = hasClass;
  yuanjs.width = width;
  yuanjs.height = height;
