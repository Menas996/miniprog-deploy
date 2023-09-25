#!/usr/bin/env node
const { mainThread } = require("./src/deploy");
const { getConfig } = require("./src/hooks");

mainThread();

module.exports = { getConfig };