(function (){
  var path = require('path'),
    XmlHelper = require('./xmlHelper.js'),
    ANDROID = 'android',
    IOS = 'ios',
    CONFIG_FILE_NAME = 'config.xml',
    xml,
    context,
    projectRoot;

  module.exports = ConfigXmlHelper;

  // region public API

  function ConfigXmlHelper(cordovaContext) {
    context = cordovaContext;
    projectRoot = context.opts.projectRoot;
    xml = new XmlHelper();
  }

  ConfigXmlHelper.prototype.read = function (platform) {
    var filePath = getConfigXmlFilePath(platform);

    return xml.readXmlAsJson(filePath);
  }

  ConfigXmlHelper.prototype.write = function (data, platform) {
    var filePath = getConfigXmlFilePath(platform);

    xml.writeJsonAsXml(data, filePath);
  }

  // endregion

  // region Private API

  function getConfigXmlFilePath(platform) {
    var configXmlPath = null;
    switch(platform) {
      case IOS: {
        configXmlPath = pathToIosConfigXml();
        break;
      }
      case ANDROID: {
        configXmlPath = pathToAndroidConfigXml();
        break;
      }
      default: {
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

  function pathToProjectConfigXml() {
    return path.join(projectRoot, CONFIG_FILE_NAME);
  }

})();
