describe("Core tests", function() {
  describe('The trim() function tests', function() {
    it('"   foo  " was trimed to "foo"', function() {
      expect(yuanjs.trim("   foo  ")).to.be('foo');
    });
  });
});
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
        url: 'getJSON.json?v=1',
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
        url: 'post.json',
        type: 'POST',
        data: {
          name: "kang",
          description: "a web developer"
        },
        success: function(data) {
          data = JSON.parse(data);
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
    it('Cross domain GET test', function(done) {
      yuanjs.ajax({
        url: 'http://127.0.0.1:8080/test.json',
        type: 'GET',
        crossDomain: true,
        success: function(data) {
          catchError(function(){
            expect(JSON.parse(data).author).to.equal("rainyjune");
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
  context('The after() function', function() {
    it('#1', function() {
      var div = document.getElementById('testDiv');
      yuanjs.after(div, '<div id="myaftertest1" style="display:none;">123</div>');
      var newElement = document.getElementById('myaftertest1');
      expect(newElement).to.be.ok();
      expect(newElement.innerHTML).to.equal('123');
      if (newElement) {
        newElement.parentNode.removeChild(newElement);
      }
    });
  });

  context('The append() function', function() {
    it('#1 Append a string', function() {
      var div = document.createElement('div');
      div.id = "testDivAppend";
      div.innerHTML = "Hello ";
      div.style.cssText = "display:none;";
      document.body.appendChild(div);
      yuanjs.append(div, '<div id="myaftertest1" style="display:none;">append</div>');
      var newElement = document.getElementById('myaftertest1');
      expect(newElement).to.be.ok();
      expect(newElement.innerHTML).to.equal('append');
      expect(div.textContent).to.equal('Hello append');
      if (newElement) {
        div.parentNode.removeChild(div);
      }
    });
    it('#2 Append a DOM', function() {
      var div = document.createElement('div');
      div.id = "testDivAppend1";
      div.innerHTML = "Hello ";
      div.style.cssText = "display:none;";
      document.body.appendChild(div);

      var newElement = document.createElement('div');
      newElement.innerHTML = 'append';
      newElement.id = 'myaftertest22';
      yuanjs.append(document.getElementById('testDivAppend1'), newElement);
      var eleParent = document.getElementById('testDivAppend1');
      var ele = document.getElementById('myaftertest22');
      expect(ele).to.be.ok();
      expect(ele.innerHTML).to.equal('append');
      expect(eleParent.textContent).to.equal('Hello append');
      if (eleParent) {
        eleParent.parentNode.removeChild(eleParent);
      }
    });
  });

  context('The before() function', function() {
    it("#1 String as content", function() {
      var div1 = document.getElementById('afterTestDiv');
      yuanjs.before(div1, '<div id="beforestringcontent"></div>');
      expect(div1.previousElementSibling.id).to.equal('beforestringcontent');
      document.body.removeChild(document.getElementById('beforestringcontent'));
    });

    it("#2 DOM as content", function() {
      var testDiv = document.getElementById('testDiv');
      yuanjs.before(testDiv, document.getElementById('afterTestDiv'));
      expect(testDiv.previousElementSibling.id).to.equal('afterTestDiv');
    });
  });

  context("The children() function", function() {
    it('#afterTestDiv has no children', function() {
      expect(yuanjs.children(document.getElementById('afterTestDiv')).length).to.equal(0);
    });
    it('#childrenTestDiv has 2 children', function() {
      expect(yuanjs.children(document.getElementById('childrenTestDiv')).length).to.equal(2);
    });
  });

  context("The clone() function", function() {
    it('Clone #childrenTestDiv', function() {
      var oldDiv = document.getElementById('childrenTestDiv');
      var newNode = yuanjs.clone(oldDiv);
      newNode.id = 'childrenTestDivNew';
      document.body.appendChild(newNode);

      var newDiv = document.getElementById('childrenTestDivNew');
      expect(newDiv.firstElementChild.innerHTML).to.equal('p1');
      newDiv.parentNode.removeChild(newDiv);
    });
  });

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
    it("div#childrenTestDiv does not contain the first script tags", function() {
      expect(yuanjs.contains(document.getElementById('childrenTestDiv'), document.getElementsByTagName('script')[0])).to.not.be.ok();
    });
  });

  context('The cssClass() function', function() {
    it("Get all elements with a class containing one class name", function(done) {
      catchError(function(){
        expect(yuanjs.cssClass("cls1").length).to.be(2);
      }, done);
    });

    it("Get all elements with a class containing two class names", function(done) {
      catchError(function(){
        expect(yuanjs.cssClass("cls1 cls2").length).to.be(2);
      }, done);
    });
  });

  context("The empty() function", function() {
    it("Empty #toBeEmptiedTestDiv", function() {
      var toBeEmptiedTestDiv = document.getElementById('toBeEmptiedTestDiv');
      yuanjs.empty(toBeEmptiedTestDiv);
      expect(toBeEmptiedTestDiv.innerHTML).to.equal('');
    });
  });

  context("The filter() function", function() {
    it('There is no one div with the id#nonexist', function() {
      var matches = yuanjs.filter(document.getElementsByTagName('div'), '#nonexist');
      expect(matches.length).to.equal(0);
    });

    it("Find the div with id#toBeEmptiedTestDiv", function() {
      var matches = yuanjs.filter(document.getElementsByTagName('div'), '#toBeEmptiedTestDiv');
      expect(matches.length).to.equal(1);
    });

    it("There are 3 divs with the hidden1 class name.", function() {
      var matches = yuanjs.filter(document.getElementsByTagName('div'), '.hidden1');
      expect(matches.length).to.equal(3);
    });

    it("There are 2 divs with the hidden1 class name and they are also not empty.", function() {
      var matches = yuanjs.filter(document.getElementsByTagName('div'), function(element){
        return element.innerHTML && element.className.indexOf('hidden1') > -1;
      });
      expect(matches.length).to.equal(2);
    });
  });

  context("The find() function", function() {
    it("Find div#childrenTestDiv on this page", function() {
      var ele = yuanjs.find(document.body, 'div#childrenTestDiv');
      expect(ele.length).to.equal(1);
    });

    it("Find all <p> in the div#childrenTestDiv", function() {
      var ele = yuanjs.find(document.getElementById('childrenTestDiv'), 'p');
      expect(ele.length).to.equal(1);
      expect(ele[0].innerHTML).to.equal('p1');
    });
  });


  context("The html() function", function() {
    it("Get the HTML content of #htmlFuncDiv", function() {
      var div = document.getElementById('htmlFuncDiv');
      expect(yuanjs.html(div)).to.equal('HTML <span>text</span>');
    });

    it("Set the HTML content of #htmlFuncDiv", function() {
      var div = document.getElementById('htmlFuncDiv');
      var str = '<p>Hello</p><h1>test</h1>';
      expect(yuanjs.html(div, str)).to.equal(str);
    });
  });

  context("The offsetParent() function", function() {
    it("#1", function() {
      expect(yuanjs.offsetParent(document.getElementsByClassName('item-a')[0])).to.equal(document.getElementsByClassName('item-ii')[0]);
    });
  });

  context("The parent() function", function() {
    it("The parent node of li.item-a should be ul.level-2", function() {
      expect(yuanjs.parent(document.getElementsByClassName('item-a')[0])).to.equal(document.getElementsByClassName('level-2')[0]);
    });
  });

  context("The prepend() function", function() {
    it("Prepend some text to an element", function() {
      var parentNode = document.getElementsByClassName('item-i')[0];
      yuanjs.prepend(parentNode, 'some text ');
      expect(parentNode.innerHTML).to.equal('some text I');
    });
    it("Prepend DOM element to an element", function() {
      var parentNode = document.getElementsByClassName('item-i')[0];
      var newNode = document.createElement('p');
      newNode.innerHTML = 'hello';
      yuanjs.prepend(parentNode, newNode);
      expect(parentNode.innerHTML).to.equal('<p>hello</p>some text I');
    });
  });

  context("The remove() function", function() {
    it("Remove an element from the document", function() {
      yuanjs.remove(document.getElementById('toBeRemovedDiv'));
      expect(document.getElementById('toBeRemovedDiv')).to.equal(null);
    });
  });

  context("The siblings() function", function() {
    it("There are two siblings for li.item-ii", function() {
      expect(yuanjs.siblings(document.getElementsByClassName('item-ii')[0]).length).to.equal(2);
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