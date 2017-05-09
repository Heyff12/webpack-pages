import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
    //登录状态配置 ---sessionid--if_login  未使用
export default new Vuex.Store({
        state: {
            sessionid: GetCookie('sessionid') || '', //是否登陆
            if_login: nowurl_if(), //是否在登陆页面
            trade_detail: {
                "qudao_uid": 0, // 渠道 userid
                "qudao_name": "", // 渠道名
                "mchnt_uid": 0, // 商户 userid
                "mchnt_name": "", // 商户名
                "trade_syssn": "", // 交易流水号
                "trade_amt": 0, // 交易金额, 单位为分
                "trade_fee": 0, // 手续费, 单位分
                "trade_dtm": "", // 交易时间
                "trade_type": "", // 交易类型
                "trade_status": "", // 交易状态
                "trade_msg": "", // 交易失败原因
                "mchnt_mobile": "", // 手机号
            }, //交易明细数据
            login_no: false, //session是否过期，过期则提示当前未登录
            ad_url: location.host == 'qudao.qfpay.com' ? 'https://o.qfpay.com' : 'https://o.qa.qfpay.net',//第一个是online地址，第二个是测试地址
        },
        mutations: {
            login(state) {
                //SetCookie('sessionid', 'yaya123344', 12);
                state.sessionid = GetCookie('sessionid');
            },
            logout(state) {
                //deleteCookie('sessionid');
                state.sessionid = GetCookie('sessionid');
            },
            login_ify(state) {
                state.if_login = true;
            },
            login_ifn(state) {
                state.if_login = false;
            },
            t_detail(state, obj) {
                state.trade_detail = obj;
                //console.log(state.trade_detail);
            },
            t_login_no(state, obj) {
                state.login_no = obj;
            },
        }
    })
    //判断是否是登录页
function nowurl_if() {
    let url = window.location.href.split('/');
    let len = url.length - 1;
    if (url[len] == 'login') {
        return true;
    } else {
        return false;
    }
}
//获取cookie
function GetCookie(cookieName) {
    var strCookie = document.cookie;
    // 将多cookie切割为多个名/值对
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        // 遍历cookie数组，处理每个cookie对
        var arr = arrCookie[i].split("=");
        // 找到名称为cookieName的cookie，并返回它的值
        if (arr[0] == cookieName)
            return arr[1];
    }
    return "";
}
//删除cookie
function deleteCookie(username) {
    var date = new Date();
    // // 删除一个cookie，就是将其过期时间设定为一个过去的时间
    date.setTime(date.getTime() - 10000);
    document.cookie = username + "=v; expires=" + date.toGMTString();
}
// /**/**
// * 设置Cookie （通用函数）
// * @param {string} cookieName Cookie 名称
// * @param {string} cookieValue Cookie 值
// * @param {string} nDays Cookie 过期天数

function SetCookie(cookieName, cookieValue, nDays) {
    /**/
    /* 当前日期 */
    var today = new Date();
    /**/
    /* Cookie 过期时间 */
    var expire = new Date();
    /**/
    /* 如果未设置nDays参数或者nDays为0，取默认值 1 */
    if (nDays == null || nDays == 0)
        nDays = 1;
    /**/
    /* 计算Cookie过期时间 */
    expire.setTime(today.getTime() + nDays * 24 * 60 * 60 * 1000); //获取毫秒数      
    /**/
    /* 设置Cookie值 */
    document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString();
    //alert(cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString());
}
