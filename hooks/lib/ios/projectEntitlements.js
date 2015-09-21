/*
Script creates entitlements file with the list of hosts, specified in config.xml.
File name is: ProjectName.entitlements
Location: ProjectName/

Script only generates content. File it self is included in the xcode project in another hook: xcodePreferences.js.
*/
(function() {

  var xml2js = require('xml2js'),
    path = require('path'),
    xmlHelper = require('../xmlHelper.js'),
    ConfigXmlHelper = require('../configXmlHelper.js'),
    ASSOCIATED_DOMAINS = 'com.apple.developer.associated-domains',
    context,
    projectRoot,
    projectName,
    entitlementsFilePath;

  module.exports = {
    generateAssociatedDomainsEntitlements: generateEntitlements
  };

  // region Public API

  /**
   * Generate entitlements file content.
   *
   * @param {Object} cordovaContext - cordova context object
   * @param {Object} pluginPreferences - plugin preferences from config.xml; already parsed
   */
  function generateEntitlements(cordovaContext, pluginPreferences) {
    context = cordovaContext;

    var currentEntitlements = getEntitlementsFileContent(),
      newEntitlements = injectPreferences(currentEntitlements, pluginPreferences);

    saveContentToEntitlementsFile(newEntitlements);
  }

  // endregion

  // region Work with entitlements file

  /**
   * Save data to entitlements file.
   *
   * @param {Object} content - data to save; JSON object that will be transformed into xml
   */
  function saveContentToEntitlementsFile(content) {
    var options = {
      doctype: {
        pubID: '-//Apple//DTD PLIST 1.0//EN',
        sysID: 'http://www.apple.com/DTDs/PropertyList-1.0.dtd'
      }
    };

    xmlHelper.writeJsonAsXml(content, pathToEntitlementsFile(), options);
  }

  /**
   * Read data from existing entitlements file. If none exist - default value is returned
   *
   * @return {String} entitlements file content
   */
  function getEntitlementsFileContent() {
    var currentEntitlements = xmlHelper.readXmlAsJson(pathToEntitlementsFile());
    if (currentEntitlements != null) {
      return currentEntitlements;
    }

    // return default plist if it's not exist
    return defaultEntitlementsFile();
  }

  /**
   * Get content for an empty entitlements file.
   *
   * @return {String} default entitlements file content
   */
  function defaultEntitlementsFile() {
    return {
      'plist': {
        '$': {
          'version': '1.0'
        },
        'dict': []
      }
    };
  }

  /**
   * Inject list of hosts into entitlements file.
   *
   * @param {Object} currentEntitlements - entitlements where to inject preferences
   * @param {Object} pluginPreferences - list of hosts from config.xml
   * @return {Object} new entitlements content
   */
  function injectPreferences(currentEntitlements, pluginPreferences) {
    var newEntitlements = currentEntitlements,
      dictIndex = indexOfAssociatedDomainsDictionary(newEntitlements),
      content = generateAssociatedDomainsContent(pluginPreferences);

    // if associated-domains entry was not found in entitlements file - add it;
    // if was - replace it with the new version
    if (dictIndex < 0) {
      newEntitlements.plist.dict.push(content);
    } else {
      newEntitlements.plist.dict[dictIndex] = content;
    }

    return newEntitlements;
  }

  /**
   * Generate content for associated-domains dictionary in the entitlements file.
   *
   * @param {Object} pluginPreferences - list of hosts from conig.xml
   * @return {Object} associated-domains dictionary content
   */
  function generateAssociatedDomainsContent(pluginPreferences) {
    var domainsList = [],
      link;

    // generate list of host links
    pluginPreferences.forEach(function(host) {
      link = domainsListEntryForHost(host);
      domainsList.push(link);
    });

    return {
      'key': [ASSOCIATED_DOMAINS],
      'array': [{
        'string': domainsList
      }]
    };
  }

  /**
   * Generate domain record for the given host.
   *
   * @param {Object} host - host entry
   * @return {String} record
   */
  function domainsListEntryForHost(host) {
    return 'applinks:' + host.name;
  }

  /**
   * Find index of the associated-domains dictionary in the entitlements file.
   *
   * @param {Object} entitlements - entitlements file content
   * @return {Integer} index of the associated-domains dictionary; -1 - if none was found
   */
  function indexOfAssociatedDomainsDictionary(entitlements) {
    if (entitlements['plist'] == null || entitlements.plist['dict'] == null) {
      return -1;
    }

    var index = -1;
    entitlements.plist.dict.some(function(dictionary, dictIndex) {
      if (dictionary.key == ASSOCIATED_DOMAINS) {
        index = dictIndex;
        return true;
      }

      return false;
    });

    return index;
  }

  // endregion

  // region Path helper methods

  /**
   * Path to entitlements file.
   *
   * @return {String} absolute path to entitlements file
   */
  function pathToEntitlementsFile() {
    if (entitlementsFilePath === undefined) {
      entitlementsFilePath = path.join(getProjectRoot(), 'platforms', 'ios', getProjectName(), getProjectName() + '.entitlements');
    }

    return entitlementsFilePath;
  }

  /**
   * Projects root folder path.
   *
   * @return {String} absolute path to the projects root
   */
  function getProjectRoot() {
    return context.opts.projectRoot;
  }

  /**
   * Name of the project from config.xml
   *
   * @return {String} project name
   */
  function getProjectName() {
    if (projectName === undefined) {
      var configXmlHelper = new ConfigXmlHelper(context);
      projectName = configXmlHelper.getProjectName();
    }

    return projectName;
  }

  // endregion

})();
