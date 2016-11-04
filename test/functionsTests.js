describe("Functions tests", function() {
  describe("The bind() function tests", function() {
    
    it('#1 Test without arguments', function() {
      var obj = {
        x: 5,
        cb: function() {
          return this.x;
        }
      };
      var obj2 = {
        x: 10
      };
      expect(yuanjs.bind(obj.cb, obj2)()).to.be(10);
    });
    
    it('#1 Test with arguments', function() {
      var obj1 = {
        my: 1,
        cb: function(x, y, z) {
          return x + y + z + this.my;
        }
      };
      var obj2 = {
        my: 55
      };
      expect(yuanjs.bind(obj1.cb, obj2, 1, 2, 3)()).to.be(61);
    });
  });
});