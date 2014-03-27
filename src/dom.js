    /**
     * DOM Manipulation
     *
     */
     
    function id(id) {
        return document.getElementById(id);
    }
    
    function tag(tagName) {
        return document.getElementsByTagName(tagName);
    }
    
    function cssClass(classname, parentNode) {
        var parentNode = parentNode || document;
        if(document.getElementsByClassName) return parentNode.getElementsByClassName(classname);
        var classnameArr = classname.replace(/^\s+|\s+$/g,"").split(/\s+/);
        if(document.querySelectorAll) {
            var classname = "." + classnameArr.join(".");
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
    yuanjs.id = id;
    yuanjs.tag = tag;
    yuanjs.cssClass = cssClass;
    