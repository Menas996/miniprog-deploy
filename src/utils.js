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
