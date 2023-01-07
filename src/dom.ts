import type { ElementWithLegacy } from "./types";
import { css } from "./css";

/**
 * DOM Manipulation
 *
 */

// https://stackoverflow.com/questions/814564/inserting-html-elements-with-javascript/814649#814649
function createDOMFromString(string: string): DocumentFragment {
  var frag = document.createDocumentFragment(),
    div = document.createElement("div");
  div.innerHTML = string;
  while (div.firstChild) {
    frag.appendChild(div.firstChild);
  }
  return frag;
}

function isDOMNode(node: any): boolean {
  return node && node.nodeType;
}

function after(element: HTMLElement, content: any): void {
  // insertAdjacentHTML method is useful but has many problems, so we don't use it here.
  // See https://github.com/jquery/jquery/pull/1200
  var newElement = null;
  if (typeof content === "string") {
    newElement = createDOMFromString(content);
  } else if (isDOMNode(content)) {
    newElement = content;
  }
  if (!newElement) return;
  element.parentNode.insertBefore(newElement, element.nextSibling);
}

function append(element: HTMLElement, content: any): void {
  var newElement = null;
  if (typeof content === "string") {
    newElement = createDOMFromString(content);
  } else if (isDOMNode(content)) {
    newElement = content;
  }
  if (!newElement) return;
  element.appendChild(newElement);
}

function before(element: HTMLElement, content: any): void {
  var newElement = null;
  if (typeof content === "string") {
    newElement = createDOMFromString(content);
  } else if (isDOMNode(content)) {
    newElement = content;
  }
  if (!newElement) return;
  element.parentNode.insertBefore(newElement, element);
}

function children(element: HTMLElement): HTMLCollection {
  // Note: Internet Explorer 6, 7 and 8 supported it, but erroneously includes Comment nodes.
  return element.children;
}

function clone(element: Element): Node {
  return element.cloneNode(true);
}

function html(element: Element, domString: string): string {
  if (domString) {
    element.innerHTML = domString;
  }
  return element.innerHTML;
}

function id(): Array<HTMLElement> {
  var argLength = arguments.length;
  if (argLength === 0) throw Error("No id name provided.");
  var result = [];
  for (var i = 0; i < argLength; i++) {
    var thisArg = arguments[i];
    result.push(
      typeof thisArg === "string" ? document.getElementById(thisArg) : thisArg
    );
  }
  return argLength > 1 ? result : result[0];
}

function tag(tagName: string): HTMLCollection | Array<Element> {
  var newArr;
  var allElements = document.getElementsByTagName(tagName);
  if (tagName === "*") {
    newArr = [];
    for (var n = allElements.length - 1; n >= 0; n--) {
      if (allElements[n].nodeType == 1) {
        newArr.push(allElements[n]);
      }
    }
  }
  return newArr ? newArr : allElements;
}

function cssClass(
  classname: string,
  parentNode: Document | Element
): HTMLCollection | Array<Element> | NodeList {
  parentNode = parentNode || document;
  if (document.getElementsByClassName)
    return parentNode.getElementsByClassName(classname);
  var classnameArr = classname.replace(/^\s+|\s+$/g, "").split(/\s+/);
  if (document.querySelectorAll) {
    classname = "." + classnameArr.join(".");
    return parentNode.querySelectorAll(classname);
  }
  var allTags = parentNode.getElementsByTagName("*");
  var nodes = [];
  if (allTags.length) {
    tagLoop: for (var i = 0; i < allTags.length; i++) {
      var tmpTag = allTags[i];
      var tmpClass = tmpTag.className;
      if (!tmpClass) continue tagLoop;
      if (tmpClass === classname) {
        nodes.push(tmpTag);
        continue tagLoop;
      }
      matchLoop: for (var j = 0; j < classnameArr.length; j++) {
        var patt = new RegExp("\\b" + classnameArr[j] + "\\b");
        if (!patt.test(tmpClass)) {
          continue tagLoop;
        }
      }
      nodes.push(tmpTag);
    }
  }
  return nodes;
}

function empty(element: Element): void {
  element.innerHTML = "";
}

function filterNode<Type>(
  domList: Array<Type>,
  filterCondition: any
): Array<Type> {
  var filterFn: any = function () {
    return false;
  };
  if (typeof filterCondition === "string") {
    filterFn = function (element: ElementWithLegacy) {
      return matchesSelector(element, filterCondition);
    };
  } else if (typeof filterCondition === "function") {
    filterFn = filterCondition;
  }
  return Array.prototype.filter.call(domList, filterFn);
}

function findNode(
  parentNode: Document | Element | DocumentFragment,
  selector: string
): NodeList {
  return parentNode.querySelectorAll(selector);
}

function matchesSelector(element: ElementWithLegacy, selector: string) {
  if (element.matches) {
    return element.matches(selector);
  } else if (element.matchesSelector) {
    return element.matchesSelector(selector);
  } else if (element.msMatchesSelector) {
    return element.msMatchesSelector(selector);
  } else if (element.mozMatchesSelector) {
    return element.mozMatchesSelector(selector);
  } else if (element.webkitMatchesSelector) {
    return element.webkitMatchesSelector(selector);
  } else {
    throw new Error("Not supported.");
  }
}

function contains(parentNode: Node, childNode: Node): boolean {
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

function offsetParent(element: HTMLElement): HTMLElement {
  var parent = element.offsetParent as HTMLElement;
  while (parent && css(parent, "position") === "static") {
    parent = parent.offsetParent as HTMLElement;
  }
  return parent || document.body;
}

function parent(element: Node): Node | null {
  var parentNode = element.parentNode;
  return parentNode && parentNode.nodeType !== 11 ? parentNode : null;
}

function prepend(parentNode: HTMLElement, content: string | Node): void {
  var newElement = null;
  if (typeof content === "string") {
    newElement = createDOMFromString(content);
  } else if (isDOMNode(content)) {
    newElement = content;
  }
  if (!newElement) return;
  parentNode.insertBefore(newElement, parentNode.firstChild);
}

function remove(element: HTMLElement): void {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

function siblings(element: HTMLElement): Array<Node> {
  var arr = [];
  var parent = element.parentNode;
  var node = parent.firstChild;
  while (node) {
    if (node.nodeType === 1 && node !== element) {
      arr.push(node);
    }
    node = node.nextSibling;
  }
  return arr;
}

function text(element: HTMLElement): string;
function text(element: HTMLElement, newText?: string) {
  if (newText === undefined) {
    return typeof element.textContent === "string"
      ? element.textContent
      : element.innerText;
  } else if (typeof newText === "string") {
    if (typeof element.textContent === "string") {
      element.textContent = newText;
    } else {
      element.innerText = newText;
    }
  }
}

const filter = filterNode;
const find = findNode;
export {
  after,
  append,
  before,
  children,
  clone,
  empty,
  filter,
  find,
  html,
  id,
  tag,
  cssClass,
  matchesSelector,
  contains,
  offsetParent,
  parent,
  prepend,
  remove,
  siblings,
  text,
};
