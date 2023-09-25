"use strict";

function getConfig() {
  var config = null;

  try {
    var _require = require('./utils'),
        runtimeAbsolutePath = _require.runtimeAbsolutePath;

    config = require(runtimeAbsolutePath);
  } catch (e) {}

  return config;
}

module.exports = {
  getConfig: getConfig
};