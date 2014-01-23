var utils = require('utils'),
    fs = require('fs'),
    casper = require('casper').create({
      verbose: true,
      logLevel: 'debug',
      pageSettings: {
        loadImages: false,
      loadPlugins: false
      },
      clientScripts: []
    }),
    table = [];

// log console.log messages to stdout
casper.on("remote.message", function(message) {
  this.echo("[console.log] " + message);
});

// get top level links
function getLinks () {
  var links = $('a');
  return [].map.call(links, function(link) {
    return link.href;
  });
}

function onLink(link) {
  this.echo(link);
  this.thenOpen(link, function() {
    var row = {
      url: link,
      title: this.fetchText('title'),
      html: this.getHTML()
    };
    table.push(row);
  });
}

casper.start('http://library.municode.com/toc.aspx?clientId=10620&checks=false', function() {
    links = this.evaluate(getLinks);

    this.echo(links.length + ' links found');
    for (var i = 0, link; i < links.length; i++) {
      link = links[i];
      onLink.call(this, link);
    }
    });

casper.then(function() {
  fs.write("scrape.json", JSON.stringify(table), 'w');
});

casper.run();
