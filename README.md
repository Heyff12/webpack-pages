# webpack-pages所页面应用
1、包含js、less、图片、模板html/tpl/vue的压缩合并处理 ，自动更新（修改less暂时不能自动更新）
2、config_single是单文件配置，webpack-config.sigle.js 是一个简单的单页面生产demo  
   config_much是多文件配置demo  
3、图片压缩采用了gulp  
4、build 是配置文件  
5、dist 生成目录，由于经过less-loader编译后，图片路径会自动进入css路径后面，所以在生成文件后，通过gulp执行了一次图片img复制；即--dist/css/img才是css引用的图片，dist/img是html引用的图片  

