console.log("Structure-ifying...");

var page = require('webpage').create(), 
    fs = require('fs');

// log in-page console messages
page.onConsoleMessage = function(msg) {
  console.log(msg);
};

// parse TOC structure
var url = "http://library.municode.com/toc.aspx?clientId=10620&checks=false";
page.open(url, function(status) {
  structure = page.evaluate(function() {
    // utils
    if (!Array.prototype.last) {
      Array.prototype.last = function() {
        return this[this.length - 1];
      };
    }

    // return value
    //// row format: { url: foo, label: bar, parentUrl: baz, parentLabel: boo } 
    var result = [];
    function addRow(td, parentTd) {
      var url = $(td).children()[0].href;
      var label = $(td).text().trim();
      if (parentTd) {
        result.push({
          url: url,
          label: label,
          parentUrl: $(parentTd).children()[0].href,
          parentLabel: $(parentTd).text().trim(),
        });
      } else {
        result.push({
          url: url,
          label: label,
          parentUrl: null,
          parentLabel: null,
        });
      }
    }

    var tds = $('.dxtl__B0');
    var numSpaces, prevNumSpaces = 0, prevTd, prevParentTds = [];
    $.each(tds, function(i, td) {
      numSpaces = $(td).closest("tr").children("td").length;
      if (numSpaces > prevNumSpaces) {
        // down one level
        //console.log('step down');
        if (prevTd === undefined) {
          console.log('root node:', $(td).text().trim());
          addRow(td);
          prevParentTds = [td];
        } else {
          prevParentTds.push(prevTd);
          console.log($(prevParentTds.last()).text().trim(), '>> parent of >>', $(td).text().trim());
          addRow(td, prevParentTds.last());
        }
        prevTd = td;
      } else if (numSpaces == prevNumSpaces) {
        // same level
        //console.log('bro');
        console.log($(prevParentTds.last()).text().trim(), '>> parent of >>', $(td).text().trim());
        prevTd = td;
        addRow(td, prevParentTds.last());
      } else {
        // up on level
        //console.log('step up');
        prevTd = td;
        prevParentTds.pop();
        console.log($(prevParentTds.last()).text().trim(), ">> parent of >>", $(td).text().trim());
        addRow(td, prevParentTds.last());
      }
      prevNumSpaces = numSpaces;
      //console.log(new Array(spaces.length).join("-"), $(td).text().trim());
    });
    return result;
  });
  fs.write("structure.json", JSON.stringify(structure), 'w');
  phantom.exit();
});
