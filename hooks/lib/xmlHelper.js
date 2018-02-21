(function () {
  // properties
  'use strict';
  var fs = require('fs');
  var xml2js = require('xml2js');

  // entry
  module.exports = {
    readXmlAsJson: readXmlAsJson,
    writeJsonAsXml: writeJsonAsXml
  };

  // read from xml file
  function readXmlAsJson (file) {
    var xmlData;
    var xmlParser;
    var parsedData;

    try {
      xmlData = fs.readFileSync(file);
      xmlParser = new xml2js.Parser();
      xmlParser.parseString(xmlData, function (err, data) {
        if (!err && data) {
          parsedData = data;
        }
      })
    } catch (err) {
      throw new Error('Cannot write file ' + file);
    }

    return parsedData;
  }

  // write to xml file
  function writeJsonAsXml (file, content, options) {
    var xmlBuilder = new xml2js.Builder(options);
    var changedXmlData = xmlBuilder.buildObject(content);
    var isSaved = true;

    try {
      fs.writeFileSync(file, changedXmlData)
    } catch (err) {
      isSaved = false;
      throw new Error('Cannot write file ' + file);
    }

    return isSaved;
  }
})();
