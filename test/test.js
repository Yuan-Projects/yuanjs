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
          if (data.name === "kang" && data.description === "a web developer") {
            done();
          } else {
            throw new Error("unexpected payload data");
          }
        },
        error: function(xhrStatus, xhr) {
          throw new Error(xhrStatus);
        }
      });
    });
  });
});