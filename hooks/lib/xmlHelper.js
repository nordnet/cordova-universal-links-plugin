(function() {

  var fs = require('fs'),
    xml2js = require('xml2js');

  module.exports = XmlHelper;

  function XmlHelper() {
  }

  XmlHelper.prototype.readXmlAsJson = function(filePath) {
    var xmlData = null;
    var parsedData = null;

    try {
      xmlData = fs.readFileSync(filePath);
      var xmlParser = new xml2js.Parser();
      xmlParser.parseString(xmlData, function(err, data) {
        if (data) {
          parsedData = data;
        }
      });
    } catch (err) {
      console.log(err);
    }

    return parsedData;
  }

  XmlHelper.prototype.writeJsonAsXml = function(jsData, filePath) {
    var xmlBuilder = new xml2js.Builder();
    var changedXmlData = xmlBuilder.buildObject(jsData);
    fs.writeFileSync(filePath, changedXmlData);
  }

})();
