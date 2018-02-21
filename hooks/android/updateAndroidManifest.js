(function () {
  // properties
  'use strict';
  var path = require('path');
  var xmlHelper = require('../lib/xmlHelper.js');

  // entry
  module.exports = {
    writePreferences: writePreferences
  };

  // injects config.xml preferences into AndroidManifest.xml file.
  function writePreferences (context, preferences) {
    var pathToManifest = path.join(context.opts.projectRoot, 'platforms', 'android', 'AndroidManifest.xml');
    var manifest = xmlHelper.readXmlAsJson(pathToManifest);
    var mainActivityIndex = getMainLaunchActivityIndex(manifest['manifest']['application'][0]['activity']);

    // update manifest
    manifest = updateLaunchOptionToSingleTask(manifest, mainActivityIndex);
    manifest = updateUniversalLinksAppLinks(manifest, mainActivityIndex, preferences);

    // save new version of the AndroidManifest
    xmlHelper.writeJsonAsXml(pathToManifest, manifest);
  }

  // adds to main <activity>:
  //    android:launchMode="singleTask"
  function updateLaunchOptionToSingleTask (manifest, mainActivityIndex) {
    manifest['manifest']['application'][0]['activity'][mainActivityIndex]['$']['android:launchMode'] = 'singleTask';
    return manifest;
  }

  // adds to main <activity> for App Links (optional)
  //    <intent-filter android:name="<bundle-id>.UniversalLinks" android:autoVerify="true">
  //       <action android:name="android.intent.action.VIEW" />
  //       <category android:name="android.intent.category.DEFAULT" />
  //       <category android:name="android.intent.category.BROWSABLE" />
  //       <data android:scheme="https" android:host="ethan.app.link" />
  //       <data android:scheme="https" android:host="ethan-alternate.app.link" />
  //    </intent-filter>
  function updateUniversalLinksAppLinks (manifest, mainActivityIndex, preferences) {
    var intentFilters = manifest['manifest']['application'][0]['activity'][mainActivityIndex]['intent-filter'] || [];
    var data = getAppLinkIntentFilterData(preferences);
    var androidName = preferences.androidBundleId + '.UniversalLinks';

    // remove
    intentFilters = removeBasedOnAndroidName(intentFilters, androidName);

    // add new
    manifest['manifest']['application'][0]['activity'][mainActivityIndex]['intent-filter'] = intentFilters.concat([{
      '$': {
        'android:name': androidName,
        'android:autoVerify': 'true'
      },
      'action': [{
        '$': {
          'android:name': 'android.intent.action.VIEW'
        }
      }],
      'category': [{
        '$': {
          'android:name': 'android.intent.category.DEFAULT'
        }
      }, {
        '$': {
          'android:name': 'android.intent.category.BROWSABLE'
        }
      }],
      'data': data
    }]);

    return manifest;
  }

  // determine the Universal Links domain <data> to append to the App Link intent filter
  function getAppLinkIntentFilterData (preferences) {
    var intentFilterData = [];
    var hosts = preferences.hosts;

    hosts.forEach(function(host) {
      host.paths.forEach(function(path) {
        // app.link link domains need -alternate associated domains as well (for Deep Views)
        if (host.name.indexOf('app.link') !== -1) {
          var first = host.name.split('.')[0];
          var rest = host.name.split('.').slice(1).join('.');
          var alternate = first + '-alternate' + '.' + rest;

          intentFilterData.push(getAppLinkIntentFilterDictionary(host.name, host.scheme, path));
          intentFilterData.push(getAppLinkIntentFilterDictionary(alternate, host.scheme, path));
        } else {
          // bnc.lt and custom domains
          intentFilterData.push(getAppLinkIntentFilterDictionary(host.name, host.scheme, path));
        }
      });
    });

    return intentFilterData;
  }

  // generate the array dictionary for <data> component for the App Link intent filter
  function getAppLinkIntentFilterDictionary (host, scheme, path) {
    var output = {
      '$': {
        'android:host': host,
        'android:scheme': scheme
      }
    };

    if (path && path !== '*') {
      var key = 'android:path';
      if (~path.indexOf('*')) {
        key = 'android:pathPattern';
        path = path.replace(/\*/g, '.*');
      }

      if (path.indexOf('/') !== 0) {
        path = '/' + path;
      }

      output['$'][key] = path;
    }

    return output;
  }

  // remove previous Branch related <meta-data> and <receiver> based on android:name
  function removeBasedOnAndroidName (items, androidName) {
    var without = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.hasOwnProperty('$') && item['$'].hasOwnProperty('android:name')) {
        var key = item['$']['android:name'];
        if (key === androidName) {
          continue;
        }
        without.push(item);
      } else {
        without.push(item);
      }
    }
    return without
  }

  // get the main <activity> because Branch Intent Filters must be in the main Launch Activity
  function getMainLaunchActivityIndex (activities) {
    var launchActivityIndex = -1;

    for (var i = 0; i < activities.length; i++) {
      var activity = activities[i];
      if (isLaunchActivity(activity)) {
        launchActivityIndex = i;
        break
      }
    }

    return launchActivityIndex;
  }

  // determine if <activity> is the main activity
  function isLaunchActivity (activity) {
    var intentFilters = activity['intent-filter'];
    var isLauncher = false;

    if (intentFilters == null || intentFilters.length === 0) {
      return false;
    }

    isLauncher = intentFilters.some(function (intentFilter) {
      var action = intentFilter['action'];
      var category = intentFilter['category'];

      if (action == null || action.length !== 1 || category == null || category.length !== 1) {
        return false;
      }

      var isMainAction = action[0]['$']['android:name'] === 'android.intent.action.MAIN';
      var isLauncherCategory = category[0]['$']['android:name'] === 'android.intent.category.LAUNCHER';

      return isMainAction && isLauncherCategory;
    });

    return isLauncher;
  }
})();
