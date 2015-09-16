/*
Write domains list into project entitlements file.
File name is: ProjectName.entitlements

TODO: clean up!
*/
(function() {

  //
  // add ProjectName/ProjectName.entitlements path to Build Settings -> Code Signing Entitlements

  var xml2js = require('xml2js'),
    path = require('path'),
    xmlHelper = require('../xmlHelper.js'),
    ConfigXmlHelper = require('../configXmlHelper.js'),
    context,
    projectRoot,
    projectName,
    entitlementsFilePath;

  module.exports = {
    generateAssociatedDomainsEntitlements: generateEntitlements
  };

  function generateEntitlements(cordovaContext, pluginPreferences) {
    context = cordovaContext;

    var currentEntitlements = readEntitlementsFile(),
      newEntitlements = injectPreferences(currentEntitlements, pluginPreferences);

    xmlHelper.writeJsonAsXml(newEntitlements, pathToEntitlementsFile(), {
      doctype: {
        pubID: '-//Apple//DTD PLIST 1.0//EN',
        sysID: 'http://www.apple.com/DTDs/PropertyList-1.0.dtd'
      }
    });
  }

  function pathToEntitlementsFile() {
    if (entitlementsFilePath === undefined) {
      entitlementsFilePath = path.join(getProjectRoot(), 'platforms', 'ios', getProjectName(), getProjectName() + '.entitlements');
    }

    return entitlementsFilePath;
  }

  function getProjectRoot() {
    return context.opts.projectRoot;
  }

  function getProjectName() {
    if (projectName === undefined) {
      var configXmlHelper = new ConfigXmlHelper(context);
      projectName = configXmlHelper.getProjectName();
    }

    return projectName;
  }

  function readEntitlementsFile() {
    var currentEntitlements = xmlHelper.readXmlAsJson(pathToEntitlementsFile());
    if (currentEntitlements != null) {
      return currentEntitlements;
    }

    // return default plist if it's not exist
    return {
      'plist': {
        '$': {
          'version': '1.0'
        },
        'dict': []
      }
    };
  }

  function injectPreferences(currentEntitlements, pluginPreferences) {
    var newEntitlements = currentEntitlements,
      dictIndex = indexOfAssosiatedDomainsDictionary(newEntitlements),
      content = generateAssociatedDomainsContent(pluginPreferences);

    if (dictIndex < 0) {
      newEntitlements['plist']['dict'].push(content);
    } else {
      newEntitlements['plist']['dict'][dictIndex] = content;
    }

    return newEntitlements;
  }

  function generateAssociatedDomainsContent(pluginPreferences) {
    var domainsList = [];
    pluginPreferences.forEach(function(host) {
      var link = 'applinks:' + host.name;
      domainsList.push(link);
    });

    return {
      'key': ['com.apple.developer.associated-domains'],
      'array': [{
        'string': domainsList
      }]
    };
  }

  function indexOfAssosiatedDomainsDictionary(entitlements) {
    if (entitlements['plist']['dict'] == null) {
      return -1;
    }

    var index = -1;
    entitlements.plist.dict.some(function(dictionary, dictIndex) {
      var key = dictionary['key'];
      if (key == 'com.apple.developer.associated-domains') {
        index = dictIndex;
        return true;
      }

      return false;
    });

    return index;
  }

})();
