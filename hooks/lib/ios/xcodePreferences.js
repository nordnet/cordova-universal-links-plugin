(function() {

  var path = require('path'),
    ConfigXmlHelper = require('../configXmlHelper.js'),
    IOS_DEPLOYMENT_TARGET = '9.0',
    COMMENT_KEY = /_comment$/,
    context;

  module.exports = {
    enableAssociativeDomainsCapability : enableAssociativeDomainsCapability
  }

  function enableAssociativeDomainsCapability(cordovaContext) {
    context = cordovaContext;

    var projectFile = loadProjectFile();
    activateAssociativeDomains(projectFile.xcode);
    projectFile.write();
  }

  function iosPlatformPath() {
    return path.join(projectRoot(), 'platforms', 'ios');
  }

  function projectRoot() {
    return context.opts.projectRoot;
  }

  /**
   * Load iOS project file from platform specific folder.
   *
   * @return {Object} projectFile - project file information
   */
  function loadProjectFile() {
    var platform_ios,
      projectFile;

    try {
      // try pre-5.0 cordova structure
      platform_ios = context.requireCordovaModule('cordova-lib/src/plugman/platforms')['ios'];
      projectFile = platform_ios.parseProjectFile(iosPlatformPath());
    } catch (e) {
      // let's try cordova 5.0 structure
      platform_ios = context.requireCordovaModule('cordova-lib/src/plugman/platforms/ios');
      projectFile = platform_ios.parseProjectFile(iosPlatformPath());
    }

    return projectFile;
  }

  function activateAssociativeDomains(xcodeProject) {
    //console.log(JSON.stringify(xcodeProject, null, 2));

    var configurations = nonComments(xcodeProject.pbxXCBuildConfigurationSection()),
      entitlementsFilePath = pathToEntitlementsFile(),
      config,
      buildSettings;

    for (config in configurations) {
      buildSettings = configurations[config].buildSettings;
      //console.log(JSON.stringify(buildSettings, null, 2));

      buildSettings['IPHONEOS_DEPLOYMENT_TARGET'] = IOS_DEPLOYMENT_TARGET;
      buildSettings['CODE_SIGN_ENTITLEMENTS'] = '"' + entitlementsFilePath + '"';
    }
    console.log('IOS project now has deployment target set as:[' + IOS_DEPLOYMENT_TARGET + '] ...');
    console.log('IOS project Code Sign Entitlements set to: ' + entitlementsFilePath + ' ...');
  }

  function pathToEntitlementsFile() {
    var configXmlHelper = new ConfigXmlHelper(context),
      projectName = configXmlHelper.getProjectName(),
      fileName = projectName + '.entitlements';

    return path.join(projectName, fileName);
  }

  /**
   * Remove comments from the file.
   *
   * @param {Object} obj - file object
   * @return {Object} file object without comments
   */
  function nonComments(obj) {
    var keys = Object.keys(obj),
      newObj = {};

    for (var i = 0, len = keys.length; i < len; i++) {
      if (!COMMENT_KEY.test(keys[i])) {
        newObj[keys[i]] = obj[keys[i]];
      }
    }

    return newObj;
  }

})();
