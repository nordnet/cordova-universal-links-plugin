/*
Hook executed before the 'prepare' stage. Only for iOS project.
It will check if project name has changed. If so - it will change the name of the .entitlements file to remove that file duplicates.
If file name has no changed - hook would not do anything.
*/

var path = require('path'),
  fs = require('fs'),
  ConfigXmlHelper = require('./lib/configXmlHelper.js');

module.exports = function(ctx) {
  run(ctx);
};

/**
 * Run the hook logic.
 *
 * @param {Object} ctx - cordova context object
 */
function run(ctx) {
  var projectRoot = ctx.opts.projectRoot,
    iosProjectFilePath = path.join(projectRoot, 'platforms', 'ios'),
    configXmlHelper = new ConfigXmlHelper(ctx),
    oldProjectName = getOldProjectName(iosProjectFilePath),
    newProjectName = configXmlHelper.getProjectName();

  // if name has not changed - do nothing
  if (oldProjectName.length > 0 && oldProjectName === newProjectName) {
    return;
  }

  console.log('Project name has changed. Renaming .entitlements file.');

  // if it does - rename it
  var oldEntitlementsFilePath = path.join(iosProjectFilePath, oldProjectName, 'Resources', oldProjectName + '.entitlements'),
    newEntitlementsFilePath = path.join(iosProjectFilePath, oldProjectName, 'Resources', newProjectName + '.entitlements');

  try {
    fs.renameSync(oldEntitlementsFilePath, newEntitlementsFilePath);
  } catch (err) {
    console.warn('Failed to rename .entitlements file.');
    console.warn(err);
  }
}

// region Private API

/**
 * Get old name of the project.
 * Name is detected by the name of the .xcodeproj file.
 *
 * @param {String} projectDir absolute path to ios project directory
 * @return {String} old project name
 */
function getOldProjectName(projectDir) {
  var files = [],
    projectName = '';

  try {
    files = fs.readdirSync(projectDir);
  } catch (err) {
    return '';
  }

  // find file with .xcodeproj extension, use it as an old project name
  files.some(function(fileName) {
    if (path.extname(fileName) === '.xcodeproj') {
      projectName = path.basename(fileName, '.xcodeproj');
      return true;
    }

    return false;
  });

  return projectName;
}

// endregion
