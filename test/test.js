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
    
    it('Should works fine with a URL containing a question mark', function(done) {
      yuanjs.ajax({
        url: 'test.json?v=1',
        success: function(data) {
          done();
        },
        error: function(xhrStatus, xhr) {
          throw new Error(xhrStatus);
        }
      });
    });

    it('Should works fine with a URL containing a question mark and the data parameter', function(done) {
      yuanjs.ajax({
        url: 'getJSON.php?v=1',
        data: {a:1, b:2},
        dataType: "json",
        success: function(data) {
          catchError(function(){
            expect(data).to.eql({v: 1, a: 1, b: 2});
          }, done);
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
    
    it('Should fail when sendding request to a URL that does not exist', function(done) {
      yuanjs.ajax({
        url: 'nonexist.php',
        type: 'POST',
        data: {
          name: "kang",
          description: "a web developer"
        },
        success: function(data) {
          throw new Error("This request should fail");
          
        },
        error: function(xhrStatus, xhr) {
          catchError(function(){
            expect(xhrStatus).to.equal(404);
          }, done);
        }
      });
    });
    
  });
  
});

describe("The DOM Events tests", function(){
  context('HTTP Post Tests', function() {
    it("The documentReady function test 1", function(done) {
      yuanjs.documentReady(function(){
        done();
      });
    });
    it("The documentReady function test 2", function(done) {
      yuanjs.documentReady(function(){
        done();
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