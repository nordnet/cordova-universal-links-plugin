/**
Hook is executed when plugin is added to the project.
It will check all necessary module dependencies and install the missing ones locally.
*/

var exec = require('child_process').exec,
    path = require('path'),
    cwd = path.resolve(),
    modules = ['read-package-json'];

// region NPM specific

/**
 * Discovers module dependencies in plugin's package.json and installs those modules.
 * @param {String} pluginId - ID of the plugin calling this hook
 */
function getPackagesFromJson(pluginId){
  var readJson = require('read-package-json');
  readJson(path.join(cwd, 'plugins', pluginId, 'package.json'), console.error, false, function (er, data) {
    if (er) {
      console.error("There was an error reading the file: "+er);
      return;
    }
    if(data['dependencies']){
      for(var k in data['dependencies']){
        modules.push(k);
      }
      installRequiredNodeModules(function(){
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
    } else {
      console.log('Module ' + moduleName + ' is installed');
      installRequiredNodeModules(callback);
    }
  });
}

// endregion

module.exports = function(ctx) {
  installRequiredNodeModules(getPackagesFromJson.bind(this, ctx.opts.plugin.id));
};
