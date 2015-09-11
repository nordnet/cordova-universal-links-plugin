(function() {

  var path = require('path'),
    fs = require('fs'),
    xml2js = require('xml2js'),
    ConfigXmlHelper = require('./configXmlHelper.js');

  module.exports = {
    readPreferences: readPreferences
  };

  function readPreferences(cordovaContext) {
    var configXml = new ConfigXmlHelper(cordovaContext).read();
    if (configXml == null) {
      console.warn('config.xml not found! Please, check that it exist\'s in your project\'s root directory.');
      return null;
    }

    var ulXmlPreferences = configXml.widget['universal-links'];
    if (ulXmlPreferences == null || ulXmlPreferences.length == 0) {
      console.warn('<universal-links> tag is not set in the config.xml. Universal Links plugin is not going to work.');
      return null;
    }

    var xmlDomainList = ulXmlPreferences[0]['domain'];
    if (xmlDomainList == null || xmlDomainList.length == 0) {
      console.warn('No domain is specified in the config.xml. Universal Links plugin is not going to work.');
      return null;
    }

    return constructPreferencesObject(xmlDomainList);
  }

  function constructPreferencesObject(xmlPreferences) {
    var ulObject = [];

    xmlPreferences.forEach(function(element) {
      var domain = {
        scheme: 'http',
        name: '',
        paths: []
      };
      var domainProperties = element['$'];
      if (domainProperties == null || domainProperties.length == 0) {
        return;
      }

      domain.name = domainProperties.name;
      if (domainProperties['scheme'] != null) {
        domain.scheme = domainProperties.scheme;
      }

      if (element['path'] != null) {
        element.path.some(function (pathElement) {
          var url = pathElement['$']['url'];
          if (url === '*') {
            domain.paths = [];
            return true;
          }

          domain.paths.push(pathElement['$']['url']);
        });
      }

      ulObject.push(domain);
    });

    return ulObject;
  }

})();
