(function() {

  var path = require('path'),
    XmlHelper = require('./xmlHelper.js'),
    xml = new XmlHelper();

  module.exports = {
    writePreferences: writePreferences
  };

  function writePreferences(cordovaContext, pluginPreferences) {
    var pathToManifest = path.join(cordovaContext.opts.projectRoot, 'platforms', 'android', 'AndroidManifest.xml'),
      manifestData = xml.readXmlAsJson(pathToManifest);

    cleanManifestData = removeOldOptions(manifestData);

    console.log('Clean manifest:' + JSON.stringify(cleanManifestData, null, 2));

    injectOptions(cleanManifestData, pluginPreferences);

    console.log('New manifest: ' + JSON.stringify(cleanManifestData, null, 2));

    xml.writeJsonAsXml(cleanManifestData, pathToManifest);
  }

  function removeOldOptions(manifestData) {
    var cleanManifest = manifestData,
      activities = manifestData['manifest']['application'][0]['activity'];

    activities.forEach(function(activity) {
      var oldIntentFilters = activity['intent-filter'],
        newIntentFilters = [];
      if (oldIntentFilters == null || oldIntentFilters.length == 0) {
        return;
      }

      oldIntentFilters.forEach(function(intentFilter) {
        var actions = intentFilter['action'];
        var categories = intentFilter['category'];
        var data = intentFilter['data'];

        // Can have only 1 data tag in the intent-filter for universal links.
        // There can be only 1 action.
        // There can be only 2 categories.
        // If not - then this is not our intent-filter.
        if ((data == null || data.length != 1) || (actions == null || actions.length != 1) || (categories == null || categories.length != 2)) {
          newIntentFilters.push(intentFilter);
          return;
        }

        if (actions[0]['$']['android:name'] !== 'android.intent.action.VIEW') {
          newIntentFilters.push(intentFilter);
          return;
        }

        var isCategoriesDirty = categories.some(function(category) {
          var categoryName = category['$']['android:name'];
          return (categoryName === 'android.intent.category.DEFAULT' || categoryName === 'android.intent.category.BROWSABLE');
        });
        if (!isCategoriesDirty) {
          newIntentFilters.push(intentFilter);
          return;
        }

        var dataHost = data[0]['$']['android:host'];
        var dataScheme = data[0]['$']['android:scheme'];
        if (dataHost == null || dataHost.length == 0 || dataScheme == null || dataScheme.length == 0) {
          newIntentFilters.push(intentFilter);
        }
      });

      activity['intent-filter'] = newIntentFilters;
    });

    cleanManifest['manifest']['application'][0]['activity'] = activities;

    return cleanManifest;
  }

  function injectOptions(manifestData, pluginPreferences) {
    var launchActivityIndex = getMainLaunchActivityIndex(manifestData),
      launchActivity = manifestData['manifest']['application']['0']['activity'][launchActivityIndex],
      ulIntentFilters = [];

    pluginPreferences.forEach(function(domain) {
      if (domain.paths.length == 0) {
        ulIntentFilters.push(createIntentFilter(domain.name, domain.scheme));
        return;
      }

      domain.paths.forEach(function(dPath) {
        ulIntentFilters.push(createIntentFilter(domain.name, domain.scheme, dPath));
      });
    });

    launchActivity['intent-filter'] = launchActivity['intent-filter'].concat(ulIntentFilters);
  }

  function getMainLaunchActivityIndex(manifestData) {
    return 0; // TODO: search for launch activity
  }

  function createIntentFilter(host, scheme, pathName) {
    var intentFilter = {
      'action': [{
        '$': {
          'android:name': 'android.intent.action.VIEW'
        }
      }],
      'category': [{
        '$': {
          'android:name': 'android.intent.category.DEFAULT'
        }
      },
      {
        '$': {
          'android:name': 'android.intent.category.BROWSABLE'
        }
      }],
      'data':[{
        '$': {
          'android:host': host,
          'android:scheme': scheme
        }
      }]
    };

    if (pathName == null || pathName === '*') {
      return intentFilter;
    }

    var attrKey = 'android:path';
    if (pathName.indexOf('*') >= 0) {
      attrKey = 'android:pathPattern';
      pathName = pathName.replace('*', '.*');
    }

    if (pathName.indexOf('/') != 0) {
      pathName = '/' + pathName;
    }

    intentFilter['data'][0]['$'][attrKey] = pathName;

    return intentFilter;
  }

})();
