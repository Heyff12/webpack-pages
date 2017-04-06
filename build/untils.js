var glob = require('glob');
var appConfig = require('../Pages.js');
// 获取入口文件
exports.entry = (function() {
    var entry = {};
    glob.sync('./src/pages/*').forEach(function(name) {
        var n = name.slice(12, name.length - 0);
        appConfig.pages.forEach(function(page) {
            entry[n] = name + '/index.js';
        })
    });
    return entry;
})();
// 获取常用配置
exports.conf_detail = (function() {
    var conf_detail = {
        port: 8083,
        publicPath_conf: 'http://localhost:8083/dist/',
        publicPath_build: '' //填写后，能够让引入资源的路径变成绝对定位,例如“/qudao/v1/static”
    };
    return conf_detail;
})();
/**
 * 环境
 * development: 开发--默认
 * testing: 测试环境
 * production: 生产环境（默认）
 * online: 线上环境
 * offline: 离线包
 */
exports.env = (function() {
    var env = process.argv[2] || 'production';
    return env;
})();
