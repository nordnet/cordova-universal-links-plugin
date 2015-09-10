
var exec = require('cordova/exec'),
  channel = require('cordova/channel');

// Reference name for the plugin
PLUGIN_NAME = 'UniversalLinks',

  // Plugin methods on the native side that can be called from JavaScript
  pluginNativeMethod = {
    INITIALIZE: 'jsInitPlugin'
  },

  // Called when Cordova is ready for work.
  // Here we will send default callback to the native side through which it will send to us different events.
  channel.onCordovaReady.subscribe(function() {
    ensureCustomEventExists();
    exec(nativeCallback, null, PLUGIN_NAME, pluginNativeMethod.INITIALIZE, []);
  });

/**
 * Method is called when native side sends us different events.
 * Those events can be about update download/installation process.
 *
 * @param {String} msg - JSON formatted string with call arguments
 */
function nativeCallback(msg) {
  var ulEvent = new CustomEvent(msg.event, {
    'detail': msg.data
  });
  
  document.dispatchEvent(ulEvent);
}

/*
 * Polyfill for adding CustomEvent which may not exist on older versions of Android.
 * See https://developer.mozilla.org/fr/docs/Web/API/CustomEvent for more details.
 */
function ensureCustomEventExists() {
  // Create only if it doesn't exist
  if (window.CustomEvent) {
    return;
  }

  var CustomEvent = function(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
}
