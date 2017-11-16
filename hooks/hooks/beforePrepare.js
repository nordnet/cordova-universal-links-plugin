(function () {
  // properties
  'use strict';
  var configPreferences = require('../npm/processConfigXml.js');
  var iosCapabilities = require('../ios/enableEntitlements.js');
  var iosAssociatedDomains = require('../ios/updateAssociatedDomains.js');
  var IOS = 'ios';

  // entry
  module.exports = run;

  // builds before platform config
  function run (context) {
    var preferences = configPreferences.read(context);
    var platforms = context.opts.cordova.platforms;

    platforms.forEach(function (platform) {
      if (platform === IOS) {
        //iosPlist.addBranchSettings(preferences);
        iosCapabilities.enableAssociatedDomains(preferences);
        iosAssociatedDomains.addAssociatedDomains(preferences);
      }
    })
  }
})();
