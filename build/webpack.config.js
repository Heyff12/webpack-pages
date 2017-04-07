var merge = require('webpack-merge');
var configBase = require('./webpack.config.base.js'); // 获取入口文件
var untils = require('./untils.js'); // 全局变量配置
var webpack = require('webpack');
var WebpackBrowserPlugin = require('webpack-browser-plugin'); //自动在浏览器打开页面--只有dev使用

module.exports = merge(configBase, {
    output: {
        publicPath: untils.conf_detail.publicPath_conf, //填写后，能够让引入资源的路径变成绝对定位,可以实现实时刷新
    },
    devServer: {
        port: untils.conf_detail.port,
        inline: true,
        // colors: true, //终端中输出结果为彩色
        // hot: true,
        //progress:true,
    }, //仅config使用
    plugins: [
        //new WebpackBrowserPlugin(),//打开浏览器，暂时不执行
        new webpack.DefinePlugin({
            RUN_ENV: JSON.stringify(untils.env)
        }),
    ]
})
