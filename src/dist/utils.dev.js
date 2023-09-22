#!/usr/bin/env node
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var path = require("path");

var rootpath = path.resolve(process.cwd(), "./deploy.config.js");
var ENV_DICT = {
  "-dev": "development",
  "-test": "test",
  "-prod": "production"
};

var COMMAN_DICT = _objectSpread({
  "-v": "version",
  "-m": "desc",
  "-r": "rebot"
}, ENV_DICT);

var DEFAULT_WORKERS = {
  env: "production",
  desc: "bug fixed",
  robot: 1
}; //获取部署配置

function getDeployConfig() {
  var deployConfig = null;

  try {
    deployConfig = require(rootpath);
  } catch (e) {
    errorReporter(1007);
  }

  ;
  DEFAULT_WORKERS = (_readOnlyError("DEFAULT_WORKERS"), _objectSpread({}, DEFAULT_WORKERS, {}, deployConfig));
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
  var workers = DEFAULT_WORKERS;
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
              if (!workers.desc) {
                error = errorReporter(1002);
                return {
                  error: error,
                  workers: workers
                };
              } else {
                optionWatcher = meta;
                continue;
              }
            } else workers.desc += " ".concat(meta);

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
    }
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

  return {
    error: error,
    workers: workers
  };
}

module.exports = {
  paramHandler: paramHandler,
  getDeployConfig: getDeployConfig
};