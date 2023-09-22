# 项目配置文件 deploy.config.js

```ts
module.exports = {
   appid:"xxxxxx", //小程序项目appid (必填)
   env:"production", //项目环境，默认为prod，可选dev，test
   projectPath:"", //项目主目录
   runtimePath:"xxx/environments", //生成deploy.runtime.js的文件路径，用于使用暴露出来的配置信息（开发决定路径）
   version:"1.0.0", //项目版本
   desc:"bug fixed", //项目更新描述
   robot:1, //机器人
  ...CustomConfig (自定义设置)
}

type CustomConfig = {
   /*@custom*/
   privateKeyPath:string, //私有密钥
   appid:string, 
   baseUrl:string, //前缀
   qiniuRegion:string, //七牛云空间区域
   webviewBaseUrl:string, //webview空间
   defaultOrgId:string, //默认机构id
   /*@custom end*/
} 
```

# 错误码

| 错误码 | 英文解释           | 解释                       |
| ------ | ------------------ | -------------------------- |
| 1001   | INVALID_VERSION    | 无效版本                   |
| 1002   | INVALID_DESC       | 无效描述                   |
| 1003   | INVALID_ENV        | 无效环境                   |
| 1004   | PARAM_NO_PROVIDE   | 未提供必要参数             |
| 1005   | INVALID_ROBOT      | 无效机器人                 |
| 1006   | UNKNOWN_PARAM_NAME | 未知的参数名               |
| 1007   | CONFIG_NOT_FOUND   | 未找到deploy.config.js文件 |

```js
const ERRORCODE_DICT = {
    1001:"INVALID_VERSION", //无效版本
    1002:"INVALID_DESC", //无效描述
    1003:"INVALID_ENV", //无效环境
    1004:"PARAM_NO_PROVIDE", //未提供必要参数
    1005:"INVALID_ROBOT", //无效机器人
    1006:"UNKNOWN_PARAM_NAME",  //未知的参数名
    1007:"CONFIG_NOT_FOUND", //未找到deploy.config.js文件
    1008:"VERSION_IS_REQUIRED", //版本必填
    1009:"DESC_IS_REQUIRED", //描述必填
 }

function errorReport(errorCode){
   console.error(`ERROR_CODE::${errorCode}: ${ERRORCODE_DICT[errorCode]}`);
   return true;
}
```

# Argv（可配置参数）

| 参数名           | 默认值  | 是否必填 | 解释                   |
| ---------------- | ------- | -------- | ---------------------- |
| -v               | -       | true     | 当前微信小程序版本     |
| -m               | -       | true     | 当前微信小程序版本描述 |
| -dev/-test/-prod | -prod   | false    | 当前提交小程序环境     |
| -robot           | default | false    | 机器人编号             |

```js
miniprog-deploy -v 1.0.0 -m bug fixed (-dev | -test | -prod) -robot 1~30 (开发1～10，测试11～20，生产21～30)
```

# 校验文件（pattern.js）

```js
const VERSION_PATTERN = /^([1-9]|[1-9][0-9]).([0-9]|[1-9][0-9]).([0-9]|[1-9][0-9])$/;
const ROBOT_PATTERN = /^([1-9]|[1-2][0-9]|30)$/;

module.exports = {
  VERSION_PATTERN,
  ROBOT_PATTERN
}
```

# 工具文件（utils.js）

```js
const path = require("path");
const rootpath = path.resolve(process.cwd(), "./deploy.config.js");
const { errorReporter } = require("./error");
const { VERSION_PATTERN, ROBOT_PATTERN } = require("./pattern");
const { ENV_CONSTANT_PREFIX } = require("./constant");
const fs = require("fs");

const ENV_DICT = {
    "-dev": "dev",
    "-test": "test",
    "-prod": "prod",
};

const COMMAN_DICT = {
    "-v": "version",
    "-m": "desc",
    "-r": "robot",
    ...ENV_DICT,
};

let defaultWorkers = {
    env: "prod",
    robot: 1,
};

//向外部暴露workers，返回一个销毁函数
function mkRuntimeFile(workers){
   const { runtimePath } = workers; 
   if(!runtimePath) return;
   const runtimeAbsolutePath = path.resolve(process.cwd(),runtimePath);
   fs.writeFileSync(`${runtimeAbsolutePath}/deploy.runtime.js`,"module.exports = "+ JSON.stringify(workers));
   console.log(JSON.stringify(workers));
   return function rmRuntimeFile(){
    fs.rmSync(`${runtimeAbsolutePath}/deploy.runtime.js`);
   }
}


//获取部署配置
function getDeployConfig() {
    let deployConfig = null;
    try {
        deployConfig = require(rootpath);
    } catch (e) {
        console.log(e);
        errorReporter(1007);
    }

    defaultWorkers = {
        ...defaultWorkers,
        ...deployConfig,
    };
    return deployConfig;
}

//处理传入args
function paramHandler() {
    const args = process.argv.slice(2);
    const { error, workers } = argvWorker(args);
    return !error ? workers : null;
}

function argvWorker(options) {
    let optionWatcher = null;
    let error = null;
    const workers = { ...defaultWorkers };
    if (!options.length) return { error, workers };
    for (let meta of options) {
        if (optionWatcher != null) {
            switch (optionWatcher) {
                /*版本*/
                case "-v":
                    if (!VERSION_PATTERN.test(meta) || meta in COMMAN_DICT) {
                        error = errorReporter(1001);
                        return { error, workers };
                    } else workers.version = meta;
                    break;

                /*描述*/
                case "-m":

                    if (meta in COMMAN_DICT) {
                        //如果没有描述内容报错
                        if (!workers.desc) {
                            error = errorReporter(1002);
                            return { error, workers };
                        } else {
                            if (meta in ENV_DICT) workers.env = ENV_DICT[meta];
                            else {
                                optionWatcher = meta;
                                continue;
                            }
                        }
                    } else {
                      if(workers.desc == defaultWorkers.desc) workers.desc = meta;
                      else workers.desc = (workers.desc || "") + ` ${meta}`;
                    }
                    break;

                /*机器人*/
                case "-r":
                    if (!ROBOT_PATTERN.test(meta) || meta in COMMAN_DICT) {
                        error = errorReporter(1005);
                        return { error, workers };
                    } else workers.robot = Number(meta);
                    break;

                default:
                    error = errorReporter(1006);
                    return { error, workers };
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
                    return { error, workers };
            }
        }
    }
    //根据环境更改注释
    const env = (workers || {}).env;
    if (!(env in ENV_CONSTANT_PREFIX)) error = errorReporter(1003);
    if(!workers.version) error = errorReporter(1008);
    if(!workers.desc) error = errorReporter(1009);
    workers.desc = ENV_CONSTANT_PREFIX[env] + ` ${!!workers.desc ? workers.desc : ""}`;
    console.log(workers.desc);
    return { error, workers };
}

module.exports = {
    paramHandler,
    getDeployConfig,
    mkRuntimeFile 
};

```

# 主文件 （deploy.js）

```js
const ci = require("miniprogram-ci");
const { paramHandler,getDeployConfig } = require("./utils");

(async () => {
    const deployConfig = getDeployConfig();
    if(deployConfig == null) return;
    const workers = paramHandler();
    if(workers == null) return;
    const { version, desc,robot,env } = workers;
  
    const project = new ci.Project({
        appid: 'wx357664b7c2a9fbd5',
        type: 'miniProgram',
        projectPath: '..',
        privateKeyPath: 'the/path/to/privatekey',
        ignores: ['node_modules/**/*'],
    })

    const uploadResult = await ci.upload({
        project,
        version,
        robot,
        desc,
        setting: {
            es6: true,
            minify: true,
            minifyJS: true,
            minifyWXML: true,
            minifyWXSS: true
        },
        onProgressUpdate: console.log
    })
    console.log(uploadResult)
})()
```



