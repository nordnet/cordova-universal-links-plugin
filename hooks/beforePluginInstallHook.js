/**
Hook is executed when plugin is added to the project.
It will check all necessary module dependencies and install the missing ones locally.
*/

var exec = require('child_process').exec,
  path = require('path'),
  fs = require('fs'),
  INSTALLATION_FLAG_FILE_NAME = '.installed';

// region NPM specific

/**
 * Check if node package is installed.
 *
 * @param {String} moduleName
 * @return {Boolean} true if package already installed
 */
function isNodeModuleInstalled(moduleName) {
  var installed = true;
  try {
    var module = require(moduleName);
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
    printLog('Node module ' + moduleName + ' is found');
    callback(null);
    return;
  }
  printLog('Can\'t find module ' + moduleName + ', running npm install');

  var cmd = 'npm install -D ' + moduleName;
  exec(cmd, function(err, stdout, stderr) {
    callback(err);
  });
}

/**
 * Install all required node packages.
 */
function installRequiredNodeModules(modulesToInstall) {
  if (!modulesToInstall.length) {
    return;
  }

  var moduleName = modulesToInstall.shift();
  installNodeModule(moduleName, function(err) {
    if (err) {
      printLog('Failed to install module ' + moduleName + ':' + err);
      return;
    }

    printLog('Module ' + moduleName + ' is installed');
    installRequiredNodeModules(modulesToInstall);
  });
}

// endregion

// region Logging

function logStart() {
  console.log('Checking dependencies:');
}

function printLog(msg) {
  var formattedMsg = '    ' + msg;
  console.log(formattedMsg);
}

// endregion

// region Private API

/**
 * Check if we already executed this hook.
 *
 * @param {Object} ctx - cordova context
 * @return {Boolean} true if already executed; otherwise - false
 */
function isInstallationAlreadyPerformed(ctx) {
  var pathToInstallFlag = path.join(ctx.opts.projectRoot, 'plugins', ctx.opts.plugin.id, INSTALLATION_FLAG_FILE_NAME),
    isInstalled = false;
  try {
    var content = fs.readFileSync(pathToInstallFlag);
    isInstalled = true;
  } catch (err) {
  }

  return isInstalled;
}

/**
 * Create empty file - indicator, that we tried to install dependency modules after installation.
 * We have to do that, or this hook is gonna be called on any plugin installation.
 */
function createPluginInstalledFlag(ctx) {
  var pathToInstallFlag = path.join(ctx.opts.projectRoot, 'plugins', ctx.opts.plugin.id, INSTALLATION_FLAG_FILE_NAME);

  fs.closeSync(fs.openSync(pathToInstallFlag, 'w'));
}

// endregion

/**
 * Read dependencies from the package.json.
 * We will install them on the next step.
 *
 * @param {Object} ctx - cordova context
 * @return {Array} list of modules to install
 */
function readDependenciesFromPackageJson(ctx) {
  var data = require(path.join(ctx.opts.projectRoot, 'plugins', ctx.opts.plugin.id, 'package.json')),
    dependencies = data['dependencies'],
    modules = [];

  if (!dependencies) {
    return modules;
  }

  for (var module in dependencies) {
    modules.push(module);
  }

  return modules;
}

// hook's entry point
module.exports = function(ctx) {
  // exit if we already executed this hook once
  if (isInstallationAlreadyPerformed(ctx)) {
    return;
  }

  logStart();

  var modules = readDependenciesFromPackageJson(ctx);
  installRequiredNodeModules(modules);

  createPluginInstalledFlag(ctx);
};
