(function() {

  var fs = require('fs'),
    path = require('path'),
    ConfigXmlHelper = require('./configXmlHelper.js'),
    LINK_PLACEHOLDER = '[__LINKS__]',
    LINK_TEMPLATE = '<link rel="alternate" href="android-app://<package_name>/<scheme>/<host><path>" />';

  module.exports = {
    generate: generateWebHook
  };

  function generateWebHook(cordovaContext, pluginPreferences) {
    var projectRoot = cordovaContext.opts.projectRoot,
      template = readTemplate(projectRoot);

    if (template == null || template.length == 0) {
      return;
    }

    var linksToInsert = generateLinksSet(cordovaContext, projectRoot, pluginPreferences),
      hookContent = template.replace(LINK_PLACEHOLDER, linksToInsert);

    saveWebHook(projectRoot, hookContent);
  }

  function readTemplate(projectRoot) {
    var filePath = path.join(projectRoot, 'plugins', 'cordova-universal-links-plugin', 'web_hooks', 'android_web_hook_tpl.html'),
      tplData = null;

    try {
      tplData = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      console.warn('Template file for android web hook is not found!');
      console.warn(err);
    }

    return tplData;
  }

  function generateLinksSet(ctx, projectRoot, pluginPreferences) {
    var packageName = getPackageName(ctx, projectRoot);
      linkTpl = LINK_TEMPLATE.replace('<package_name>', packageName),
      content = '';

    pluginPreferences.forEach(function(host) {
      host.paths.forEach(function(hostPath) {
        content += generateLink(linkTpl, host.scheme, host.name, hostPath) + '\n';
      });
    });

    return content;
  }

  function generateLink(linkTpl, scheme, host, path) {
    linkTpl = linkTpl.replace('<scheme>', scheme).replace('<host>', host);
    if (path == null || path === '*') {
      return linkTpl.replace('<path>','');
    }

    if (path.indexOf('*') >= 0) {
      path = path.replace('*', '.*');
    }

    if (path.indexOf('/') != 0) {
      path = '/' + path;
    }

    return linkTpl.replace('<path>', path);
  }

  function getPackageName(ctx, projectRoot) {
    var configFilePath = path.join(projectRoot, 'config.xml'),
      ConfigParser = ctx.requireCordovaModule('cordova-lib/src/configparser/ConfigParser'),
      config = new ConfigParser(configFilePath);

    var packageName = config.android_packageName();
    if (packageName === undefined) {
      packageName = config.packageName();
    }

    return packageName;
  }

  function saveWebHook(projectRoot, hookContent) {
    var filePath = path.join(projectRoot, 'android_web_hook.html');
    try {
      fs.writeFileSync(filePath, hookContent, 'utf8');
    } catch (err) {
      console.warn('Failed to create android web hook!');
      console.warn(err);
    }
  }

})();
