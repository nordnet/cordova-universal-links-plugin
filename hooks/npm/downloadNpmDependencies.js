(function () {
  // properties
  'use strict';
  var fs = require('fs');
  var path = require('path');
  var spawnSync = require('child_process').spawnSync;
  var INSTALLFLAGNAME = '.installed';

  // entry
  module.exports = {
    install: install
  };

  // install the node dependencies for this project
  function install (context) {
    // set properties
    var q = context.requireCordovaModule('q');
    var async = new q.defer(); // eslint-disable-line
    var installFlagLocation = path.join(context.opts.projectRoot, 'plugins', context.opts.plugin.id, INSTALLFLAGNAME);
    var dependencies = require(path.join(context.opts.projectRoot, 'plugins', context.opts.plugin.id, 'package.json')).dependencies;

    // only run once
    if (getPackageInstalled(installFlagLocation)) return;

    // install node modules
    var modules = getNodeModulesToInstall(dependencies);
    if (modules.length === 0) return async.promise;

    installNodeModules(modules, context.opts.plugin.id, function () {
      // only run once
      setPackageInstalled(installFlagLocation);
      async.resolve();
    });

    // wait until callbacks from the all the npm install complete
    return async.promise;
  }

  // installs the node modules via npm install one at a time
  function installNodeModules (modules, pluginId, callback) {
    // base case
    if (modules.length <= 0) {
      return callback();
    }

    // install one at a time
    var module = modules.pop();
    console.log('Installing node dependency ' + module);

    var npm = (process.platform === "win32" ? "npm.cmd" : "npm");
    var result = spawnSync(npm, ['install', '--production', module], { cwd: './plugins/' + pluginId });
    if (result.error) {
      throw result.error;
    } else {
      // next module
      installNodeModules(modules, pluginId, callback);
    }
  }

  // checks to see which node modules need to be installed from package.json.dependencies
  function getNodeModulesToInstall (dependencies) {
    var modules = [];
    for (var module in dependencies) {
      if (dependencies.hasOwnProperty(module)) {
        try {
          require(module);
        } catch (err) {
          modules.push(module);
        }
      }
    }
    return modules
  }

  // if the package has already been installed
  function getPackageInstalled (installFlagLocation) {
    try {
      fs.readFileSync(installFlagLocation);
      return true;
    } catch (err) {
      return false;
    }
  }

  // set that the package has been installed
  function setPackageInstalled (installFlagLocation) {
    fs.closeSync(fs.openSync(installFlagLocation, 'w'));
  }
})();
