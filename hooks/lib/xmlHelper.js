/*
Small helper class to read/write from/to xml file.
*/
(function() {

  var fs = require('fs'),
    xml2js = require('xml2js');

  module.exports = XmlHelper;

  /*
   * Constructor.
   */
  function XmlHelper() {}

  /**
   * Read data from the xml file as JSON object.
   *
   * @param {String} filePath - absolute path to xml file
   * @return {Object} JSON object with the contents of the xml file
   */
  XmlHelper.prototype.readXmlAsJson = function(filePath) {
    var xmlData,
      xmlParser,
      parsedData;

    try {
      xmlData = fs.readFileSync(filePath);
      xmlParser = new xml2js.Parser();
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

  /**
   * Write JSON object as xml into the specified file.
   *
   * @param {Object} jsData - JSON object to write
   * @param {String} filePath - path to the xml file where data should be saved
   * @return {boolean} true - if data saved to file; false - otherwise
   */
  XmlHelper.prototype.writeJsonAsXml = function(jsData, filePath) {
    var xmlBuilder = new xml2js.Builder(),
      changedXmlData = xmlBuilder.buildObject(jsData),
      isSaved = true;

    try {
      fs.writeFileSync(filePath, changedXmlData);
    } catch (err) {
      console.log(err);
      isSaved = false;
    }

    return isSaved;
  }

})();
