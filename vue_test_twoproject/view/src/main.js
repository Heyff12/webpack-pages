// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router' //路由

import routes from './route/' //路由参数
import store from './store/' //状态管理参数
import filter from './filter/' //过滤函数
import component from './components/' //全局组建

import VueResource from 'vue-resource' //ajax请求数据
//import 'element-theme-default'; //饿了吗主题样式
import '../theme/index.css'; //饿了吗主题样式--自定义样式#ff8100--橙色系  node_modules/.bin/et -i    node_modules/.bin/et
import ElementUI from 'element-ui' //饿了吗主题插件

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(ElementUI)
    //Vue.http.options.emulateJSON = true;//调整contenttype值为application/x-www-form-urlencoded，其默认值是application/json
Vue.http.interceptors.push((request, next) => {
    next((response) => {
        if (response.body.respcd==1001) {
            //store.commit('t_login_no', true);
            window.location.href = location.protocol + '//' + location.host + '/qudao/v1/page/login.html'
            return false
        }else{
        	return response
        }        
    });
});
const router = new VueRouter({
        routes // （缩写）相当于 routes: routes
    })
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router,
    store
})
