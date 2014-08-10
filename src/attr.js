  /**
   * Setting and getting attribute values
   *
   */
  var translations = {
    "for": "htmlFor",
    "class": "className",
    "readonly": "readOnly",
    "maxlength": "maxLength",
    "cellspacing": "cellSpacing",
    "rowspan": "rowSpan",
    "colspan": "colSpan",
    "tabindex": "tabIndex",
    "cellpadding": "cellPadding",
    "usemap": "useMap",
    "frameborder": "frameBorder",
    "contenteditable": "contentEditable"
  };
  
  function attr(element, name, value) {
    var property = translations[name] || name,
        propertyExists = typeof element[property] !== "undefined";
        
    if (typeof value !== "undefined") {
      if (propertyExists) {
        element[property] = value;
      } else {
        element.setAttribute(name, value);
      }
    }
    
    return propertyExists ? element[property] : element.getAttribute(name);
  }
  
  yuanjs.attr = attr;