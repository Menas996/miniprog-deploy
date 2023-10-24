const path = require('path');

module.exports = {
    mode: 'production',
    entry: './main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:"babel-loader",
                exclude:/(node_modules)/
            }
        ]
    },
    externals: {
        fs: require('fs'),
    },
    resolve: {
        fallback: { path: false },
    },
};
