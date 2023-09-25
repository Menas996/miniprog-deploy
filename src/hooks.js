function getConfig() {
    let config = null;
    try {
        const { runtimeAbsolutePath } = require('./utils');
        config = require(runtimeAbsolutePath);
    } catch (e) {}
    return config;
}

module.exports = {
    getConfig,
};
