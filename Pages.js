// 页面配置
exports.pages = [{ // diy 配置
    filename: 'layer1', //页面的生产名字
    title: 'webpack is layer1', // title 可以在模板中指定
    chunks: 'layer1', //引入的js
}, {
    filename: 'layer2', //页面的生产名字
    title: '', // title 可以在模板中指定
    chunks: 'layer2', //引入的js
}, {
    filename: 'layer3', //页面的生产名字
    template: './src/pages/layer3/index.ejs', // 指定 html模板路径
    title: 'webpack is layer3', // title 可以在模板中指定
    chunks: 'layer3', //引入的js
}]
// exports.pages = [{ // diy 配置
//     filename: 'layer3', //页面的生产名字
//     template: './src/pages/layer3/index.ejs', // 指定 html模板路径
//     title: 'webpack is layer3', // title 可以在模板中指定
//     chunks: 'layer3', //引入的js
// }]
