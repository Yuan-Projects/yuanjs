  /* Note: this module depends on css.js */

  function fadeIn(element, duration, complete) {
    var duration = isNaN(duration) ? 400 : parseInt(duration);
    var opacity = 0;
    var last = (new Date()).valueOf();
    var now = null;

    element.style.display = ''; // TODO: show the element first if it's hidden
    element.style.opacity = 0;


    var tick = function() {
      if (opacity < 1) {
        now = (new Date()).valueOf();
        opacity += (now - last) / duration;
        element.style.opacity = opacity > 1 ? 1 : opacity;
        last = now;
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(tick);
        } else {
          window.setTimeout(tick, 16);
        }
      } else {
        complete && complete();
      }
    };
    tick();
  }

  function actualDisplay(tagName) {
    var element = document.createElement(tagName);
    document.body.appendChild(element);
    var display = css(element, 'display');
    document.body.removeChild(element);
    return display;
  }

  function show(element) {
    // Remove the display:none rule if any.
    if (element.style.display === "none") {
      element.style.display = "";
    }
    if (css(element, "display") === "none") {
      element.style.display = actualDisplay(element.nodeName);
    }
  }

  function hide(element) {
    element.style.display = 'none';
  }

  function toggle(element) {
    if (css(element, "display") === "none") {
      show(element);
    } else {
      hide(element);
    }
  }

export {
  fadeIn,
  hide,
  show,
  toggle
};