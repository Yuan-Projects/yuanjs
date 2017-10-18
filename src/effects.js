  function fadeIn(element, duration, complete) {
    var duration = isNaN(duration) ? 400 : parseInt(duration);
    var opacity = 0;
    var last = (new Date()).valueOf();
    var now = null;
    //element.style.display = 'block'; // TODO: show the element first if it's hidden
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

  yuanjs.fadeIn = fadeIn;