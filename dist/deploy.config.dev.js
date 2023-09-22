"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CustomConfig = {
  /*@custom*/
  // privateKeyPath,
  // appId: string,
  // baseUrl: string, //前缀
  // qiniuRegion: string, //七牛云空间区域
  // webviewBaseUrl: string, //webview空间
  // defaultOrgId: string, //默认机构id

  /*@custom end*/
};
module.exports = _objectSpread({
  appid: "wx357664b7c2a9fbd5",
  //小程序项目appid (必填)
  env: "prod",
  //项目环境，默认为production，可选dev，test
  projectPath: "./",
  //项目主目录
  // version: "1.3.2", //项目版本
  desc: "bug fixed",
  //项目更新描述
  robot: 1
}, CustomConfig);