const path = require("path");

// 插件
const CracoLessPlugin = require("craco-less");

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
        },
    ],
    webpack: {
        alias: {
            "@": path.resolve(__dirname, "src")
        },
        plugins: {
            add: [],
            remove: [],
        },
        configure: (webpackConfig, { env, path }) => {
            return webpackConfig;
        },
    },
    devServer: (devServerConfig, { env, path, proxy, allowedHost }) => {
        return devServerConfig;
    },
    babel: {
        presets: [],
        plugins: [
            [
                "import",
                {
                    libraryName: "antd",
                    libraryDirectory: "es",
                    style: true,
                },
            ],
        ],
        loaderOptions: (babelLoaderOptions, { env, path }) => {
            return babelLoaderOptions;
        },
    },
};