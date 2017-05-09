//引入文件路径--组建
import home from '../pages/home'
import merchant_index from '../pages/merchant/index'
import channel_index from '../pages/channel/index'
import channel_list from '../pages/channel/list'
import channel_base from '../pages/channel/channel_base'
import channel_account from '../pages/channel/channel_account'
import channel_pro from '../pages/channel/channel_pro'
import salesman_index from '../pages/salesman/index'
import trade_index from '../pages/trade/index'
import trade_detail from '../pages/trade/trade_detail'
import form_merchant from '../pages/forms/form_merchant' //商户交易统计
import form_merchantin from '../pages/forms/form_merchantin' //商户入网统计
import form_channelin from '../pages/forms/form_channelin' //渠道商户入网统计
import form_channel from '../pages/forms/form_channel' //渠道交易统计
import form_member from '../pages/forms/form_member' //业务员统计
import s_merchant from '../pages/settle/merchant' //商户结算单
import s_channel from '../pages/settle/channel' //渠道分润单
import myfenrun from '../pages/settle/myfenrun' //我的分润
import ad_advertisers from '../pages/ad/advertisers' //广告主管理
import ad_ad from '../pages/ad/ad' //广告管理
import notice from '../pages/notice/index' //广告管理



//路由参数
/**
 * auth true登录才能访问，false不需要登录，默认true
 */
export default [
    //首页
    { path: '/', name: 'home', component: home },
    //商户管理
    { path: '/merchant_index', name: 'merchant_index', component: merchant_index },
    //渠道管理
    { path: '/channel_index', name: 'channel_index', component: channel_index },
    //查看渠道信息
    { path: '/channel_list', name: 'channel_list', component: channel_list }, {
        path: '/channel_base/:userid',
        name: 'channel_base',
        component: channel_base,
    }, {
        path: '/channel_account/:userid',
        name: 'channel_account',
        component: channel_account,
    }, {
        path: '/channel_pro/:userid',
        name: 'channel_pro',
        component: channel_pro,
    },
    //业务员管理
    { path: '/salesman_index', name: 'salesman_index', component: salesman_index },
    // //交易管理
    { path: '/trade_index', name: 'trade_index', component: trade_index },
    //查看交易管理明细
    // { path: '/trade_detail/:mchnt_uid/:mchnt_name/:trade_syssn/:trade_amt/:trade_fee/:trade_dtm/:trade_type/:trade_status/:trade_msg', name: 'trade_detail', component: trade_detail },
    { path: '/trade_detail/:trade_syssn', name: 'trade_detail', component: trade_detail },
    //报表统计
    { path: '/form_merchant', name: 'form_merchant', component: form_merchant },
    { path: '/form_merchantin', name: 'form_merchantin', component: form_merchantin },
    { path: '/form_channelin', name: 'form_channelin', component: form_channelin },
    { path: '/form_channel', name: 'form_channel', component: form_channel },
    { path: '/form_member', name: 'form_member', component: form_member },
    //结算管理
    { path: '/s_merchant', name: 's_merchant', component: s_merchant },
    { path: '/s_channel', name: 's_channel', component: s_channel },
    { path: '/myfenrun', name: 'myfenrun', component: myfenrun },
    //广告管理
    { path: '/ad_advertisers', name: 'ad_advertisers', component: ad_advertisers },
    { path: '/ad_ad', name: 'ad_ad', component: ad_ad },
    //公告管理
    { path: '/notice', name: 'notice', component: notice },
]
