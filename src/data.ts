var cache: any = {},
  guidCounter = 1,
  expando = "data" + new Date().getTime();

function getData(elem: any) {
  var guid = elem[expando];
  if (!guid) {
    guid = elem[expando] = guidCounter++;
    cache[guid] = {};
  }
  return cache[guid];
}

function removeData(elem: any) {
  var guid = elem[expando];
  if (!guid) return;
  delete cache[guid];
  try {
    delete elem[expando];
  } catch (e) {
    if (elem.removeAttribute) {
      elem.removeAttribute(expando);
    }
  }
}

export { getData, removeData };
