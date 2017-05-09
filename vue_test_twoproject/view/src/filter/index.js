import Vue from 'vue'
//过滤函数 
//分转成元--两位浮点数
Vue.filter('yuan', function(value) {
    return (value / 100).toFixed(2)
})
//分转成元--整数
Vue.filter('yuan_z', function(value) {
    return (value / 100).toFixed(0)
})
//整数转化成百分数
Vue.filter('percent_f', function(value) {
    return value+'%'
})
