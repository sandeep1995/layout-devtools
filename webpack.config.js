const CopyWebpackPlugin = require('copy-webpack-plugin');

const libraryName = 'datatable_devtools';
const OUT_FILE = `${libraryName}.js`;

let panelConfig = Object.assign({}, {
    entry: {
        bundle: './src/panel.js',
    },
    output: {
        path: `${__dirname}/dist`,
        filename: OUT_FILE,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    devtool: 'source-map',
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader' },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src', to: '', ignore: ['panel.js', 'script.js'] },
        ]),
    ],
    devServer: {
        inline: true,
        contentBase: './src',
    },
});

let scriptConfig = Object.assign({}, {
    entry: {
        bundle: './src/script.js',
    },
    output: {
        path: `${__dirname}/dist`,
        filename: 'script.js',
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    devtool: 'source-map',
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader' },
        ],
    },
});

module.exports = [
    panelConfig, scriptConfig,
];
