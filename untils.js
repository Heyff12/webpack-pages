var glob = require('glob');
var appConfig = require('./Pages.js');
// 获取入口文件
exports.entry = (function() {
    var entry = {};
    glob.sync('./src/pages/*').forEach(function(name) {
        console.log(name);
        var n = name.slice(12, name.length - 0);
        appConfig.pages.forEach(function(page) {
            entry[n] = name + '/index.js';
        })
    });
    return entry;
})();
