describe("Type validation tests", function(){
  // Part 1. isFunction() 
  describe('The isFunction() Test', function() {
    // Native functions
    it('Native functions tests', function() {
      expect(yuanjs.isFunction(window.alert)).to.be(true);
      expect(yuanjs.isFunction(document.getElementById)).to.be(true);
    });
    
    // Custom functions
    it('Custom functions tests', function() {
      function myfunction(){}
      var fn = function(){};
      var obj = {
        cb: function(){}
      };
      expect(yuanjs.isFunction(myfunction)).to.be(true);
      expect(yuanjs.isFunction(fn)).to.be(true);
      expect(yuanjs.isFunction(obj.cb)).to.be(true);
    });
    
    it('undefined should not be a function', function() {
      var undef;
      expect(yuanjs.isFunction(undef)).to.be(false);
    });
    
    it('null should not be type of function', function() {
      expect(yuanjs.isFunction(null)).to.be(false);
    });
    
    it('Boolean should not be type of function', function() {
      expect(yuanjs.isFunction(true)).to.be(false);
      expect(yuanjs.isFunction(false)).to.be(false);
    });
    
    it('An array is not a function', function() {
      var arr = [];
      expect(yuanjs.isFunction(arr)).to.be(false);
    });
    
    it('A regular expression is not a function', function() {
      var regexp = /[a-z]+/;
      expect(yuanjs.isFunction(regexp)).to.be(false);
    });
    
    it('A number is not a function', function() {
      expect(yuanjs.isFunction(1)).to.be(false);
    });
    
    it('A string is not a function', function() {
      expect(yuanjs.isFunction("1")).to.be(false);
    });
    
    it('An object is not a function', function() {
      expect(yuanjs.isFunction({})).to.be(false);
    });
    
  });
});