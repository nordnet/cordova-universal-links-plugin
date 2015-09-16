/*
Helper class to read/write config.xml file from/to different sources:
  - project root;
  - android-specific config.xml;
  - ios-specific config.xml.
*/
(function() {
  var path = require('path'),
    xmlHelper = require('./xmlHelper.js'),
    ANDROID = 'android',
    IOS = 'ios',
    CONFIG_FILE_NAME = 'config.xml',
    context,
    projectRoot;

  module.exports = ConfigXmlHelper;

  // region public API

  /**
   * Constructor.
   *
   * @param {Object} cordovaContext - cordova context object
   */
  function ConfigXmlHelper(cordovaContext) {
    context = cordovaContext;
    projectRoot = context.opts.projectRoot;
  }

  /**
   * Read config.xml data as JSON object.
   *
   * @param {String} platform - if defined - read platform-specific config.xml; if not - read it from the project root;
   * @return {Object} JSON object with data from config.xml
   */
  ConfigXmlHelper.prototype.read = function(platform) {
    var filePath = getConfigXmlFilePath(platform);

    return xmlHelper.readXmlAsJson(filePath);
  }

  /**
   * Write JSON object into config.xml file.
   *
   * @param {Object} data - JSON object to write to file;
   * @param {String} platform - if defined - save to the platform-specific config.xml; if not - write to the project root;
   * @return {boolean} true - if data was successfully saved to the file; otherwise - false.
   */
  ConfigXmlHelper.prototype.write = function(data, platform) {
    var filePath = getConfigXmlFilePath(platform);

    return xmlHelper.writeJsonAsXml(data, filePath);
  }

  ConfigXmlHelper.prototype.getPackageName = function(platform) {
    var configFilePath = getConfigXmlFilePath(platform),
      config = getCordovaConfigParser(configFilePath),
      packageName;

    switch (platform) {
      case ANDROID: {
        packageName = config.android_packageName();
        break;
      }
      case IOS: {
        packageName = config.ios_packageName();
        break;
      }
    }
    if (packageName === undefined || packageName.length == 0) {
      packageName = config.packageName();
    }

    return packageName;
  }

  ConfigXmlHelper.prototype.getProjectName = function() {
    var configFilePath = getConfigXmlFilePath(),
      config = getCordovaConfigParser(configFilePath);

    return config.name();
  }

  // endregion

  // region Private API

  function getCordovaConfigParser(configFilePath) {
    var ConfigParser = context.requireCordovaModule('cordova-lib/src/configparser/ConfigParser');

    return new ConfigParser(configFilePath);
  }

  /**
   * Get absolute path to the config.xml. Depends on the provided platform flag.
   *
   * @param {String} platform - for which platform we need config.xml file; if not defined - file is taken from the project root.
   */
  function getConfigXmlFilePath(platform) {
    var configXmlPath = null;
    switch (platform) {
      case IOS:
        {
          configXmlPath = pathToIosConfigXml();
          break;
        }
      case ANDROID:
        {
          configXmlPath = pathToAndroidConfigXml();
          break;
        }
      default:
        {
          configXmlPath = pathToProjectConfigXml();
        }
    }

    return configXmlPath;
  }

  /**
   * Get name of the current project.
   *
   * @param {Object} ctx - cordova context instance
   * @param {String} projectRoot - current root of the project
   *
   * @return {String} name of the project
   */
  function getProjectName(ctx, projectRoot) {
    var ConfigParser = ctx.requireCordovaModule('cordova-lib/src/configparser/ConfigParser'),
      pathToProjectConfig = pathToProjectConfigXml(),
      cfg = new ConfigParser(pathToProjectConfig);

    return cfg.name();
  }

  /**
   * Get path to config.xml inside iOS project.
   *
   * @return {String} absolute path to config.xml file
   */
  function pathToIosConfigXml() {
    var projectName = getProjectName(cordovaContext, projectRoot);

    return path.join(projectRoot, 'platforms', IOS, projectName, CONFIG_FILE_NAME);
  }

  /**
   * Get path to config.xml inside Android project.
   *
   * @return {String} absolute path to config.xml file
   */
  function pathToAndroidConfigXml() {
    return path.join(projectRoot, 'platforms', ANDROID, 'res', 'xml', CONFIG_FILE_NAME);
  }

  /**
   * Get path to config.xml inside project root directory.
   *
   * @return {String} absolute path to config.xml file
   */
  function pathToProjectConfigXml() {
    return path.join(projectRoot, CONFIG_FILE_NAME);
  }

  // endregion

})();
