//在执行npm run build之前，限执行图片压缩，依次执行--gulp del;gulp images
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var htmlWebpackPlugin = require('html-webpack-plugin'); //html的页面生成
var untils = require('./untils.js'); // 全局变量配置
var px2rem = require('postcss-px2rem'); //css像素自适应--移动端页面需要
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独生成


var baseWebpackConfig = {
    // context:,
    // entry: './src_much/script/main.js',//一个js文件--single entry
    // entry:['./src_much/script/main.js','./src_much/script/a.js'],//两个js文件 合并
    // entry: {
    //     layer1: './src/pages/layer1/index.js',
    //     layer2: './src/pages/layer2/index.js',
    //     layer3: './src/pages/layer3/index.js',
    // },
    entry: untils.entry,
    output: {
        path: path.resolve(__dirname, '../dist'),
        // filename: '[name].js',
        filename: 'js/[name]-[hash].js',
    },
    resolve: {
        extensions: ['.js', '.vue', '.css', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
        }
    },
    module: {
        rules: [
        // {
        //     test: /\.jsx?$/,
        //     enforce: "pre",
        //     loader: 'eslint-loader',
        //     include: path.resolve(__dirname, '../'),
        //     exclude: path.resolve(__dirname, '../node_modules')
        // }, //代码规范检测--暂时不执行
        {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: path.resolve(__dirname, '../node_modules'), //不需要babel编译的范围
            include: path.resolve(__dirname, '../src'), //打包的范围
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
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                // postcss: [require('postcss-px2rem')({//移动端使用
                //     baseDpr: 2, // base device pixel ratio (default: 2)
                //     threeVersion: false, // whether to generate @1x, @2x and @3x version (default: false)
                //     remVersion: true, // whether to generate rem version (default: true)
                //     remUnit: 75, // rem unit value (default: 75)
                //     remPrecision: 6 // rem precision (default: 6)
                // })],
                autoprefixer: {
                    browsers: ["Android >= 2.3", "iOS >= 6"],
                    cascade: false // 不美化输出 css
                }
            }
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader?importLoaders=1!postcss-loader',
            //loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!postcss-loader' })
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
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: 'fonts/[name].[hash:7].[ext]'
            }
        }]
    },
    plugins: [
        //new webpack.BannerPlugin('# coding: utf-8'),//在js的头部增加信息
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function() {
                    // return [autoprefixer({ browsers: ['last 5 versions'] }), px2rem({ remUnit: 37.5 })];
                    return [autoprefixer({ browsers: ['last 5 versions'] })];
                },
                vue: {
                    loaders: {
                        less: ExtractTextPlugin.extract({ fallback: 'vue-style-loader', use: 'css-loader!postcss-loader!less-loader' }),
                    },
                },
            }
        }),
        new ExtractTextPlugin('css/[name].[contenthash].css'),
        //new webpack.optimize.CommonsChunkPlugin('common.js') //将公用模块，打包进common.js---报错
    ]
};
//生存多个页面
var appConfig = require('../Pages.js');
appConfig.pages.forEach(function(page) {
    var conf = {
        template: page.template || 'src/index.ejs', // html模板路径
        title: page.title || '多页面测试',
        filename: page.filename + '.html', // 生成的html存放路径,文件名，相对于path
        chunks: [page.chunks],
        inject: 'body', // //js插入的位置
        hash: false,
        minify: { // 压缩HTML文件
            removeComments: true, // 移除HTML中的注释
            collapseWhitespace: false, // 删除空白符与换行符
            removeAttributeQuotes: true
        },
    }
    baseWebpackConfig.plugins.push(new htmlWebpackPlugin(conf))
});
module.exports = baseWebpackConfig;
