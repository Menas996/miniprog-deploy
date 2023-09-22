 
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
 
 function errorReporter(errorCode){
    console.error(`ERROR_CODE::${errorCode}: ${ERRORCODE_DICT[errorCode]}`);
    return true;
}

module.exports= {
    errorReporter
}