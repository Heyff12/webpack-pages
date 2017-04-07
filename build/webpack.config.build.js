var merge = require('webpack-merge');
var configBase = require('./webpack.config.base.js'); // 获取入口文件
var untils = require('./untils.js'); // 全局变量配置
var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin'); // 删除文件夹--只有build使用
var ImageminPlugin = require('imagemin-webpack-plugin').default; //图片压缩--只有build使用
console.log(process.env.NODE_ENV);

module.exports = merge(configBase, {
    output: {
        publicPath: untils.conf_detail.publicPath_build, //填写后，能够让引入资源的路径变成绝对定位,例如“/qudao/v1/static”
    },
    devtool: '#source-map', //生成map文件----只有build使用
    plugins: [
        new CleanPlugin(['dist'], {
            root: path.resolve(__dirname, '../')
        }),//删除dist文件夹
        new ImageminPlugin({
            //disable: false,
            test: path.resolve(__dirname, '../src/assets/**'),
            optipng: {
                optimizationLevel: 6
            }
        }),//图片压缩
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            },
            // RUN_ENV: JSON.stringify('production')
            RUN_ENV: JSON.stringify(untils.env)
        }),
        //报错
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        //暂时不需要
        // split vendor js into its own file
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     minChunks: function(module, count) {
        //         // any required modules inside node_modules are extracted to vendor
        //         return (
        //             module.resource &&
        //             /\.js$/.test(module.resource) &&
        //             module.resource.indexOf(
        //                 path.join(__dirname, '../node_modules')
        //             ) === 0
        //         )
        //     }
        // }),
        // // extract webpack runtime and module manifest to its own file in order to
        // // prevent vendor hash from being updated whenever app bundle is updated
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'manifest',
        //     chunks: ['vendor']
        // })
    ]
})
