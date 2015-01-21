  /**
   * Setting and getting attribute values
   *
   */
  
  function attr(element, name, value) {
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
    var specialAttributes = ["id", "action"];
    var property = translations[name] || name,
        propertyExists = typeof element[property] !== "undefined";
        
    if (typeof value !== "undefined") {
      if (propertyExists) {
        element[property] = value;
      } else {
        element.setAttribute(name, value);
      }
    }

    if (property === "href") {
      return element.getAttribute("href", 2);
    }
    if (property === "style") {
      return typeof element.style.cssText === "string" ? element.style.cssText : element.getAttribute("style");
    }

    if (specialAttributes.indexOf(property) != -1) {
      return element.getAttributeNode(property).nodeValue; 
    }
    
    return propertyExists ? element[property] : element.getAttribute(name);
  }
  
  yuanjs.attr = attr;
