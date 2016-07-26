/*
Helper class to read data from config.xml file.
*/
var path = require('path');
var xmlHelper = require('./xmlHelper.js');
var ANDROID = 'android';
var IOS = 'ios';
var CONFIG_FILE_NAME = 'config.xml';
var context;
var projectRoot;

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
 * @return {Object} JSON object with data from config.xml
 */
ConfigXmlHelper.prototype.read = function() {
  var filePath = getConfigXmlFilePath();

  return xmlHelper.readXmlAsJson(filePath);
}

/**
 * Get package name for the application. Depends on the platform.
 *
 * @param {String} platform - 'ios' or 'android'; for what platform we need a package name
 * @return {String} package/bundle name
 */
ConfigXmlHelper.prototype.getPackageName = function(platform) {
  var configFilePath = getConfigXmlFilePath();
  var config = getCordovaConfigParser(configFilePath);
  var packageName;

  switch (platform) {
    case ANDROID:
      {
        packageName = config.android_packageName();
        break;
      }
    case IOS:
      {
        packageName = config.ios_CFBundleIdentifier();
        break;
      }
  }
  if (packageName === undefined || packageName.length == 0) {
    packageName = config.packageName();
  }

  return packageName;
}

/**
 * Get name of the current project.
 *
 * @return {String} name of the project
 */
ConfigXmlHelper.prototype.getProjectName = function() {
  return getProjectName();
}

// endregion

// region Private API

/**
 * Get config parser from cordova library.
 *
 * @param {String} configFilePath absolute path to the config.xml file
 * @return {Object}
 */
function getCordovaConfigParser(configFilePath) {
  var ConfigParser;

  // If we are running Cordova 5.4 or abova - use parser from cordova-common.
  // Otherwise - from cordova-lib.
  try {
    ConfigParser = context.requireCordovaModule('cordova-common/src/ConfigParser/ConfigParser');
  } catch (e) {
    ConfigParser = context.requireCordovaModule('cordova-lib/src/configparser/ConfigParser')
  }

  return new ConfigParser(configFilePath);
}

/**
 * Get absolute path to the config.xml.
 */
function getConfigXmlFilePath() {
  return path.join(projectRoot, CONFIG_FILE_NAME);
}

/**
 * Get project name from config.xml
 */
function getProjectName() {
  var configFilePath = getConfigXmlFilePath();
  var config = getCordovaConfigParser(configFilePath);

  return config.name();
}

// endregion
