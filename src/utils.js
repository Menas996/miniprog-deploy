const {
    VERSION_PATTERN,
    DEFAULT_DESC
} = require("./pattern");

const ERRORS = {
    INVALID_VERSION:"invalid version!",
    INVALID_OPTION:"invalid option",
    PARAM_NO_PROVIDE:"paramter no provide of option"
}


function sendError(errorCode,option){
    const errMsg = ERRORS[errorCode];
    if(errorCode == "INVALID_OPTION") console.log(`err::${errorCode}:${errMsg} ${option}`);
    if(errorCode == "PARAM_NO_PROVIDE") console.log(`err::${errorCode}:${errMsg} ${option}`);
    else if(errMsg) console.log(`err::${errorCode}:${errMsg}`);
    return true;
}

function getUpdateMessage() {
    return new Promise((resolve) => {
        const args = process.argv.slice(2);
        console.log(args)
        const { workers, error } = optionsWorker(args);
        resolve({ isSuccess: !error, result: workers })
    })
}

function optionsWorker(options){
    let optionWatcher = null;
    const workers = {};
    let error = null;
    for(let i = 0;i < options.length;i++){
        const option = options[i];
        if (optionWatcher != null) {
            switch (optionWatcher) {
                case "-version":
                    if (!VERSION_PATTERN.test(version)){
                        error = sendError("VALID_VERSION");
                        break;
                    }else workers.version = option;
                    continue;
                case "--m":
                    workers.desc = option;
                    continue;
            }
            optionWatcher = null;
       }else{
         switch(option){
             case "--m":
             case "-version":
             case "--d":
                 if(i === options.length - 1){
                    error = sendError("PARAM_NO_PROVIDE",option);
                    break;
                 }
                 optionWatcher = option;
                 continue;
             default:
                error = sendError("INVALID_OPTION",option);
                break;
         }
       }
    }
    return { workers, error };
}

module.exports = {
    getUpdateMessage
}