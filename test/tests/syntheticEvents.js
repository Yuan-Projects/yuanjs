describe("Custom Events tests", function(){
  
  context('The CustomEvents function Tests', function() {
    it("Create a new event with the CustomEvent instructor", function(done) {
      catchError(function(){
        var tmp = new yuanjs.CustomEvent('build');
        expect(tmp).to.be.ok();
      }, done);
    });
  });
  
  context('The dispatchSyntheticEvent function Tests', function() {
    it("Dispatch a custom event", function(done) {
      catchError(function(){
        var event = new yuanjs.CustomEvent('click');
        var elem = document.getElementById("syntheticTest");
        if (elem.addEventListener) {
          elem.addEventListener('click', function(e){
            done();
          }, false);
        } else {
          elem.onclick = function(e) {
            done();
          };
        }
        var t = yuanjs.dispatchCustomEvent;
        t(elem, event);
      }, done);
    });
    
    it("Dispatch a custom event with custom data", function(done) {
      catchError(function(){
        var event = new yuanjs.CustomEvent('mycustomeevent', {
          detail: {
            x1: 5
          }
        });
        var elem = document.getElementById("syntheticTest");
        if (elem.addEventListener) {
          elem.addEventListener('mycustomeevent', function(e){
            expect(e.detail.x1).to.equal(5);
          }, false);
        } else {
          elem.onmycustomeevent = function() {
            expect(window.event.x1).to.equal(5);
          };
        }
        var t = yuanjs.dispatchCustomEvent;
        t(elem, event);
      }, done);
    });
    
  });
  
});

/**
 * Let Mocha catch exceptions that are thrown within a callback.
 * http://stackoverflow.com/questions/19914810/20377340
 */
function catchError(fn, done) {
  try {
    fn();
    done();
  } catch(e) {
    done(e);
  }
}