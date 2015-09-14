var ulConfigParser = require('./lib/ulConfigXmlParser.js'),
  ulAndroidManifestWriter = require('./lib/ulAndroidManifestWriter.js'),
  ulAndroidWebHook = require('./lib/ulAndroidWebHook.js'),
  ANDROID = 'android',
  IOS = 'ios';

module.exports = function(ctx) {
  run(ctx);
};

function run(cordovaContext) {
  var pluginPreferences = ulConfigParser.readPreferences(cordovaContext),
    platformsList = cordovaContext.opts.platforms;

  platformsList.forEach(function(platform) {
    switch (platform) {
      case ANDROID: {
        activateUniversalLinksInAndroid(cordovaContext, pluginPreferences);
        break;
      }
      case IOS: {
        activateUniversalLinksInIos(cordovaContext, pluginPreferences);
        break;
      }
    }
  });
}

function activateUniversalLinksInAndroid(cordovaContext, pluginPreferences) {
  ulAndroidManifestWriter.writePreferences(cordovaContext, pluginPreferences);
  ulAndroidWebHook.generate(cordovaContext, pluginPreferences);
}

function activateUniversalLinksInIos(cordovaContext, pluginPreferences) {

}
