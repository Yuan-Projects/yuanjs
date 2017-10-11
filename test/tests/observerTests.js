describe("Observer tests", function(){

  it("The observer functions are ready to use", function() {
    expect(yuanjs.on).to.be.ok();
    expect(yuanjs.off).to.be.ok();
    expect(yuanjs.trigger).to.be.ok();
  });

  it("Subscribe Tests", function(done) {
    var result = '';
    var fun1 = function() {
      result += 'function1';
    };
    var fun2 = function() {
      result += 'function2';
    };
    var fun3 = function() {
      expect(result).to.equal("function1function2");
      done();
    };
    yuanjs.on('test1', fun1);
    yuanjs.on('test1', fun2);
    yuanjs.on('test1', fun3);
    yuanjs.trigger('test1');
  });

  it("off() tests", function(done) {
    var timer = null;
    var result = '';
    var failFunc = function() {
      expect().fail("Shouldn't trigger a function that has been unsubscribed");
      window.clearTimeout(timer);
      done();
    };
    var fun1 = function() {
      result += 'function1';
      failFunc();
    };
    var fun2 = function() {
      result += 'function2';
      failFunc();
    };
    var fun3 = function() {
      failFunc();
    };
    yuanjs.on('test2', fun1);
    yuanjs.on('test2', fun2);
    yuanjs.on('test2', fun3);
    yuanjs.off('test2', fun1);
    yuanjs.off('test2', fun2);
    yuanjs.off('test2', fun3);
    yuanjs.trigger('test2');
    timer = setTimeout(function() {
      done();
    }, 150);
  });

});