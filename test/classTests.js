describe("Class Tests", function() {
  it("The function createClass() is defined.", function() {
    expect(typeof yuanjs.createClass).to.be('function');
  });
  it("The function createClass() receives arguments properly.", function() {
    var myConstructor = function(name, age) {
      this.name = name;
      this.age = age;
    };
    var props = {
      speak: function() {
        return 'My name is ' + this.name + ', I am ' + this.age;
      }
    };
    var staticProps = {
      saySomething: function() {
        return 'Hi';
      }
    };
    var Myfunc = yuanjs.createClass(myConstructor, props, staticProps);
    var instance = new Myfunc('Tom', 11);
    expect(instance.speak()).to.be("My name is Tom, I am 11");
    expect(Myfunc.saySomething()).to.be("Hi");
  });
});