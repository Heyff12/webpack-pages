var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var htmlWebpackPlugin = require('html-webpack-plugin'); //html的页面生产
var px2rem = require('postcss-px2rem'); //css像素自适应--移动端页面需要
var WebpackBrowserPlugin = require('webpack-browser-plugin'); //自动在浏览器打开页面--只有dev使用--本例没有使用
module.exports = {
    // context:,
    // entry: './src_much/script/main.js',//一个js文件--single entry
    // entry:['./src_much/script/main.js','./src_much/script/a.js'],//两个js文件 合并
    entry: {
        layer1: './src/pages/layer1/index.js',
        layer2: './src/pages/layer2/index.js',
        layer3: './src/pages/layer3/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        // filename: 'js/[name]-[chunkhash].js',
        //publicPath: 'http://cdn.com/'
    },
    // devServer: {
    //     port: 8083,
    //     inline: true,
    // },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: path.resolve(__dirname, 'node_modules'), //不需要babel编译的范围
            include: path.resolve(__dirname, 'src'), //打包的范围
            query: {
                presets: ['latest']
            }
        }, {
            test: /\.html$/,
            loader: 'html-loader',
        }, {
            test: /\.tpl$/,
            loader: 'ejs-loader',
        }, {
            test: /\.ejs$/,
            loader: 'ejs-loader',
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader?importLoaders=1!postcss-loader',
            // loaders:['style-loader','css-loader','postcss-loader']
        }, {
            test: /\.less$/,
            loader: 'style-loader!css-loader!postcss-loader!less-loader',
        }, {
            test: /\.json$/,
            loader: 'json-loader',
        }, {
            test: /\.(png|jpg|gif|svg|jpeg)$/i,
            // test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 20000,
                name: 'img/[name]-[hash:5].[ext]'
            }
            //loaders: ['url-loader?limit=20000&name=assets/[name]-[hash:5].[ext]','image-webpack-loader'],
        }]
    },
    plugins: [
        //new WebpackBrowserPlugin(),
        //new webpack.BannerPlugin('# coding: utf-8'),//在js的头部增加信息
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function() {
                    // return [autoprefixer({ browsers: ['last 5 versions'] }), px2rem({ remUnit: 37.5 })];
                    return [autoprefixer({ browsers: ['last 5 versions'] })];
                }
            }
        }),
        new htmlWebpackPlugin({
            // filename:'index-[hash].html',
            filename: 'layer1.html', //页面的生产名字
            template: 'index.ejs', //页面模板
            title: 'webpack is layer1', //网页title
            inject: 'body', //js的存放位置
            chunks:['layer1'],//引入的js
            // minify:{//html页面压缩
            //  removeComments:true,//删除注释
            //  collapseWhitespace:true//删除空格
            // }
        }),
        new htmlWebpackPlugin({
            filename: 'layer2.html',
            template: 'index.ejs',
            title: 'webpack is layer2',
            inject: 'body',
            chunks:['layer2'],
            // minify:{
            //  removeComments:true,//删除注释
            //  collapseWhitespace:true//删除空格
            // }
        }),
        new htmlWebpackPlugin({
            filename: 'layer3.html',
            template: 'index.ejs',
            title: 'webpack is layer3',
            inject: 'body',
            chunks:['layer3'],
            // minify:{
            //  removeComments:true,//删除注释
            //  collapseWhitespace:true//删除空格
            // }
        })
    ]
};
