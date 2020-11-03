function getCSSPath(element, ignoreID) {
  var names = [];
  while (element.parentNode) {
    if (element.id && !ignoreID) {
      names.unshift('#' + element.id);
      break;
    } else {
      if (element === document.body) {
        names.unshift('body');
        break;
      } else {
        for (var c = 1, e = element; e.previousElementSibling; e = e.previousElementSibling, c++);
        names.unshift(element.tagName.toLowerCase() + ":nth-child(" + c + ")");
      }
      element = element.parentNode;
    }
  }
  return names.join(" > ");
}
