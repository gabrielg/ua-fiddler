var pageMod            = require("sdk/page-mod");
var preferencesService = require("sdk/preferences/service");
var data               = require("sdk/self").data;

var uaOverridePref = "general.useragent.override";
var defaultInclude = "data:text/html,ua-switcher:*";

var validUserAgents = JSON.parse(data.load("user-agents.json"))

exports.switchUA = function(ua, custom) {
  if (ua === "default") {
    console.log("Resetting UA");
    preferencesService.reset(uaOverridePref);
  } else if (validUserAgents.hasOwnProperty(ua)) {
    console.log("Switching UA:", ua);
    preferencesService.set(uaOverridePref, validUserAgents[ua]);
  } else if (custom === true) {
    console.log("Switching to custom UA:", ua);
    preferencesService.set(uaOverridePref, ua);
  } else {
    console.log("Unknown UA:", ua);
  }
};

exports.extractUA = function(uri) {
  var uri = decodeURI(uri);

  // data:text/html,ua-switcher:ios
  //                            ^
  var ua = uri.split(":", 3)[2];

  if (ua.indexOf("custom|") === 0) {
    var customUA = ua.split("|", 2)[1];

    return {ua: customUA, isCustom: true};
  } else {
    return {ua: ua, isCustom: false};
  }
};

pageMod.PageMod({
  include: defaultInclude,
  contentScript: '',
  onAttach: function(worker) {
    var uaInfo = exports.extractUA(worker.url);
    exports.switchUA(uaInfo.ua, uaInfo.isCustom);
  }
});
