var main        = require("./main");
var windowUtils = require("sdk/window/utils");
var data        = require("sdk/self").data;

var userAgents = JSON.parse(data.load("user-agents.json"))
var window     = windowUtils.getMostRecentBrowserWindow();
var defaultUA  = window.navigator.userAgent;

var randomUA = function() {
  var keys = Object.keys(userAgents);
  return keys[Math.floor(Math.random() * keys.length)];
};

exports["test switching UA to a known type"] = function(assert) {
  var ua = randomUA();
  main.switchUA(ua);
  assert.equal(userAgents[ua], window.navigator.userAgent);
};

exports["test switching UA to a custom type"] = function(assert) {
  var customUA = "This is some terrible fake UA/Cool";
  main.switchUA(customUA, true);
  assert.equal(customUA, window.navigator.userAgent);
};

exports["test switching UA to the default type"] = function(assert) {
  main.switchUA("default");
  assert.equal(defaultUA, window.navigator.userAgent);
};

exports["test switching UA to an unknown type"] = function(assert) {
  var currentUA = window.navigator.userAgent;
  main.switchUA("total garbage");
  assert.equal(currentUA, window.navigator.userAgent);
};

exports["test extracting a short UA name from the URL"] = function(assert) {
  var extracted = main.extractUA("data:text/html,ua-switcher:ipad");
  assert.equal("ipad", extracted.ua);
  assert.equal(false, extracted.isCustom);
};

exports["test extracting a custom UA from the URL"] = function(assert) {
  var extracted = main.extractUA("data:text/html,ua-switcher:custom|Special%20UA");
  assert.equal("Special UA", extracted.ua);
  assert.equal(true, extracted.isCustom);
};

require("sdk/test").run(exports);
