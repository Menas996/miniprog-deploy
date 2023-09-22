const path = require("path");
const rootpath = path.resolve(process.cwd(),"./deploy.config.js");


const ENV_DICT = {
    "-dev":"development",
   "-test":"test",
   "-prod":"production"
}

const COMMAN_DICT = {
   "-v":"version",
   "-m":"desc",
   "-r":"rebot",
   ...ENV_DICT
}

const DEFAULT_WORKERS = {
  env:"production",
  desc:"bug fixed",
  robot:1
}

//获取部署配置
function getDeployConfig(){
  let deployConfig = null;
   try{  deployConfig = require(rootpath);
   }catch(e){  errorReporter(1007)  };
   DEFAULT_WORKERS = { ...DEFAULT_WORKERS,...deployConfig };
   return deployConfig;
}


//处理传入args
function paramHandler(){
   const args = process.argv.slice(2);
   const { error,workers } = argvWorker(args);
   return !error ? workers : null;
}



function argvWorker(options){
   let optionWatcher = null;
   let error = null;
   const workers = DEFAULT_WORKERS;
   if(!options.length) return {error,workers};
   for(let meta of options){
      if(optionWatcher != null){
        switch(optionWatcher){
            /*版本*/
          case "-v":
            
            if(!VERSION_PATTERN.test(meta) || meta in COMMAN_DICT){
              error = errorReporter(1001);
              return {error,workers}
            }else workers.version = meta;
            break;
            
             /*描述*/
          case "-m":
            
            if(meta in COMMAN_DICT){
               if(!workers.desc){
                 error = errorReporter(1002);
                  return { error,workers }
               }else{
                  optionWatcher = meta;
                  continue;
               }
            }else workers.desc += ` ${meta}`;
            break;
            
            
            /*机器人*/
          case "-r":
            if(!ROBOT_PATTERN.test(meta) || meta in COMMAN_DICT){
               error = errorReporter(1005);
               return { error,workers }
            }else workers.robot = Number(meta);
            break;
            
           default:
            error = errorReporter(1006);
            return { error,workers }
        }
        if(optionWatcher != "-m")  optionWatcher = null;
      }else{
        switch(meta){
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
            return { error,workers };
        }
      }
  }
  return { error,workers }
}

module.exports = {
  paramHandler,getDeployConfig
}