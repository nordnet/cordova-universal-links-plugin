(function() {

  var path = require('path'),
    fs = require('fs'),
    xml2js = require('xml2js'),
    ConfigXmlHelper = require('./configXmlHelper.js'),
    DEFAULT_SCHEME = 'http';

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

    var xmlHostList = ulXmlPreferences[0]['host'];
    if (xmlHostList == null || xmlHostList.length == 0) {
      console.warn('No host is specified in the config.xml. Universal Links plugin is not going to work.');
      return null;
    }

    return constructPreferencesObject(xmlHostList);
  }

  function constructPreferencesObject(xmlPreferences) {
    var ulObject = [];

    xmlPreferences.forEach(function(element) {
      var host = {
        scheme: DEFAULT_SCHEME,
        name: '',
        paths: []
      };
      var hostProperties = element['$'];
      if (hostProperties == null || hostProperties.length == 0) {
        return;
      }

      host.name = hostProperties.name;
      if (hostProperties['scheme'] != null) {
        host.scheme = hostProperties.scheme;
      }

      if (element['path'] != null) {
        element.path.some(function (pathElement) {
          var url = pathElement['$']['url'];
          if (url === '*') {
            host.paths = ['*'];
            return true;
          }

          host.paths.push(pathElement['$']['url']);
        });
      } else {
        host.paths = ['*'];
      }

      ulObject.push(host);
    });

    return ulObject;
  }

})();
