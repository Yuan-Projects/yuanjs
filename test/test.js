describe("The Ajax Feature Tests", function() {
  describe("HTTP Get Test", function() {
    it('Should get the content of test.json without error', function(done) {
      yuanjs.ajax({
        url: 'test.json',
        success: function(data) {
          done();
        },
        error: function(xhrStatus, xhr) {
          throw new Error(xhrStatus);
        }
      });
    });
  });
  
  // POST Tests
  context('HTTP Post Tests', function() {
    it('Should send the correct payload data', function(done) {
      yuanjs.ajax({
        url: 'post.php',
        type: 'POST',
        data: {
          name: "kang",
          description: "a web developer"
        },
        success: function(data) {
          catchError(function() {
            expect(data.name).to.equal("kang");
            expect(data.description).to.equal("a web developer");
          }, done);
        },
        error: function(xhrStatus, xhr) {
          throw new Error(xhrStatus);
        }
      });
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