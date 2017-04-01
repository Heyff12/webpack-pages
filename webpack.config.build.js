var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var htmlWebpackPlugin = require('html-webpack-plugin'); //html的页面生产
var ExtractTextPlugin = require('extract-text-webpack-plugin');//css单独生成--只有build使用
var CleanPlugin = require('clean-webpack-plugin');// 删除文件夹--只有build使用
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
    devtool: '#source-map',//生成map文件----只有build使用
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
            loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!postcss-loader!less-loader' }),//写法不同----只有build使用
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
