(function () {
  // properties
  'use strict';
  var path = require('path');
  var compare = require('node-version-compare');
  var IOS_DEPLOYMENT_TARGET = '8.0';
  var COMMENT_KEY = /_comment$/;
  var CODESIGNIDENTITY = 'iPhone Developer';

  // entry
  module.exports = {
    enableAssociatedDomains: enableAssociatedDomains
  };

  // updates the xcode preferences to allow associated domains
  function enableAssociatedDomains (preferences) {
    var entitlementsFile = path.join(preferences.projectRoot, 'platforms', 'ios', preferences.projectName, 'Resources', preferences.projectName + '.entitlements');

    activateAssociativeDomains(preferences.iosProjectModule.xcode, entitlementsFile);
    addPbxReference(preferences.iosProjectModule.xcode, entitlementsFile);
    preferences.iosProjectModule.write();
  }

  // adds entitlement files to the xcode project
  function activateAssociativeDomains (xcodeProject, entitlementsFile) {
    var configurations = removeComments(xcodeProject.pbxXCBuildConfigurationSection());
    var config;
    var buildSettings;

    for (config in configurations) {
      buildSettings = configurations[config].buildSettings;
      buildSettings.CODE_SIGN_IDENTITY = '"' + CODESIGNIDENTITY + '"';
      buildSettings.CODE_SIGN_ENTITLEMENTS = '"' + entitlementsFile + '"';

      // if deployment target is less then the required one - increase it
      if (buildSettings.IPHONEOS_DEPLOYMENT_TARGET) {
        var buildDeploymentTarget = buildSettings.IPHONEOS_DEPLOYMENT_TARGET.toString();
        if (compare(buildDeploymentTarget, IOS_DEPLOYMENT_TARGET) === -1) {
          buildSettings.IPHONEOS_DEPLOYMENT_TARGET = IOS_DEPLOYMENT_TARGET;
        }
      } else {
        buildSettings.IPHONEOS_DEPLOYMENT_TARGET = IOS_DEPLOYMENT_TARGET;
      }
    }
  }

  function addPbxReference (xcodeProject, entitlementsFile) {
    var fileReferenceSection = removeComments(xcodeProject.pbxFileReferenceSection());

    if (isPbxReferenceAlreadySet(fileReferenceSection, entitlementsFile)) return;
    xcodeProject.addResourceFile(path.basename(entitlementsFile));
  }

  function isPbxReferenceAlreadySet (fileReferenceSection, entitlementsFile) {
    var isAlreadyInReferencesSection = false;
    var uuid;
    var fileRefEntry;

    for (uuid in fileReferenceSection) {
      fileRefEntry = fileReferenceSection[uuid];
      if (fileRefEntry.path && fileRefEntry.path.indexOf(entitlementsFile) > -1) {
        isAlreadyInReferencesSection = true;
        break;
      }
    }

    return isAlreadyInReferencesSection;
  }

  // removes comments from .pbx file
  function removeComments (obj) {
    var keys = Object.keys(obj);
    var newObj = {};

    for (var i = 0, len = keys.length; i < len; i++) {
      if (!COMMENT_KEY.test(keys[i])) {
        newObj[keys[i]] = obj[keys[i]];
      }
    }

    return newObj;
  }
})();
