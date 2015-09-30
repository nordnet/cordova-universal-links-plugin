/**
Hook is executed when plugin is added to the project.
It will check all necessary module dependencies and install the missing ones locally.
*/

var exec = require('child_process').exec,
  path = require('path'),
  modules = ['read-package-json'],
  packageJsonFilePath;

// region NPM specific

/**
 * Discovers module dependencies in plugin's package.json and installs them.
 */
function getPackagesFromJson() {
  var readJson = require('read-package-json');
  readJson(packageJsonFilePath, console.error, false, function(err, data) {
    if (err) {
      console.error('Can\'t read package.json file: ' + err);
      return;
    }

    var dependencies = data['dependencies'];
    if (dependencies) {
      for (var module in dependencies) {
        modules.push(module);
      }
      installRequiredNodeModules(function() {
        console.log('All dependency modules are installed.');
      });
    }
  });
}

/**
 * Check if node package is installed.
 *
 * @param {String} moduleName
 * @return {Boolean} true if package already installed
 */
function isNodeModuleInstalled(moduleName) {
  var installed = true;
  try {
    require.resolve(moduleName);
  } catch (err) {
    installed = false;
  }

  return installed;
}

/**
 * Install node module locally.
 * Basically, it runs 'npm install module_name'.
 *
 * @param {String} moduleName
 * @param {Callback(error)} callback
 */
function installNodeModule(moduleName, callback) {
  if (isNodeModuleInstalled(moduleName)) {
    console.log('Node module ' + moduleName + ' is found');
    callback(null);
    return;
  }
  console.log('Can\'t find module ' + moduleName + ', running npm install');

  var cmd = 'npm install ' + moduleName;
  exec(cmd, function(err, stdout, stderr) {
    callback(err);
  });
}

/**
 * Install all required node packages.
 */
function installRequiredNodeModules(callback) {
  if (modules.length == 0) {
    callback();
    return;
  }

  var moduleName = modules.shift();
  installNodeModule(moduleName, function(err) {
    if (err) {
      console.log('Failed to install module ' + moduleName);
      console.log(err);
      return;
    }

    console.log('Module ' + moduleName + ' is installed');
    installRequiredNodeModules(callback);
  });
}

// endregion

/**
 * Perform initialization before any execution.
 *
 * @param {Object} ctx - cordova context object
 */
function init(ctx) {
  packageJsonFilePath = path.join(ctx.opts.projectRoot, 'plugins', ctx.opts.plugin.id, 'package.json');
}

module.exports = function(ctx) {
  init(ctx);

  installRequiredNodeModules(getPackagesFromJson);
};
