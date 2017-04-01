var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var htmlWebpackPlugin = require('html-webpack-plugin'); //html的页面生成
var untils=require('./untils.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独生成--只有build使用
var CleanPlugin = require('clean-webpack-plugin'); // 删除文件夹--只有build使用
var prodWebpackConfig = {
    // context:,
    // entry: {
    //     layer1: './src/pages/layer1/index.js',
    //     layer2: './src/pages/layer2/index.js',
    //     layer3: './src/pages/layer3/index.js',
    // },
    entry: untils.entry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        // filename: '[name].js',
        filename: 'js/[name]-[chunkhash].js',
        //publicPath: 'http://cdn.com/'
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
    ]
};
//生存多个页面
var appConfig = require('./Pages.js');
appConfig.pages.forEach(function(page) {
    var conf = {
        template: page.template || 'src/templates/vue.ejs', // html模板路径
        title: page.title || '多页面测试',
        filename: page.filename + '.html', // 生成的html存放路径,文件名，相对于path
        chunks: [page.chunks],
        inject: 'body', // //js插入的位置
        hash: false,
        minify: { // 压缩HTML文件
            // removeComments: true,       // 移除HTML中的注释
            // collapseWhitespace: false,   // 删除空白符与换行符
            // removeAttributeQuotes: true
        },
    }
    prodWebpackConfig.plugins.push(new htmlWebpackPlugin(conf))
});
module.exports = prodWebpackConfig;
