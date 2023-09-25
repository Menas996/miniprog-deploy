const ci = require('miniprogram-ci');
const { paramHandler, getDeployConfig, mkRuntimeFile } = require('./utils');

const mainThread = async () => {
    const deployConfig = getDeployConfig();
    if (deployConfig == null) return;
    const workers = paramHandler();
    if (workers == null) return;
    const rmRuntimeFile = mkRuntimeFile(workers);
    const { version, desc, robot, appid, privateKeyPath, projectPath } = workers;
    try {
        const project = new ci.Project({
            appid,
            privateKeyPath,
            projectPath,
            type: 'miniProgram',
            ignores: ['node_modules/**/*'],
        });

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
                minifyWXSS: true,
            },
            onProgressUpdate: console.log,
        });
        console.log(uploadResult);
    } catch (e) {
    } finally {
        rmRuntimeFile && rmRuntimeFile();
    }
};

module.exports = {
    mainThread,
};
