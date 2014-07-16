  // Poly fill for IE 6
  if (!window.console) {
    window.console = {
      log: function() {
        var args = Array.prototype.slice.call(arguments);
        var str = args.join("\n");
        alert(str);
      }
    };
  }
  yuanjs.console = window.console;
