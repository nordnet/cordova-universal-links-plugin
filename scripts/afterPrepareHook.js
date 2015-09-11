var ulConfigParser = require('./lib/ulConfigXmlParser.js'),
  ulAndroidManifestWriter = require('./lib/ulAndroidManifestWriter.js');

module.exports = function(ctx) {
  run(ctx);
};

function run(cordovaContext) {
  var pluginPreferences = ulConfigParser.readPreferences(cordovaContext);
  //console.log('Preferences: ' + JSON.stringify(pluginPreferences, null, 2));

  cordovaContext.opts.platforms.forEach(function(platform) {
    switch (platform) {
      case 'android': {
        activateUniversalLinksInAndroid(cordovaContext, pluginPreferences);
        break;
      }
      case 'ios': {
        activateUniversalLinksInIos(pluginPreferences);
        break;
      }
    }
  });
}

function activateUniversalLinksInAndroid(cordovaContext, pluginPreferences) {
  ulAndroidManifestWriter.writePreferences(cordovaContext, pluginPreferences);
}

function activateUniversalLinksInIos(pluginPreferences) {

}
