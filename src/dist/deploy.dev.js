#!/usr/bin/env node
"use strict";

var ci = require("miniprogram-ci");

var _require = require("./utils"),
    paramHandler = _require.paramHandler,
    getDeployConfig = _require.getDeployConfig;

var mainThread = function mainThread() {
  var deployConfig, workers, version, desc, robot, appid, privateKeyPath, projectPath, project, uploadResult;
  return regeneratorRuntime.async(function mainThread$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          deployConfig = getDeployConfig();

          if (!(deployConfig == null)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return");

        case 3:
          workers = paramHandler();

          if (!(workers == null)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return");

        case 6:
          version = workers.version, desc = workers.desc, robot = workers.robot, appid = workers.appid, privateKeyPath = workers.privateKeyPath, projectPath = workers.projectPath;
          project = new ci.Project({
            appid: appid,
            privateKeyPath: privateKeyPath,
            projectPath: projectPath,
            type: 'miniProgram',
            ignores: ['node_modules/**/*']
          });
          _context.next = 10;
          return regeneratorRuntime.awrap(ci.upload({
            project: project,
            version: version,
            robot: robot,
            desc: desc,
            setting: {
              es6: true,
              minify: true,
              minifyJS: true,
              minifyWXML: true,
              minifyWXSS: true
            },
            onProgressUpdate: console.log
          }));

        case 10:
          uploadResult = _context.sent;
          console.log(uploadResult);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = {
  mainThread: mainThread
};