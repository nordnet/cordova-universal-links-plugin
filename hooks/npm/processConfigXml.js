(function () {
  // properties
  'use strict';
  var path = require('path');
  var xmlHelper = require('../lib/xmlHelper.js');
  var DEFAULT_SCHEME = 'http';

  // entry
  module.exports = {
    read: read
  };

  // read config from config.xml
  function read (context) {
    var projectRoot = getProjectRoot(context);
    var configXml = getConfigXml(projectRoot);
    var universalLinksXml = getUniversalLinksXml(configXml);
    var universalLinksPreferences = getUniversalLinksPreferences(context, configXml, universalLinksXml);

    validateUniversalLinksPreferences(universalLinksPreferences);

    return universalLinksPreferences;
  }

  // read config.xml
  function getConfigXml (projectRoot) {
    var pathToConfigXml = path.join(projectRoot, 'config.xml');
    var configXml = xmlHelper.readXmlAsJson(pathToConfigXml);

    if (configXml === null) {
      throw new Error('A config.xml is not found in project\'s root directory.');
    }

    return configXml;
  }

  // read <universal-links> within config.xml
  function getUniversalLinksXml (configXml) {
    var universalLinksConfig = configXml.widget['universal-links'];

    if (universalLinksConfig === null || universalLinksConfig.length === 0) {
      throw new Error('<universal-links> tag is not set in the config.xml.');
    }

    return universalLinksConfig[0];
  }

  // read <universal-links> properties within config.xml
  function getUniversalLinksPreferences (context, configXml, universalLinksXml) {
    return {
      'projectRoot': getProjectRoot(context),
      'projectName': getProjectName(configXml),
      'hosts': getHostsList(universalLinksXml, 'host'),
      'iosBundleId': getBundleId(configXml, 'ios'),
      'iosProjectModule': getProjectModule(context),
      'iosTeamRelease': getUniversalLinksValue(universalLinksXml, 'ios-team-release'), // optional
      'iosTeamDebug': getUniversalLinksValue(universalLinksXml, 'ios-team-debug'), // optional
      'androidBundleId': getBundleId(configXml, 'android') // optional
    }
  }

  // read project root from cordova context
  function getProjectRoot (context) {
    return context.opts.projectRoot || null;
  }

  // read project name from config.xml
  function getProjectName (configXml) {
    return (configXml.widget.hasOwnProperty('name')) ? configXml.widget.name[0] : null;
  }

  // read value from <universal-links>
  function getUniversalLinksValue (universalLinksXml, key) {
    return (universalLinksXml.hasOwnProperty(key)) ? universalLinksXml[key][0]['$']['value'] : null;
  }

  // read value from <universal-links> for multiple <host>
  function getHostsList (universalLinksXml, key) {
    var hosts = [];
    if (universalLinksXml.hasOwnProperty(key)) {
      for (var i = 0; i < universalLinksXml[key].length; i++) {
        var item = universalLinksXml[key][i];
        var host = {
          paths: constructPaths(item)
        };
        host.name = item['$']['name'];
        host.scheme = item['$']['scheme'] || DEFAULT_SCHEME;
        hosts.push(host);
      }
    }
    return hosts;
  }

  function constructPaths(xmlHostElement) {
    if (!xmlHostElement['path']) {
      return ['*'];
    }

    var paths = [];
    xmlHostElement.path.some(function(pathElement) {
      var url = pathElement['$']['url'];

      // Ignore explicit paths if '*' is defined
      if (url === '*') {
        paths = ['*'];
        return true;
      }

      paths.push(url);
    });

    return paths;
  }

  // read bundle id from config.xml (optional values override widget-id)
  function getBundleId (configXml, platform) {
    var output = null;
    var key = platform === 'ios' ? 'ios-CFBundleIdentifier' : 'android-packageName';

    if (configXml.widget['$'].hasOwnProperty(key)) {
      output = configXml.widget['$'][key];
    } else if (configXml.widget['$'].hasOwnProperty('id')) {
      output = configXml.widget['$']['id'];
    }

    return output;
  }

  // read iOS project module from cordova context
  function getProjectModule (context) {
    var projectRoot = getProjectRoot(context);
    var projectPath = path.join(projectRoot, 'platforms', 'ios');

    try {
      // pre 5.0 cordova structure
      return context.requireCordovaModule('cordova-lib/src/plugman/platforms').ios.parseProjectFile(projectPath);
    } catch (e) {
      try {
        // pre 7.0 cordova structure
        return context.requireCordovaModule('cordova-lib/src/plugman/platforms/ios').parseProjectFile(projectPath);
      } catch (e) {
        // post 7.0 cordova structure
        return getProjectModuleGlob(context);
      }
    }
  }

  function getProjectModuleGlob (context) {
    // get xcodeproj
    var projectRoot = getProjectRoot(context);
    var projectPath = path.join(projectRoot, 'platforms', 'ios');
    var projectFiles = context.requireCordovaModule('glob').sync(path.join(projectPath, '*.xcodeproj', 'project.pbxproj'));
    if (projectFiles.length === 0) return;
    var pbxPath = projectFiles[0];
    var xcodeproj = context.requireCordovaModule('xcode').project(pbxPath);

    // add hash
    xcodeproj.parseSync();

    // return xcodeproj and write method
    return {
      'xcode': xcodeproj,
      'write': function () {
        // save xcodeproj
        var fs = context.requireCordovaModule('fs');
        fs.writeFileSync(pbxPath, xcodeproj.writeSync());

        // pull framework dependencies
        var frameworksFile = path.join(projectPath, 'frameworks.json');
        var frameworks = {};

        try {
          frameworks = context.requireCordovaModule(frameworksFile);
        } catch (e) {}
        // If there are no framework references, remove this file
        if (Object.keys(frameworks).length === 0) {
          return context.requireCordovaModule('shelljs').rm('-rf', frameworksFile);
        }

        // save frameworks
        fs.writeFileSync(frameworksFile, JSON.stringify(frameworks, null, 4));
      }
    }
  }

  // validate <universal-links> properties within config.xml
  function validateUniversalLinksPreferences (preferences) {
    if (preferences.projectRoot === null) {
      throw new Error('Invalid "root" in your config.xml.');
    }
    if (preferences.projectPlatform === null) {
      throw new Error('Invalid "platform" in your config.xml.');
    }
    if (preferences.projectName === null) {
      throw new Error('Invalid "name" in your config.xml.');
    }
    if (preferences.hosts.length < 1) {
      throw new Error('No "host" found in <universal-links> in your config.xml.');
    }

    for (var i = 0; i < preferences.hosts.length; i++) {
      if (preferences.hosts[i].name === null || !/^(?!.*?www).*([a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+.*)$/.test(preferences.hosts[i].name)) {
        throw new Error('Invalid "host" in <universal-links> in your config.xml.');
      }
    }

    if (preferences.iosBundleId === null || !/^[a-zA-Z0-9.-]+$/.test(preferences.iosBundleId)) {
      throw new Error('Invalid "id" or "ios-CFBundleIdentifier" in <widget> in your config.xml.');
    }
    if (preferences.iosTeamRelease !== null && !/^[a-zA-Z0-9]{10}$/.test(preferences.iosTeamRelease)) {
      throw new Error('Invalid "ios-team-release" in <universal-links> in your config.xml.');
    }
    if (preferences.iosTeamDebug !== null && !/^[a-zA-Z0-9]{10}$/.test(preferences.iosTeamDebug)) {
      throw new Error('Invalid "ios-team-debug" in <universal-links> in your config.xml.');
    }
    if (preferences.androidBundleId !== null && !/^[a-zA-Z0-9._]+$/.test(preferences.androidBundleId)) {
      throw new Error('Invalid "id" or "android-packageName" in <widget> in your config.xml.');
    }
  }
})();
