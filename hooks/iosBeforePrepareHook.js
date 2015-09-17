var path = require('path'),
  fs = require('fs'),
  ConfigXmlHelper = require('./lib/configXmlHelper.js');

module.exports = function(ctx) {
  run(ctx);
};

function run(ctx) {
  var projectRoot = ctx.opts.projectRoot,
    configXmlHelper = new ConfigXmlHelper(ctx),
    oldProjectName = getOldProjectName(projectRoot),
    newProjectName = configXmlHelper.getProjectName(),
    oldEntitlementsFilePath,
    newEntitlementsFilePath;

  // if name has not changed - do nothing
  if (oldProjectName.length > 0 && oldProjectName === newProjectName) {
    return;
  }

  console.log('Project name has changed. Renaming .entitlements file.');

  // if it does - rename it
  oldEntitlementsFilePath = path.join(projectRoot, 'platforms', 'ios', oldProjectName, oldProjectName + '.entitlements');
  newEntitlementsFilePath = path.join(projectRoot, 'platforms', 'ios', oldProjectName, newProjectName + '.entitlements');

  try {
    fs.renameSync(oldEntitlementsFilePath, newEntitlementsFilePath);
  } catch (err) {
    console.warn('Failed to rename .entitlements file.');
    console.warn(err);
  }
}

function getOldProjectName(projectRoot) {
  var files = [],
    dir = path.join(projectRoot, 'platforms', 'ios'),
    projectName = '';

  try {
    files = fs.readdirSync(dir);
  } catch (err) {
    return '';
  }

  files.some(function(fileName) {
    if (path.extname(fileName) === '.xcodeproj') {
      projectName = path.basename(fileName, '.xcodeproj');
      return true;
    }

    return false;
  });

  return projectName;
}
