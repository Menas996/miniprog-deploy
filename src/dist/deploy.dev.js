"use strict";

var ci = require('miniprogram-ci');

var _require = require('./utils'),
    paramHandler = _require.paramHandler,
    getDeployConfig = _require.getDeployConfig,
    mkRuntimeFile = _require.mkRuntimeFile;

var mainThread = function mainThread() {
  var deployConfig, workers, rmRuntimeFile, version, desc, robot, appid, privateKeyPath, projectPath, project, uploadResult;
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
          rmRuntimeFile = mkRuntimeFile(workers);
          version = workers.version, desc = workers.desc, robot = workers.robot, appid = workers.appid, privateKeyPath = workers.privateKeyPath, projectPath = workers.projectPath;
          _context.prev = 8;
          project = new ci.Project({
            appid: appid,
            privateKeyPath: privateKeyPath,
            projectPath: projectPath,
            type: 'miniProgram',
            ignores: ['node_modules/**/*']
          });
          _context.next = 12;
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

        case 12:
          uploadResult = _context.sent;
          console.log(uploadResult);
          _context.next = 18;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](8);

        case 18:
          _context.prev = 18;
          rmRuntimeFile && rmRuntimeFile();
          return _context.finish(18);

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[8, 16, 18, 21]]);
};

module.exports = {
  mainThread: mainThread
};