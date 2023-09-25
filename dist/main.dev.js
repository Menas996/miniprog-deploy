#!/usr/bin/env node
"use strict";

var _require = require("./src/deploy"),
    mainThread = _require.mainThread;

var _require2 = require("./src/hooks"),
    getConfig = _require2.getConfig;

mainThread();
module.exports = {
  getConfig: getConfig
};