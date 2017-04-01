var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	// context:,
    // entry: './src_much/script/main.js',//一个js文件--single entry
    // entry:['./src_much/script/main.js','./src_much/script/a.js'],//两个js文件 合并
    entry: {
        main: './src_much/script/main.js',
        a: './src_much/script/a.js',
        b: './src_much/script/b.js',
        c: './src_much/script/c.js',
    },
    output: {
        // path: './dist_much/js',
        path: path.resolve(__dirname, 'dist_much'),
        filename: 'js/[name]-[chunkhash].js',
        publicPath:'http://cdn.com/'
    },
    plugins: [
        new htmlWebpackPlugin({
        	// filename:'index-[hash].html',
        	filename:'a.html',//页面的生产名字
        	template:'index_much.html',//页面模板
        	inject:false,//js的存放位置
        	title:'webpack is aaa',//网页title
        	// chunks:['main','a'],//引入的js
        	excludeChunks:['b','c'],//排除的js
        	// minify:{//html页面压缩
        	// 	removeComments:true,//删除注释
        	// 	collapseWhitespace:true//删除空格
        	// }
        }),
        new htmlWebpackPlugin({
        	filename:'b.html',
        	template:'index_much.html',
        	inject:false,
        	title:'webpack is bbb',
        	// chunks:['b'],
        	excludeChunks:['a','c'],//排除的js
        	// minify:{
        	// 	removeComments:true,//删除注释
        	// 	collapseWhitespace:true//删除空格
        	// }
        }),
        new htmlWebpackPlugin({
        	filename:'c.html',
        	template:'index_much.html',
        	inject:false,
        	title:'webpack is ccc',
        	// chunks:['c'],
        	excludeChunks:['b','a'],//排除的js
        	// minify:{
        	// 	removeComments:true,//删除注释
        	// 	collapseWhitespace:true//删除空格
        	// }
        })
    ]
};
