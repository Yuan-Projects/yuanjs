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
  
  context("Cross domain Test", function() {
    //this.timeout(15000);
    it('Cross domain GET test', function(done) {
      yuanjs.ajax({
        url: 'http://192.168.2.102/projects/yuanjs/test/crossdomain.php',
        type: 'GET',
        crossDomain: true,
        success: function(data) {
          catchError(function(){
            expect(data).to.equal("PHP");
          }, done);
        },
        error: function() {
          throw new Error('Should be failed');
        }
      });
    });
  });
  
  context('Load Script Tests', function() {
    // Suppress global leak errors in mocha
    mocha.setup({globals: ['external']});
    it('Should load a javascript file successfully', function(done) {
      var fileSrc = 'external.js';
      yuanjs.loadScript(fileSrc, function(){
        done();
      }, function(){
        throw new Error('Load failed');
      });
    });
    
    it('Should failed to load a file that does not exist', function(done) {
      var fileSrc = './nonexist.js';
      yuanjs.loadScript(fileSrc, function(){
        catchError(function(){
          throw new Error('Loaded succesfully.');  
        }, done);
      }, function(){
        done();
      });
    });
    
  });
  
});

describe("The DOM Events tests", function(){
  context('Browser Events Tests', function() {
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

describe("Selectors tests", function(){
  context('The matchesSelector() function', function() {
    it("Works on the body tag", function(done) {
      catchError(function(){
        expect(yuanjs.matchesSelector(document.body, 'body')).to.be(true);
      }, done);
    });
  });
  
  context('The contains() function', function() {
    it("The document contains the body element", function(done) {
      catchError(function(){
        expect(yuanjs.contains(document.documentElement, document.body)).to.be(true);
      }, done);
    });
  });
  
  context('The cssClass() function', function() {
    it("Get all elements with a class containing one class name", function(done) {
      catchError(function(){
        expect(yuanjs.cssClass("cls1").length).to.be(1);
      }, done);
    });
    
    it("Get all elements with a class containing two class names", function(done) {
      catchError(function(){
        expect(yuanjs.cssClass("cls1 cls2").length).to.be(1);
      }, done);
    });
  });
  
  context('The text() function', function() {
    it("Get the inner text of a div", function(done) {
      catchError(function(){
        expect(yuanjs.text(document.getElementById('testDiv'))).to.equal("The default text");
      }, done);
    });
    
    it("Set the inner text of a div", function(done) {
      catchError(function(){
        var theDiv = document.getElementById('testDiv');
        yuanjs.text(theDiv, "The new string");
        expect(yuanjs.text(theDiv)).to.equal("The new string");
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