/*
https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html#//apple_ref/doc/uid/TP40016308-CH12-SW1

TODO: cleanup!

*/

(function() {

  var path = require('path'),
    mkpath = require('mkpath'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    ConfigXmlHelper = require('../configXmlHelper.js'),
    ASSOCIATION_FILE_NAME = 'apple-app-site-association',
    APP_ID_PREFIX = '<YOUR_TEAM_ID_FROM_MEMBER_CENTER>',
    bundleId,
    context;

  module.exports = {
    generate: generate
  };

  function generate(cordovaContext, pluginPreferences) {
    context = cordovaContext;

    removeOldFiles();

    pluginPreferences.forEach(function(host) {
      var content = generateFileContentForHost(host);
      saveContentToFile(host.name, content);
    });
  }

  function removeOldFiles() {
    rimraf.sync(getWebHookDirectory());
  }

  function generateFileContentForHost(host) {
    var appID = APP_ID_PREFIX + '.' + getBundleId();

    return {
      "applinks": {
        "apps": [],
        "details": [{
          "appID": appID,
          "paths": host.paths
        }]
      }
    };
  }

  function saveContentToFile(filePrefix, content) {
    var dirPath = getWebHookDirectory(),
      filePath = path.join(dirPath, filePrefix + '#' + ASSOCIATION_FILE_NAME),
      isSaved = true;

    try {
      mkpath.sync(dirPath);
    } catch (err) {
      console.log(err);
    }

    try {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    } catch (err) {
      console.log(err);
      isSaved = false;
    }

    return isSaved;
  }

  function getWebHookDirectory() {
    return path.join(getProjectRoot(), 'ul_web_hooks', 'ios');
  }

  function getProjectRoot() {
    return context.opts.projectRoot;
  }

  function getBundleId() {
    if (bundleId === undefined) {
      var configXmlHelper = new ConfigXmlHelper(context);
      bundleId = configXmlHelper.getPackageName('ios');
    }

    return bundleId;
  }

})();
