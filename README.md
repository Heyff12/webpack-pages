# webpack-pages多页面应用
1、包含js、less、图片、模板html/tpl/vue的压缩合并处理 ，版本控制，代码检测，自动更新（修改less暂时不能自动更新），图片压缩采用了gulp  

2、config_single是单文件配置，webpack-config.sigle.js 是一个简单的单页面生产demo  
   config_much是多文件配置demo  

3、static文件夹里面放置案例需要的图片，通过gulp images 压缩后转移到src/assets  

4、build 是配置文件，其中untils.js包含全局配置内容，文件入口entry,本地端口号，线上路径  

5、dist 生成目录，由于经过less-loader编译后，图片路径会自动进入css路径后面，所以在生成文件后，通过gulp执行了一次图片img复制；即--dist/css/img才是css引用的图片，dist/img是html引用的图片 

6、src是资源目录  

7、test文件夹是个小的测试例子  

8、Pages.js是多页面配置文件  



# 使用 
下载项目  
git clone git@github.com:Heyff12/webpack-pages.git  

进入目录  
cd  webpack-pages  

安装依赖包  
npm install  

打开开发环境  
npm run dev  

浏览页面地址  
http://localhost:8083/dist/layer3.html  

编译生成文件  
npm run build  


# 命令配置-package.json  
"dev": "webpack-dev-server --config ./build/webpack.config.js --progress  --colors  --inline --hot",  

"build": "gulp del && gulp images && webpack --config ./build/webpack.config.build.js --progress  --colors  --display-error-details -p && gulp images_copy",  


## 功能解析 
这个项目，是为了熟悉webpack的打包，是从无到有一点一点配置起来的，需要什么功能就安装声明模块，  
大致步骤——  

1、js模块化的实现和es6的编译(babel-loader)、less编译(style-loader/css-loader!postcss-loader!less-loader)、配置版本号(filename: 'js/[name]-[hash].js',)、图片base64处理(url-loader)，可以生产html文件查看（new htmlWebpackPlugin(conf)）  

2、配置不同的页面模板，html/tpl/vue（html-loader/ejs-loader/vue-loader）  

3、如果做移动端界面，需要css的rem转化 (postcss-px2rem)  

4、文件压缩（build命令的-p）  

5、自动更新（webpack-dev-server），目前本例的bug,修改less文件不能够自动更新  

6、生成map文件，便于代码差错（devtool: '#source-map'）  



## 备注  
1、配置多页面时，需要显示不同的title（<%= htmlWebpackPlugin.options.title %>），本例的模板文件是src/index.ejs；由于html格式不识别title的那段自定义代码，所以多个页面共享同一个模板时，不能采用html格式的文件  

2、less代码经过less-loader处理后，没有被转化成base64编码的图片路径会默认到dist/css/img，导致图片不能显示。本例比较笨拙的处理方法：在运行dev时，配置 （publicPath: 'http://localhost:8083/dist/'），这样通过本地地址访问时，图片路径就会是 http://localhost:8083/dist/img;在运行build时，配置（publicPath_build: ''//填写后，能够让引入资源的路径变成绝对定位,例如“/qudao/v1/static”），这样可以让资源路径根据线上环境自动调整  

3、引入代码检测（eslint-loader），需要在根目录配置.eslintrc文件  

4、正常编译.vue文件，需要在resolve中添加'vue$': 'vue/dist/vue.common.js', （目前不少特别理解resolve的用法）  

5、单页面配置项目https://github.com/Heyff12/webpack-demo   




作者个人博客，欢迎提建议：http://www.yaya12.com/archives/category/xy





