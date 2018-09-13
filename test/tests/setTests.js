describe("Class Set tests", function(){
  it("Class Set is defined", function() {
    expect(typeof yuanjs.Set).to.equal('function');
  });


  context('Set.prototype.constructor Tests', function() {
    it("Set.prototype.constructor is defined and is of function type.", function() {
      expect(yuanjs.Set.prototype.constructor).to.be.a('function');
    });
    it("Set.prototype.constructor is the Set function by default", function() {
      expect(yuanjs.Set.prototype.constructor).to.be(yuanjs.Set);
    });
    it("Use the constructor to create an instance", function() {
      var instance = new yuanjs.Set([1, 2, 3, 4, 5]);
      expect(instance.size()).to.equal(5);
    });
    it("The return value should be a new Set object", function() {
      var instance = new yuanjs.Set([1, 2, 3, 4, 5]);
      expect(instance).to.be.a(yuanjs.Set);
    });
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

    it("The second parameter of forEach should be use as `this` when executing callback", function() {
      function logSetElements(value1, value2, set) {
        expect(this.a).to.equal('1');
      }
      var set1 = new yuanjs.Set();
      var obj = {
        a: '1'
      };
      set1.add('foo');
      set1.forEach(logSetElements, obj);
    });

  });


  context('Set.prototype.has Tests', function() {
    it("Set.prototype.has is defined and is of function type.", function() {
      expect(yuanjs.Set.prototype.has).to.be.a('function');
    });
    it("Set([1, 2, 3, 4, 5]) has 1", function() {
      var set1 = new yuanjs.Set([1, 2, 3, 4, 5]);
      expect(set1.has(1)).to.be(true);
    });
    it("Set([1, 2, 3, 4, 5]) does not have 6", function() {
      var set1 = new yuanjs.Set([1, 2, 3, 4, 5]);
      expect(set1.has(6)).to.be(false);
    });
  });


  context('Set.prototype.keys Tests', function() {
    it("Set.prototype.keys is defined and is of function type.", function() {
      expect(yuanjs.Set.prototype.keys).to.be.a('function');
    });
    it("Shoud be the same function as the values() function", function() {
      expect(yuanjs.Set.prototype.keys).to.be(yuanjs.Set.prototype.values);
    });
  });

  context('Set.prototype.values Tests', function() {
    it("Set.prototype.values is defined and is of function type.", function() {
      expect(yuanjs.Set.prototype.values).to.be.a('function');
    });
    it("Should return a new array that contains the values for each element in the Set object in insertion order", function() {
      var set1 = new yuanjs.Set();
      set1.add(42);
      set1.add('forty two');
      var arr = set1.values();
      expect(arr).to.be.an('array');
      expect(arr[0]).to.be(42);
      expect(arr[1]).to.be('forty two');
    });
  });

  /** Static Methods **/

  context('Set.isSuperset Tests', function() {
    it('Set.isSuperset is defined', function() {
      expect(yuanjs.Set.isSuperset).to.be.a('function');
    });
    it('Set([1, 2, 3, 4]) is super set of Set([2, 3])', function() {
      var setA = new yuanjs.Set([1, 2, 3, 4]),
          setB = new yuanjs.Set([2, 3]);
      expect(yuanjs.Set.isSuperset(setA, setB)).to.be(true);
    });
    it('Set([1, 2, 3, 4]) is not super set of Set([2, 5])', function() {
      var setA = new yuanjs.Set([1, 2, 3, 4]),
          setB = new yuanjs.Set([2, 5]);
      expect(yuanjs.Set.isSuperset(setA, setB)).to.be(false);
    });
  });

  context('Set.union Tests', function() {
    it('Set.union is defined', function() {
      expect(yuanjs.Set.union).to.be.a('function');
    });
    it('Set([1, 2, 3, 4]) union Set([3, 4, 5, 6]) yields to Set([1, 2, 3, 4, 5, 6])', function() {
      var setA = new Set([1, 2, 3, 4]),
          setB = new Set([3, 4, 5, 6]),
          setC = yuanjs.Set.union(setA, setB);
      expect(setC.values()).to.eql([1, 2, 3, 4, 5, 6]);
    });
  });


  context('Set.intersection Tests', function() {
    it('Set.intersection is defined', function() {
      expect(yuanjs.Set.intersection).to.be.a('function');
    });
    it('Set([1, 2, 3, 4]) intersection Set([3, 4, 5, 6]) yields to Set([3, 4])', function() {
      var setA = new Set([1, 2, 3, 4]),
          setB = new Set([3, 4, 5, 6]),
          setC = yuanjs.Set.intersection(setA, setB);
      expect(setC.values()).to.eql([3, 4]);
    });
  });


  context('Set.difference Tests', function() {
    it('Set.difference is defined', function() {
      expect(yuanjs.Set.difference).to.be.a('function');
    });
    it('Set([1, 2, 3, 4]) difference Set([3, 4, 5, 6]) yields to Set([1, 2])', function() {
      var setA = new Set([1, 2, 3, 4]),
          setB = new Set([3, 4, 5, 6]),
          setC = yuanjs.Set.difference(setA, setB);
      expect(setC.values()).to.eql([1, 2]);
    });
  });

});