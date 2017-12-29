/**
Class injects plugin preferences into AndroidManifest.xml file.
*/

var path = require('path');
var xmlHelper = require('../xmlHelper.js');

module.exports = {
  writePreferences: writePreferences
};

// region Public API

/**
 * Inject preferences into AndroidManifest.xml file.
 *
 * @param {Object} cordovaContext - cordova context object
 * @param {Object} pluginPreferences - plugin preferences as JSON object; already parsed
 */
function writePreferences(cordovaContext, pluginPreferences) {
  var pathToManifest = path.join(cordovaContext.opts.projectRoot, 'platforms', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  var manifestSource = xmlHelper.readXmlAsJson(pathToManifest);
  var cleanManifest;
  var updatedManifest;

  // remove old intent-filters
  cleanManifest = removeOldOptions(manifestSource);

  // inject intent-filters based on plugin preferences
  updatedManifest = injectOptions(cleanManifest, pluginPreferences);

  // save new version of the AndroidManifest
  xmlHelper.writeJsonAsXml(updatedManifest, pathToManifest);
}

// endregion

// region Manifest cleanup methods

/**
 * Remove old intent-filters from the manifest file.
 *
 * @param {Object} manifestData - manifest content as JSON object
 * @return {Object} manifest data without old intent-filters
 */
function removeOldOptions(manifestData) {
  var cleanManifest = manifestData;
  var activities = manifestData['manifest']['application'][0]['activity'];

  activities.forEach(removeIntentFiltersFromActivity);
  cleanManifest['manifest']['application'][0]['activity'] = activities;

  return cleanManifest;
}

/**
 * Remove old intent filters from the given activity.
 *
 * @param {Object} activity - activity, from which we need to remove intent-filters.
 *                            Changes applied to the passed object.
 */
function removeIntentFiltersFromActivity(activity) {
  var oldIntentFilters = activity['intent-filter'];
  var newIntentFilters = [];

  if (oldIntentFilters == null || oldIntentFilters.length == 0) {
    return;
  }

  oldIntentFilters.forEach(function(intentFilter) {
    if (!isIntentFilterForUniversalLinks(intentFilter)) {
      newIntentFilters.push(intentFilter);
    }
  });

  activity['intent-filter'] = newIntentFilters;
}

/**
 * Check if given intent-filter is for Universal Links.
 *
 * @param {Object} intentFilter - intent-filter to check
 * @return {Boolean} true - if intent-filter for Universal Links; otherwise - false;
 */
function isIntentFilterForUniversalLinks(intentFilter) {
  var actions = intentFilter['action'];
  var categories = intentFilter['category'];
  var data = intentFilter['data'];

  return isActionForUniversalLinks(actions) &&
    isCategoriesForUniversalLinks(categories) &&
    isDataTagForUniversalLinks(data);
}

/**
 * Check if actions from the intent-filter corresponds to actions for Universal Links.
 *
 * @param {Array} actions - list of actions in the intent-filter
 * @return {Boolean} true - if action for Universal Links; otherwise - false
 */
function isActionForUniversalLinks(actions) {
  // there can be only 1 action
  if (actions == null || actions.length != 1) {
    return false;
  }

  var action = actions[0]['$']['android:name'];

  return ('android.intent.action.VIEW' === action);
}

/**
 * Check if categories in the intent-filter corresponds to categories for Universal Links.
 *
 * @param {Array} categories - list of categories in the intent-filter
 * @return {Boolean} true - if action for Universal Links; otherwise - false
 */
function isCategoriesForUniversalLinks(categories) {
  // there can be only 2 categories
  if (categories == null || categories.length != 2) {
    return false;
  }

  var isBrowsable = false;
  var isDefault = false;

  // check intent categories
  categories.forEach(function(category) {
    var categoryName = category['$']['android:name'];
    if (!isBrowsable) {
      isBrowsable = 'android.intent.category.BROWSABLE' === categoryName;
    }

    if (!isDefault) {
      isDefault = 'android.intent.category.DEFAULT' === categoryName;
    }
  });

  return isDefault && isBrowsable;
}

/**
 * Check if data tag from intent-filter corresponds to data for Universal Links.
 *
 * @param {Array} data - list of data tags in the intent-filter
 * @return {Boolean} true - if data tag for Universal Links; otherwise - false
 */
function isDataTagForUniversalLinks(data) {
  // can have only 1 data tag in the intent-filter
  if (data == null || data.length != 1) {
    return false;
  }

  var dataHost = data[0]['$']['android:host'];
  var dataScheme = data[0]['$']['android:scheme'];
  var hostIsSet = dataHost != null && dataHost.length > 0;
  var schemeIsSet = dataScheme != null && dataScheme.length > 0;

  return hostIsSet && schemeIsSet;
}

// endregion

// region Methods to inject preferences into AndroidManifest.xml file

/**
 * Inject options into manifest file.
 *
 * @param {Object} manifestData - manifest content where preferences should be injected
 * @param {Object} pluginPreferences - plugin preferences from config.xml; already parsed
 * @return {Object} updated manifest data with corresponding intent-filters
 */
function injectOptions(manifestData, pluginPreferences) {
  var changedManifest = manifestData;
  var activitiesList = changedManifest['manifest']['application'][0]['activity'];
  var launchActivityIndex = getMainLaunchActivityIndex(activitiesList);
  var ulIntentFilters = [];
  var launchActivity;

  if (launchActivityIndex < 0) {
    console.warn('Could not find launch activity in the AndroidManifest file. Can\'t inject Universal Links preferences.');
    return;
  }

  // get launch activity
  launchActivity = activitiesList[launchActivityIndex];

  // generate intent-filters
  pluginPreferences.hosts.forEach(function(host) {
    host.paths.forEach(function(hostPath) {
      ulIntentFilters.push(createIntentFilter(host.name, host.scheme, hostPath));
    });
  });

  // add Universal Links intent-filters to the launch activity
  launchActivity['intent-filter'] = launchActivity['intent-filter'].concat(ulIntentFilters);

  return changedManifest;
}

/**
 * Find index of the applications launcher activity.
 *
 * @param {Array} activities - list of all activities in the app
 * @return {Integer} index of the launch activity; -1 - if none was found
 */
function getMainLaunchActivityIndex(activities) {
  var launchActivityIndex = -1;
  activities.some(function(activity, index) {
    if (isLaunchActivity(activity)) {
      launchActivityIndex = index;
      return true;
    }

    return false;
  });

  return launchActivityIndex;
}

/**
 * Check if the given actvity is a launch activity.
 *
 * @param {Object} activity - activity to check
 * @return {Boolean} true - if this is a launch activity; otherwise - false
 */
function isLaunchActivity(activity) {
  var intentFilters = activity['intent-filter'];
  var isLauncher = false;

  if (intentFilters == null || intentFilters.length == 0) {
    return false;
  }

  isLauncher = intentFilters.some(function(intentFilter) {
    var action = intentFilter['action'];
    var category = intentFilter['category'];

    if (action == null || action.length != 1 || category == null || category.length != 1) {
      return false;
    }

    var isMainAction = ('android.intent.action.MAIN' === action[0]['$']['android:name']);
    var isLauncherCategory = ('android.intent.category.LAUNCHER' === category[0]['$']['android:name']);

    return isMainAction && isLauncherCategory;
  });

  return isLauncher;
}

/**
 * Create JSON object that represent intent-filter for universal link.
 *
 * @param {String} host - host name
 * @param {String} scheme - host scheme
 * @param {String} pathName - host path
 * @return {Object} intent-filter as a JSON object
 */
function createIntentFilter(host, scheme, pathName) {
  var intentFilter = {
    '$': {
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
    'data': [{
      '$': {
        'android:host': host,
        'android:scheme': scheme
      }
    }]
  };

  injectPathComponentIntoIntentFilter(intentFilter, pathName);

  return intentFilter;
}

/**
 * Inject host path into provided intent-filter.
 *
 * @param {Object} intentFilter - intent-filter object where path component should be injected
 * @param {String} pathName - host path to inject
 */
function injectPathComponentIntoIntentFilter(intentFilter, pathName) {
  if (pathName == null || pathName === '*') {
    return;
  }

  var attrKey = 'android:path';
  if (pathName.indexOf('*') >= 0) {
    attrKey = 'android:pathPattern';
    pathName = pathName.replace(/\*/g, '.*');
  }

  if (pathName.indexOf('/') != 0) {
    pathName = '/' + pathName;
  }

  intentFilter['data'][0]['$'][attrKey] = pathName;
}

// endregion
