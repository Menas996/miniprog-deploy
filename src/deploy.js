const ci = require("miniprogram-ci");
const { getUpdateMessage } = require("./utils");

(async () => {
    const { isSuccess, result } = await getUpdateMessage();
    if(!isSuccess) return;
    const { version, desc } = result;
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
        desc,
        setting: {
            es6: true,
            minify: true,
            minifyJS: true,
            minifyWXML: true,
            minifyWXSS: true
        },
        onProgressUpdate: console.log,
    })
    console.log(uploadResult)
})()