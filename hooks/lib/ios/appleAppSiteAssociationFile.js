/*
Script generates apple-app-site-association files: one for each domain, defined in config.xml.
It is executed on 'after prepare' stage, usually when you execute 'cordova build'. Files are placed in 'ul_web_hooks/ios/' folder
of your projects root.

Files are created with the following name:
hostname#apple-app-site-association

Prefix 'hostname#' describes on which host this file should be placed. Don't forget to remove it before uploading file on your host.
Also, in the file you need to replace <YOUR_TEAM_ID_FROM_MEMBER_CENTER> with the real team id from the member center, if <ios-team-id> preference was not set in projects config.xml.

In order to activate support for Universal Links on iOS you need to sign them with the valid SSL certificate and place in the root of your domain.

Additional documentation regarding apple-app-site-association file can be found here:
- https://developer.apple.com/library/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html
- https://developer.apple.com/library/ios/documentation/Security/Reference/SharedWebCredentialsRef/index.html#//apple_ref/doc/uid/TP40014989
*/

(function() {

  var path = require('path'),
    mkpath = require('mkpath'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    ConfigXmlHelper = require('../configXmlHelper.js'),
    IOS_TEAM_ID = '<YOUR_TEAM_ID_FROM_MEMBER_CENTER>',
    ASSOCIATION_FILE_NAME = 'apple-app-site-association',
    bundleId,
    context;

  module.exports = {
    generate: generate
  };

  // region Public API

  /**
   * Generate apple-app-site-association files.
   *
   * @param {Object} cordovaContext - cordova context object
   * @param {Object} pluginPreferences - list of hosts from the config.xml; already parsed
   */
  function generate(cordovaContext, pluginPreferences) {
    context = cordovaContext;
    removeOldFiles();
    createNewAssociationFiles(pluginPreferences);
  }

  // endregion

  // region Content generation

  /**
   * Remove old files from ul_web_hooks/ios folder.
   */
  function removeOldFiles() {
    rimraf.sync(getWebHookDirectory());
  }

  /**
   * Generate new set of apple-app-site-association files.
   *
   * @param {Object} pluginPreferences - list of hosts from config.xml
   */
  function createNewAssociationFiles(pluginPreferences) {
    var teamId = pluginPreferences.iosTeamId;
    if (!teamId) {
      teamId = IOS_TEAM_ID;
    }

    pluginPreferences.hosts.forEach(function(host) {
      var content = generateFileContentForHost(host, teamId);
      saveContentToFile(host.name, content);
    });
  }

  /**
   * Generate content of the apple-app-site-association file for the specific host.
   *
   * @param {Object} host - host information
   * @return {Object} content of the file as JSON object
   */
  function generateFileContentForHost(host, teamId) {
    var appID = teamId + '.' + getBundleId(),
      paths = host.paths.slice();

    // if paths are '*' - we should add '/' to it to support root domains.
    // https://github.com/nordnet/cordova-universal-links-plugin/issues/46
    if (paths.length == 1 && paths[0] === '*') {
      paths.push('/');
    }

    return {
      "applinks": {
        "apps": [],
        "details": [{
          "appID": appID,
          "paths": paths
        }]
      }
    };
  }

  /**
   * Save data to the the apple-app-site-association file.
   *
   * @param {String} filePrefix - prefix for the generated file; usually - hostname
   * @param {Object} content - file content as JSON object
   * @return {Boolean} true - if data was saved; otherwise - false
   */
  function saveContentToFile(filePrefix, content) {
    var dirPath = getWebHookDirectory(),
      filePath = path.join(dirPath, filePrefix + '#' + ASSOCIATION_FILE_NAME),
      isSaved = true;

    // create all directories from file path
    createDirectoriesIfNeeded(dirPath);

    // write content to the file
    try {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    } catch (err) {
      console.log(err);
      isSaved = false;
    }

    return isSaved;
  }

  /**
   * Create all directories from the given path.
   *
   * @param {String} dirPath - full path to directory
   * @return {Boolean} true - if directories were created; false - some error happened during the execution
   */
  function createDirectoriesIfNeeded(dirPath) {
    var isCreated = true;
    try {
      mkpath.sync(dirPath);
    } catch (err) {
      isCreated = false;
      console.log(err);
    }

    return isCreated;
  }

  // endregion

  // region Support methods

  /**
   * Path to the ios web hook directory.
   *
   * @return {String} path to web hook directory
   */
  function getWebHookDirectory() {
    return path.join(getProjectRoot(), 'ul_web_hooks', 'ios');
  }

  /**
   * Project root directory
   *
   * @return {String} absolute path to project root
   */
  function getProjectRoot() {
    return context.opts.projectRoot;
  }

  /**
   * Get bundle id from the config.xml file.
   *
   * @return {String} bundle id
   */
  function getBundleId() {
    if (bundleId === undefined) {
      var configXmlHelper = new ConfigXmlHelper(context);
      bundleId = configXmlHelper.getPackageName('ios');
    }

    return bundleId;
  }

  // endregion

})();
