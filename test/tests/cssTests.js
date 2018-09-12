describe("CSS tests", function(){

  context('addClass() function Tests', function() {
    it("#1", function() {
      var dom = document.createElement('p');
      dom.className = "class1";
      yuanjs.addClass(dom, 'class2');
      expect(dom.className).to.equal("class1 class2");
    });

    it("#2", function() {
      var dom = document.createElement('p');
      dom.className = "class1 class2";
      yuanjs.addClass(dom, 'class2');
      expect(dom.className).to.equal("class1 class2");
    });
  });

  it("hasClass() function", function() {
    var dom = document.createElement('p');
    dom.className = "class1";
    expect(yuanjs.hasClass(dom, "class1")).to.be.ok();
    expect(yuanjs.hasClass(dom, "class2")).to.not.be.ok();

    var dom2 = document.createElement('p');
    dom2.className = "class1 class2";
    expect(yuanjs.hasClass(dom2, "class1")).to.be.ok();
    expect(yuanjs.hasClass(dom2, "class2")).to.be.ok();
  });

  it("RemoveClass() function", function() {
    yuanjs.removeClass(document.getElementById('cssTestDiv'), 'cls3');
    expect(document.getElementById('cssTestDiv').className).to.equal('cls1 cls2');
  });

  it("ToggleClass() function", function() {
    yuanjs.toggleClass(document.getElementById('toggleClassDiv'), 'toggle1');
    expect(document.getElementById('toggleClassDiv').className).to.equal('toggle2');
    yuanjs.toggleClass(document.getElementById('toggleClassDiv'), 'toggle1');
    expect(document.getElementById('toggleClassDiv').className).to.equal('toggle2 toggle1');

  });

});