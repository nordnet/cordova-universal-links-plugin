/**
Hook is executed when plugin is added to the project.
It will check all necessary module dependencies and install the missing ones locally.
*/

var path = require('path');
var fs = require('fs');
var spawnSync = require('child_process').spawnSync;
var pluginNpmDependencies = require('../package.json').dependencies;
var INSTALLATION_FLAG_FILE_NAME = '.npmInstalled';

// region mark that we installed npm packages
/**
 * Check if we already executed this hook.
 *
 * @param {Object} ctx - cordova context
 * @return {Boolean} true if already executed; otherwise - false
 */
function isInstallationAlreadyPerformed(ctx) {
  var pathToInstallFlag = path.join(ctx.opts.projectRoot, 'plugins', ctx.opts.plugin.id, INSTALLATION_FLAG_FILE_NAME);
  try {
    fs.accessSync(pathToInstallFlag, fs.F_OK);
    return true;
  } catch (err) {
    return false;
  }
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

module.exports = function(ctx) {
  if (isInstallationAlreadyPerformed(ctx)) {
    return;
  }

  console.log('Installing dependency packages: ');
  console.log(JSON.stringify(pluginNpmDependencies, null, 2));

  var npm = (process.platform === "win32" ? "npm.cmd" : "npm");
  var result = spawnSync(npm, ['install', '--production'], { cwd: './plugins/' + ctx.opts.plugin.id });
  if (result.error) {
    throw result.error;
  }

  createPluginInstalledFlag(ctx);
};
