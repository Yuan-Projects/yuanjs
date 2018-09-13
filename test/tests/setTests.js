describe("Class Set tests", function(){
  it("Class Set is defined", function() {
    expect(typeof yuanjs.Set).to.equal('function');
  });

  context('Set.prototype.size Tests', function() {
    it("Set.prototype.size is defined and is of function type.", function() {
      expect(yuanjs.Set.prototype.size).to.be.a('function');
    });
    it("Set.prototype.size() defaults to 0", function() {
      var newInstance = new yuanjs.Set();
      expect(newInstance.size()).to.equal(0);
    });
    it("Returns the correct size", function() {
      var set1 = new yuanjs.Set();
      var object1 = new Object();

      set1.add(42);
      set1.add('forty two');
      set1.add('forty two');
      set1.add(object1);

      expect(set1.size()).to.equal(3);

      set1.delete(42);
      expect(set1.size()).to.equal(2);

      set1.clear();
      expect(set1.size()).to.equal(0);

      set1.add(9);
      expect(set1.size()).to.equal(1);
    });
  });

  context('Set.prototype.add Tests', function() {
    it("Set.prototype.add is defined and is of function type.", function() {
      expect(yuanjs.Set.prototype.add).to.be.a('function');
    });
    it("Should append a new element correctly", function() {
      var set1 = new yuanjs.Set();
      var obj = {
        a: 1
      };
      expect(set1.size()).to.equal(0);
      set1.add(42);
      expect(set1.size()).to.equal(1);
      set1.add(13);
      expect(set1.size()).to.equal(2);
      set1.add(obj);
      expect(set1.size()).to.equal(3);
    });
    it("Should not append a new element if already in the Set", function() {
      var set1 = new yuanjs.Set();
      set1.add(42);
      set1.add(42);
      set1.add(13);

      expect(set1.size()).to.equal(2);
    });
    it("Returns the Set object", function() {
      var set1 = new yuanjs.Set();
      var returnValue = set1.add(42);
      expect(returnValue).to.be.a(yuanjs.Set);
    });

  });

  context('Set.prototype.clear Tests', function() {
    it("Set.prototype.clear is defined and is of function type.", function() {
      expect(yuanjs.Set.prototype.clear).to.be.a('function');
    });
    it("Should remove all elements correctly", function() {
      var set1 = new yuanjs.Set();
      set1.add(1);
      set1.add('foo');
      expect(set1.size()).to.equal(2);
      set1.clear();
      expect(set1.size()).to.equal(0);
    });
  });


  context('Set.prototype.delete Tests', function() {
    it("Set.prototype.delete is defined and is of function type.", function() {
      expect(yuanjs.Set.prototype.delete).to.be.a('function');
    });
    it("Should remove specific elements correctly", function() {
      var set1 = new yuanjs.Set();
      var obj = {
        a: 1
      };
      set1.add(1);
      set1.add('foo');
      set1.add(obj);
      expect(set1.size()).to.equal(3);
      set1.delete(1);
      expect(set1.size()).to.equal(2);
      set1.delete('foo');
      expect(set1.size()).to.equal(1);
      set1.delete(obj);
      expect(set1.size()).to.equal(0);
    });
  });

  context('Set.prototype.entries Tests', function() {
    it("Set.prototype.entries is defined and is of function type.", function() {
      expect(yuanjs.Set.prototype.entries).to.be.a('function');
    });
    it("Should return the correct array in insertion order", function() {
      var set1 = new yuanjs.Set();
      set1.add(42);
      set1.add('forty two');
      var arr = set1.entries();

      expect(arr[0][0]).to.be(42);
      expect(arr[0][1]).to.be(42);

      expect(arr[1][0]).to.be('forty two');
      expect(arr[1][1]).to.be('forty two');
    });
  });

  context('Set.prototype.forEach Tests', function() {
    it("Set.prototype.forEach is defined and is of function type.", function() {
      expect(yuanjs.Set.prototype.forEach).to.be.a('function');
    });
    it("Calls callbackFn once for each value present in the Set object, in insertion order", function() {
      var arr = [];
      function logSetElements(value1, value2, set) {
        arr.push('s[' + value1 + '] = ' + value2);
      }
      var set1 = new yuanjs.Set();
      set1.add('foo');
      set1.add('bar');
      set1.add(undefined);
      set1.forEach(logSetElements);
      expect(arr[0]).to.equal("s[foo] = foo");
      expect(arr[1]).to.equal("s[bar] = bar");
      expect(arr[2]).to.equal("s[undefined] = undefined");
    });

    it("The third parameter of the callback function should be the Set object", function() {
      function logSetElements(value1, value2, set) {
        expect(set).to.equal(set1);
      }
      var set1 = new yuanjs.Set();
      set1.add('foo');
      set1.forEach(logSetElements);
    });
  });

});