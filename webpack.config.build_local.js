var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var htmlWebpackPlugin = require('html-webpack-plugin'); //html的页面生产
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独生成--只有build使用
var CleanPlugin = require('clean-webpack-plugin'); // 删除文件夹--只有build使用
module.exports = {
    // context:,
    entry: {
        layer1: './src/pages/layer1/index.js',
        layer2: './src/pages/layer2/index.js',
        layer3: './src/pages/layer3/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        // filename: '[name].js',
        filename: 'js/[name]-[chunkhash].js',
        //publicPath: 'http://cdn.com/'
        // filename: utils.assetsPath('[name]-[chunkhash].js'),
        // chunkFilename: utils.assetsPath('[id]-[chunkhash].js')
    },
    devtool: '#source-map', //生成map文件----只有build使用
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
            test: /\.css$/,
            loader: 'style-loader!css-loader?importLoaders=1!postcss-loader',
            // loaders:['style-loader','css-loader','postcss-loader']
        }, {
            test: /\.less$/,
            //loader: 'style-loader!css-loader!postcss-loader!less-loader',            
            loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!postcss-loader!less-loader' }), //写法不同----只有build使用
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
        new CleanPlugin(['dist']),
        new ExtractTextPlugin('css/[name].[contenthash].css'),
        //new webpack.BannerPlugin(''),//在js的头部增加信息
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function() {
                    return [autoprefixer];
                }
            }
        }),
        new htmlWebpackPlugin({
            // filename:'index-[hash].html',
            filename: 'layer1.html', //页面的生产名字
            template: 'index.ejs', //页面模板
            title: 'webpack is layer1', //网页title
            inject: 'body', //js的存放位置
            chunks: ['layer1'], //引入的js
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
            chunks: ['layer2'],
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
            chunks: ['layer3'],
            // minify:{
            //  removeComments:true,//删除注释
            //  collapseWhitespace:true//删除空格
            // }
        }),
    ]
};