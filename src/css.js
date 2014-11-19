  function hasClass(element, className) {
    var originalClassName = element.className;
    if (!originalClassName) {
      return false;
    }
    var classRegExp = new RegExp("\\b" + className + "\\b");
    return classRegExp.test(originalClassName);
  }
  
  yuanjs.hasClass = hasClass;