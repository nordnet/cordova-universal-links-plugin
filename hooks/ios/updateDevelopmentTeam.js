(function () {
  // properties
  'use strict';
  var fs = require('fs');
  var path = require('path');
  var FILENAME = 'build.json';

  // entry
  module.exports = {
    addDevelopmentTeam: addDevelopmentTeam
  };

  // updates the development team for Universal Links
  function addDevelopmentTeam (preferences) {
    var file = path.join(preferences.projectRoot, FILENAME);
    var content = getBuildJson(file);

    content = convertStringToJson(content);
    createDefaultBuildJson(content);
    updateDevelopmentTeam(content, preferences);
    content = convertJsonToString(content);
    setBuildJson(file, content);
  }

  // json helper functions
  function convertJsonToString (content) {
    try {
      // pretty-json
      return JSON.stringify(content, null, 2);
    } catch (err) {
      throw new Error('Cannot write build.json within your root directory.');
    }
  }

  function convertStringToJson (content) {
    // handle blank file
    content = !content ? '{}' : content;
    try {
      return JSON.parse(content);
    } catch (err) {
      throw new Error('Cannot read build.json within your root directory.');
    }
  }

  // read build.json
  function getBuildJson (file) {
    try {
      return fs.readFileSync(file, 'utf8');
    } catch (err) {
      // handle no file
      return '{}';
    }
  }

  // write build.json
  function setBuildJson (file, content) {
    fs.writeFileSync(file, content, 'utf8');
  }

  // creates basic build.json if key-value pairs are missing
  //    {
  //      "ios": {
  //        "debug": {
  //          "developmentTeam": "FG35JLLMXX4A"
  //        },
  //        "release": {
  //          "developmentTeam": "FG35JLLMXX4A"
  //        }
  //      }
  //    }
  function createDefaultBuildJson (content) {
    if (!content.ios) {
      content.ios = {};
    }
    if (!content.ios.debug) {
      content.ios.debug = {};
    }
    if (!content.ios.release) {
      content.ios.release = {};
    }
  }

  // update build.json with developmentTeam from config.xml
  function updateDevelopmentTeam (content, preferences) {
    var release = content.ios.release.developmentTeam || preferences.iosTeamRelease;
    var debug = content.ios.debug.developmentTeam || (preferences.iosTeamDebug || release);

    if (release === null) {
      throw new Error('Invalid "ios-team-release" in <universal-links> in your config.xml or build.json.');
    }

    content.ios.release.developmentTeam = release;
    content.ios.debug.developmentTeam = debug;
  }
})();
