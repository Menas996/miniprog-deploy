"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var path = require("path");

var rootpath = path.resolve(process.cwd(), "./deploy.config.js");

var _require = require("./error"),
    errorReporter = _require.errorReporter;

var _require2 = require("./pattern"),
    VERSION_PATTERN = _require2.VERSION_PATTERN,
    ROBOT_PATTERN = _require2.ROBOT_PATTERN;

var _require3 = require("./constant"),
    ENV_CONSTANT_PREFIX = _require3.ENV_CONSTANT_PREFIX;

var fs = require("fs");

var ENV_DICT = {
  "-dev": "dev",
  "-test": "test",
  "-prod": "prod"
};

var COMMAN_DICT = _objectSpread({
  "-v": "version",
  "-m": "desc",
  "-r": "robot"
}, ENV_DICT);

var defaultWorkers = {
  env: "prod",
  robot: 1
}; //向外部暴露workers，返回一个销毁函数

function mkRuntimeFile(workers) {
  var runtimePath = workers.runtimePath;
  if (!runtimePath) return;
  var runtimeAbsolutePath = path.resolve(process.cwd(), runtimePath);
  fs.writeFileSync("".concat(runtimeAbsolutePath, "/deploy.runtime.js"), "module.exports = " + JSON.stringify(workers));
  console.log(JSON.stringify(workers));
  return function rmRuntimeFile() {
    fs.rmSync("".concat(runtimeAbsolutePath, "/deploy.runtime.js"));
  };
} //获取部署配置


function getDeployConfig() {
  var deployConfig = null;

  try {
    deployConfig = require(rootpath);
  } catch (e) {
    console.log(e);
    errorReporter(1007);
  }

  defaultWorkers = _objectSpread({}, defaultWorkers, {}, deployConfig);
  return deployConfig;
} //处理传入args


function paramHandler() {
  var args = process.argv.slice(2);

  var _argvWorker = argvWorker(args),
      error = _argvWorker.error,
      workers = _argvWorker.workers;

  return !error ? workers : null;
}

function argvWorker(options) {
  var optionWatcher = null;
  var error = null;

  var workers = _objectSpread({}, defaultWorkers);

  if (!options.length) return {
    error: error,
    workers: workers
  };
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var meta = _step.value;

      if (optionWatcher != null) {
        switch (optionWatcher) {
          /*版本*/
          case "-v":
            if (!VERSION_PATTERN.test(meta) || meta in COMMAN_DICT) {
              error = errorReporter(1001);
              return {
                error: error,
                workers: workers
              };
            } else workers.version = meta;

            break;

          /*描述*/

          case "-m":
            if (meta in COMMAN_DICT) {
              //如果没有描述内容报错
              if (!workers.desc) {
                error = errorReporter(1002);
                return {
                  error: error,
                  workers: workers
                };
              } else {
                if (meta in ENV_DICT) workers.env = ENV_DICT[meta];else {
                  optionWatcher = meta;
                  continue;
                }
              }
            } else {
              if (workers.desc == defaultWorkers.desc) workers.desc = meta;else workers.desc = (workers.desc || "") + " ".concat(meta);
            }

            break;

          /*机器人*/

          case "-r":
            if (!ROBOT_PATTERN.test(meta) || meta in COMMAN_DICT) {
              error = errorReporter(1005);
              return {
                error: error,
                workers: workers
              };
            } else workers.robot = Number(meta);

            break;

          default:
            error = errorReporter(1006);
            return {
              error: error,
              workers: workers
            };
        }

        if (optionWatcher != "-m") optionWatcher = null;
      } else {
        switch (meta) {
          case "-v":
          case "-m":
          case "-r":
            optionWatcher = meta;
            break;

          case "-dev":
          case "-prod":
          case "-test":
            workers.env = ENV_DICT[meta];
            break;

          default:
            error = errorReporter(1006);
            return {
              error: error,
              workers: workers
            };
        }
      }
    } //根据环境更改注释

  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var env = (workers || {}).env;
  if (!(env in ENV_CONSTANT_PREFIX)) error = errorReporter(1003);
  if (!workers.version) error = errorReporter(1008);
  if (!workers.desc) error = errorReporter(1009);
  workers.desc = ENV_CONSTANT_PREFIX[env] + " ".concat(!!workers.desc ? workers.desc : "");
  console.log(workers.desc);
  return {
    error: error,
    workers: workers
  };
}

module.exports = {
  paramHandler: paramHandler,
  getDeployConfig: getDeployConfig,
  mkRuntimeFile: mkRuntimeFile
};