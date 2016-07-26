/*
Small helper class to read/write from/to xml file.
*/

var fs = require('fs');
var xml2js = require('xml2js');

module.exports = {
  readXmlAsJson: readXmlAsJson,
  writeJsonAsXml: writeJsonAsXml
};

/**
 * Read data from the xml file as JSON object.
 *
 * @param {String} filePath - absolute path to xml file
 * @return {Object} JSON object with the contents of the xml file
 */
function readXmlAsJson(filePath) {
  var xmlData;
  var xmlParser;
  var parsedData;

  try {
    xmlData = fs.readFileSync(filePath, 'utf8');
    xmlParser = new xml2js.Parser();
    xmlParser.parseString(xmlData, function(err, data) {
      if (data) {
        parsedData = data;
      }
    });
  } catch (err) {}

  return parsedData;
}

/**
 * Write JSON object as xml into the specified file.
 *
 * @param {Object} jsData - JSON object to write
 * @param {String} filePath - path to the xml file where data should be saved
 * @return {boolean} true - if data saved to file; false - otherwise
 */
function writeJsonAsXml(jsData, filePath, options) {
  var xmlBuilder = new xml2js.Builder(options);
  var changedXmlData = xmlBuilder.buildObject(jsData);
  var isSaved = true;

  try {
    fs.writeFileSync(filePath, changedXmlData, 'utf8');
  } catch (err) {
    console.log(err);
    isSaved = false;
  }

  return isSaved;
}
