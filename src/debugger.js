
  function log() {
    try {
      console.log.apply(console, arguments);
    } catch (e) {
      try {
	opera.postError.apply(opera, arguments);
      } catch(err) {
	alert(Array.prototype.join.call(arguments, " "));
      }
    }
  }
  yuanjs.log = log;
