(function () {
  // properties
  'use strict';
  var path = require('path');
  var fs = require('fs');
  var plist = require('plist');
  var mkpath = require('mkpath');
  var BUILD_TYPES = ['Debug', 'Release'];
  var ASSOCIATED_DOMAINS = 'com.apple.developer.associated-domains';

  // entry
  module.exports = {
    addAssociatedDomains: addAssociatedDomains
  };

  // updates the associated domains from the host field of the app's config.xml
  function addAssociatedDomains (preferences) {
    var files = getEntitlementFiles(preferences);

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var entitlements = getEntitlements(file);

      entitlements = updateEntitlements(entitlements, preferences);
      setEntitlements(file, entitlements);
    }
  }

  // get the xcode .entitlements and provisioning profile .plist
  function getEntitlementFiles (preferences) {
    var files = [];
    var entitlements = path.join(preferences.projectRoot, 'platforms', 'ios', preferences.projectName, 'Resources', preferences.projectName + '.entitlements');
    files.push(path.join(preferences.projectRoot, 'platforms', 'ios', preferences.projectName, preferences.projectName + '.entitlements'));
    files.push(entitlements);

    for (var i = 0; i < BUILD_TYPES.length; i++) {
      var buildType = BUILD_TYPES[i];
      var plist = path.join(preferences.projectRoot, 'platforms', 'ios', preferences.projectName, 'Entitlements-' + buildType + '.plist');
      files.push(plist);
    }

    return files
  }

  // save entitlements
  function setEntitlements (file, entitlements) {
    var plistContent = plist.build(entitlements);

    mkpath.sync(path.dirname(file));

    fs.writeFileSync(file, plistContent, 'utf8');
  }

  // read entitlements
  function getEntitlements (file) {
    var content;

    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (err) {
      return {};
    }

    return plist.parse(content);
  }

  // appends Universal link hosts to the Associated Domain entitlement's file
  //    <dict>
  //      <key>com.apple.developer.associated-domains</key>
  //      <array>
  //        <string>applinks:rawsr.app.link</string>
  //        <string>applinks:rawsr-alternate.app.link</string>
  //      </array>
  //    </dict>
  function updateEntitlements (entitlements, preferences) {
    var domains = [];
    var prev = entitlements[ASSOCIATED_DOMAINS];
    var next = updateAssociatedDomains(preferences);

    prev = removePreviousAssociatedDomains(preferences, prev);
    entitlements[ASSOCIATED_DOMAINS] = domains.concat(prev, next);

    return entitlements;
  }

  // removed previous associated domains related to Universal Links (will not remove link domain changes from custom domains or custom sub domains)
  function removePreviousAssociatedDomains (preferences, domains) {
    var output = [];
    var hosts = preferences.hosts;

    if (!domains) return output;
    for (var i = 0; i < domains.length; i++) {
      var domain = domains[i];
      if (domain.indexOf('applinks:') === 0) {
        domain = domain.replace('applinks:', '');
        if (isUniversalLinksAssociatedDomain(domain, hosts)) {
          output.push('applinks:' + domain);
        }
      } else {
        if (isUniversalLinksAssociatedDomain(domain, hosts)) {
          output.push(domain);
        }
      }
    }

    return output;
  }

  // determine if previous associated domain is related to Universal Links (to prevent duplicates when appending new)
  function isUniversalLinksAssociatedDomain (domain, hosts) {
    return !(domain.indexOf('bnc.lt') > 0 || domain.indexOf('app.link') > 0 || testHost(domain, hosts));
  }

  function testHost(domain, hosts) {
    return !!hosts.filter(function(host) {
      return host.name === domain;
    }).length;
  }

  // determine which Universal Link Host to append
  function updateAssociatedDomains (preferences) {
    var domainList = [];
    var prefix = 'applinks:';
    var hosts = preferences.hosts;

    for (var i = 0; i < hosts.length; i++) {
      var host = hosts[i].name;

      // add link domain to associated domain
      domainList.push(prefix + host);

      // app.link link domains need -alternate associated domains as well (for Deep Views)
      if (host.indexOf('app.link') !== -1) {
        var first = host.split('.')[0];
        var second = host.split('.')[1];
        var rest = host.split('.').slice(2).join('.');
        var alternate = first + '-alternate';

        domainList.push(prefix + alternate + '.' + second + '.' + rest);
      }
    }

    return domainList;
  }
})();
