/*
Class creates android_web_hook.html file in your Cordova project root folder.
File holds <link /> tags, which are generated based on data, specified in config.xml.
You need to include those tags on your website to link web pages to the content inside your application.

More documentation on that can be found here:
https://developer.android.com/training/app-indexing/enabling-app-indexing.html
*/

var fs = require('fs');
var path = require('path');
var mkpath = require('mkpath');
var WEB_HOOK_FILE_PATH = path.join('ul_web_hooks', 'android', 'android_web_hook.html');
var WEB_HOOK_TPL_FILE_PATH = path.join('plugins', 'cordova-universal-links-plugin', 'ul_web_hooks', 'android_web_hook_tpl.html');
var LINK_PLACEHOLDER = '[__LINKS__]';
var LINK_TEMPLATE = '<link rel="alternate" href="android-app://<package_name>/<scheme>/<host><path>" />';

module.exports = {
  generate: generateWebHook
};

// region Public API

/**
 * Generate website hook for android application.
 *
 * @param {Object} cordovaContext - cordova context object
 * @param {Object} pluginPreferences - plugin preferences from config.xml file; already parsed
 */
function generateWebHook(cordovaContext, pluginPreferences) {
  var projectRoot = cordovaContext.opts.projectRoot;
  var packageName = pluginPreferences.androidBundleId;
  var template = readTemplate(projectRoot);

  // if template was not found - exit
  if (template == null || template.length == 0) {
    return;
  }

  // generate hook content
  var linksToInsert = generateLinksSet(projectRoot, packageName, pluginPreferences);
  var hookContent = template.replace(LINK_PLACEHOLDER, linksToInsert);

  // save hook
  saveWebHook(projectRoot, hookContent);
}

// endregion

// region Public API

/**
 * Read hook teplate from plugin directory.
 *
 * @param {String} projectRoot - absolute path to cordova's project root
 * @return {String} data from the template file
 */
function readTemplate(projectRoot) {
  var filePath = path.join(projectRoot, WEB_HOOK_TPL_FILE_PATH);
  var tplData = null;

  try {
    tplData = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.warn('Template file for android web hook is not found!');
    console.warn(err);
  }

  return tplData;
}

/**
 * Generate list of <link /> tags based on plugin preferences.
 *
 * @param {String} projectRoot - absolute path to cordova's project root
 * @param {String} packageName - android application package name
 * @param {Object} pluginPreferences - plugin preferences, defined in config.xml; already parsed
 * @return {String} list of <link /> tags
 */
function generateLinksSet(projectRoot, packageName, pluginPreferences) {
  var linkTpl = LINK_TEMPLATE.replace('<package_name>', packageName);
  var content = '';

  pluginPreferences.hosts.forEach(function(host) {
    host.paths.forEach(function(hostPath) {
      content += generateLinkTag(linkTpl, host.scheme, host.name, hostPath) + '\n';
    });
  });

  return content;
}

/**
 * Generate <link /> tag.
 *
 * @param {String} linkTpl - template to use for tag generation
 * @param {String} scheme - host scheme
 * @param {String} host - host name
 * @param {String} path - host path
 * @return {String} <link /> tag
 */
function generateLinkTag(linkTpl, scheme, host, path) {
  linkTpl = linkTpl.replace('<scheme>', scheme).replace('<host>', host);
  if (path == null || path === '*') {
    return linkTpl.replace('<path>', '');
  }

  // for android we need to replace * with .* for pattern matching
  if (path.indexOf('*') >= 0) {
    path = path.replace(/\*/g, '.*');
  }

  // path should start with /
  if (path.indexOf('/') != 0) {
    path = '/' + path;
  }

  return linkTpl.replace('<path>', path);
}

/**
 * Save data to website hook file.
 *
 * @param {String} projectRoot - absolute path to project root
 * @param {String} hookContent - data to save
 * @return {boolean} true - if data was saved; otherwise - false;
 */
function saveWebHook(projectRoot, hookContent) {
  var filePath = path.join(projectRoot, WEB_HOOK_FILE_PATH);
  var isSaved = true;

  // ensure directory exists
  createDirectoryIfNeeded(path.dirname(filePath));

  // write data to file
  try {
    fs.writeFileSync(filePath, hookContent, 'utf8');
  } catch (err) {
    console.warn('Failed to create android web hook!');
    console.warn(err);
    isSaved = false;
  }

  return isSaved;
}

/**
 * Create directory if it doesn't exist yet.
 *
 * @param {String} dir - absolute path to directory
 */
function createDirectoryIfNeeded(dir) {
  try {
    mkpath.sync(dir);
  } catch (err) {
    console.log(err);
  }
}

// endregion