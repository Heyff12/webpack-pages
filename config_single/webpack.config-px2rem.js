var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var htmlWebpackPlugin = require('html-webpack-plugin'); //html的页面生产
var px2rem = require('postcss-px2rem'); //css像素自适应
var WebpackBrowserPlugin = require('webpack-browser-plugin'); //自动在浏览器打开页面--只有dev使用
module.exports = {
    // context:,
    entry: './src/app.js', //一个js文件--single entry
    output: {
        // path: './dist/js',
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name]-[chunkhash].js',
        //publicPath:'/qudao/v1/static/',//生产的html在资源路径前面添加的内容
        //sourceMapFilename:'js/[name]-[chunkhash].js.map',
    },
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
                name: 'assets/[name]-[hash:5].[ext]'
            }
            //loaders: ['url-loader?limit=20000&name=assets/[name]-[hash:5].[ext]','image-webpack-loader'],
        }]
    },
    devServer: {
        port: 8084,
        inline: true,
    },
    // postcss: [
    //     require('autoprefixer')({
    //         broswers: ['last 5 versions']
    //     })
    // ],
    plugins: [
        new WebpackBrowserPlugin(),
        //new webpack.BannerPlugin('# coding: utf-8'),//在js的头部增加信息
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function() {
                    return [autoprefixer({ browsers: ['last 5 versions'] }), px2rem({ remUnit: 37.5 })];
                }
            }
        }),
        new htmlWebpackPlugin({
            filename: 'index.html', //页面的生产名字
            template: 'index.html', //页面模板
            inject: 'body', //js的存放位置
            title: 'webpack demo', //网页title
            // chunks:['main','a'],//引入的js
            //excludeChunks:['b','c'],//排除的js
            // minify:{//html页面压缩
            //  removeComments:true,//删除注释
            //  collapseWhitespace:true//删除空格
            // }
        }),
    ]
};
