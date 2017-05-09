<template>
    <!-- 获取登录名 、邮箱TODO-->
    <div id="app">
        <div class="manage_body">
            <div class="header" v-bind:class="{show_menu:is_showmenu}">
                <p class="show_menu" @click="is_showmenu=!is_showmenu"></p>
                <header>
                    <div class="nav_menu_logo">
                        <router-link :to="{ name: 'home' }">
                            <img v-bind:src="base.logo_url" alt="">
                            <br/> {{base.short_name}}
                        </router-link>
                    </div>
                    <el-menu default-active="1" class="el-menu-vertical-demo" :unique-opened="true" :router="true" @open="handleOpen" @close="handleClose">
                        <el-menu-item index="/">
                            <i class="icon_left icon_yester_w"></i>昨日数据
                        </el-menu-item>
                        <el-submenu index="2">
                            <template slot="title"><i class="icon_left icon_qudao_w"></i>渠道管理</template>
                            <el-menu-item index="/channel_list">渠道管理</el-menu-item>
                            <el-menu-item index="/channel_index">新增渠道</el-menu-item>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title"><i class="icon_left icon_shanghu_w"></i>商户管理</template>
                            <el-menu-item index="/merchant_index">商户管理</el-menu-item>
                        </el-submenu>
                        <el-submenu index="4">
                            <template slot="title"><i class="icon_left icon_slsm_w"></i>业务员管理</template>
                            <el-menu-item index="/salesman_index">业务员管理</el-menu-item>
                        </el-submenu>
                        <el-submenu index="5">
                            <template slot="title"><i class="icon_left icon_trade_w"></i>交易管理</template>
                            <el-menu-item index="/trade_index">交易管理</el-menu-item>
                        </el-submenu>
                        <el-submenu index="6">
                            <template slot="title"><i class="icon_left icon_forms_w"></i>统计报表</template>
                            <el-menu-item index="/form_merchantin">商户入网统计</el-menu-item>
                            <el-menu-item index="/form_merchant">商户交易统计</el-menu-item>
                            <el-menu-item index="/form_channelin">渠道商户入网统计</el-menu-item>
                            <el-menu-item index="/form_channel">渠道交易统计</el-menu-item>
                            <el-menu-item index="/form_member">业务员统计</el-menu-item>
                        </el-submenu>
                        <el-submenu index="7">
                            <template slot="title"><i class="icon_left icon_settle_w"></i>结算管理</template>
                            <el-menu-item index="/s_merchant">商户结算单</el-menu-item>
                            <!-- <el-menu-item index="/s_channel">渠道分润单</el-menu-item> -->
                        </el-submenu>
                        <template v-if="base.level==1">
                            <el-submenu index="8">
                                <template slot="title"><i class="icon_left icon_ad_w"></i>广告管理</template>
                                <el-menu-item index="/ad_advertisers">广告主管理</el-menu-item>
                                <el-menu-item index="/ad_ad">广告管理</el-menu-item>
                            </el-submenu>
                        </template>
                        <el-submenu index="9">
                            <template slot="title"><i class="icon_left icon_notice_w"></i>公告管理</template>
                            <el-menu-item index="/notice">公告管理</el-menu-item>
                        </el-submenu>
                    </el-menu>
                    <div class="clearfix"></div>
                    <div class="head_foot">Copyright <span class="orange"> © 2017</span></div>
                </header>
            </div>
            <div class="main_main">
                <div class="manage_head">
                    <el-row :gutter="0">
                        <el-col :xs="8" :sm="8" :md="8" :lg="8">
                            <div class="manage_head_l"></div>
                        </el-col>
                        <el-col :xs="16" :sm="16" :md="16" :lg="16" :offset="8">
                            <div class="manage_head_r">
                                <span v-on:click="quit_manage"><i class="icon_quit"></i>退出</span>
                                <span class="name_button">
                                    {{base.name}}<i class="el-submenu__icon-arrow el-icon-arrow-down"></i>
                                    <dl>
                                        <p class="arrow"><span></span></p>
                                <dt>{{base.name}}</dt>
                                <dd><span @click="passdialog=true"><i class="icon_password"></i>修改密码</span></dd>
                                <!-- <dd>
                                    <router-link :to="{ name: 'myfenrun' }"><span><i class="icon_fenrun"></i>我的分润</span></router-link>
                                </dd> -->
                                </dl>
                                </span>
                                <!-- <span class="fr" v-on:click="come_manage">登陆</span> -->
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <router-view></router-view>
            </div>
            <!-- <el-dialog title="修改密码" v-model="passdialog" size="tiny">
                <el-form :model="pass" :rules="passes_rules" ref="pass" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="旧密码" prop="old_password">
                        <el-input v-model="pass.old_password" type="password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_password">
                        <el-input v-model="pass.new_password" type="password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="check_password">
                        <el-input v-model="pass.check_password" type="password" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="passdialog = false">取 消</el-button>
                    <el-button type="primary" @click="mendpass">确 定</el-button>
                </div>
            </el-dialog> -->
            <bounced :visible="passdialog" :newclass="big_bounced">
                <span slot="header">修改密码<i class="close"  @click="pass_reset"></i></span>
                <el-form :model="pass" :rules="passes_rules" ref="pass" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="旧密码" prop="old_password">
                        <el-input v-model="pass.old_password" type="password" auto-complete="off" @blur="if_right"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_password">
                        <el-input v-model="pass.new_password" type="password" auto-complete="off" @blur="if_right"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="check_password">
                        <el-input v-model="pass.check_password" type="password" auto-complete="off" @blur="if_right"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <span class="bounced_button bounced_sub" v-bind:class="{bounced_sub_right:if_right_class}" @click="mendpass">保存更改</span>
                    </el-form-item>
                </el-form>
            </bounced>
            <bounced :visible="login_dialog" :newclass="big_bounced">
                <span slot="header">返回登录页<!-- <i class="close"  @click="login_dialog=false"></i> --></span>
                <p class="bounced_text">
                    密码修改成功，请点击“确定”按钮进入登录页重新登陆!
                </p>
                <p slot="footer">
                    <span class="bounced_button bounced_cancle" @click="tologin">确认</span>
                </p>
            </bounced>
            <!-- <el-dialog title="返回登录页" v-model="login_dialog" size="tiny">
                <span class="dialog_text">
                    密码修改成功，请点击“确定”按钮进入登录页重新登陆!
                </span>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="tologin">确 定</el-button>
                </div>
            </el-dialog> -->
        </div>
        <load :visible="loading"></load>
        <toast :msg="toastmsg" :visible="visible_toast" @on-visible-change="onVisibleChange" @on-msg-change="onMsgChange"></toast>
        <!-- cookie过期，不需要显示弹框，直接跳转至登录页 ，下面弹框取消不显示-->
        <el-dialog title="" v-model="$store.state.login_no" size="tiny" top="35%">
            <span class="dialog_text">
                当前未登录，请点击“确定”按钮进入登录页重新登陆!
            </span>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="tologin">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// import load from '../../components/load'
// import toast from '../../components/toast'
export default {
    name: 'app',
    // components: {
    //     load,
    //     toast,
    // },
    data() {
        var Pass_old = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入旧密码'));
            } else {
                if (this.pass.old_password.length < 6 || this.pass.old_password.length > 20) {
                    callback(new Error('密码长度在6~20之内'));
                }
                callback();
            }
        };
        var Pass_new = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'));
            } else {
                if (this.pass.new_password.length < 6 && this.pass.new_password.length > 20) {
                    callback(new Error('密码长度在6~20之内'));
                }
                callback();
            }
        };
        var pass_check = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.pass.new_password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            passdialog: false, //是否打开修改密码弹框
            big_bounced: 'big_bounced', //修改密码弹框特殊颜色--大弹框
            login_dialog: false, //完成修改密码后提示弹框
            loading: false, //load是否显示
            toastmsg: '', //toast提示文字
            visible_toast: false, //toast是否显示
            is_showmenu: false, //点击显示导航
            if_right_class: false, //修改密码的输入内容是否都正确，都正确，增加类 显示橙色，否则 灰色
            base: {
                "name": "", // 渠道名称
                "short_name": '',
                "logo_url": "", // 企业LOGO的URL
                "level": '1', //渠道等级--1级才可以使用广告管理
            },
            pass: {
                "old_password": "",
                "new_password": "",
                "check_password": ""
            },
            passes_rules: {
                old_password: [{
                    required: true,
                    message: '请输入旧密码',
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 20,
                    message: '长度在 6 到 20 个字符',
                    trigger: 'blur'
                }],
                new_password: [{
                    required: true,
                    message: '请输入新密码',
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 20,
                    message: '长度在 6 到 20 个字符',
                    trigger: 'blur'
                }],
                check_password: [{
                    required: true,
                    validator: pass_check,
                    trigger: 'blur'
                }],
            },
            quit_url: location.protocol + '//' + location.host + '/qudao/v1/api/user/logout', //退出登录
            mendpass_url: location.protocol + '//' + location.host + '/qudao/v1/api/user/change_pwd', //修改密码
            qd_info_url: location.protocol + '//' + location.host + '/qudao/v1/api/qd/info', //渠道基本信息
        }
    },
    created: function() {
        this.get_info(); //获取渠道信息  
    },
    methods: {
        //监听toast是否可见的值得变化
        onVisibleChange(val) {
            this.visible_toast = val; //④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        },
        //监听toast内容的值得变化
        onMsgChange(val) {
            this.toastmsg = val; //④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        },
        handleOpen(key, keyPath) {
            //console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            //console.log(key, keyPath);
        },
        //设置默认sessionid---上线将取消
        come_manage: function() {
            //this.$store.commit('login');
        },
        //退出
        quit_manage: function() {
            let _this = this;
            //this.$store.commit('logout');
            this.$http.post(this.quit_url, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    var data_return = response.body;
                    if (data_return.respcd == '0000') {
                        //取消 退出成功 的提示，直接跳转
                        // _this.visible_toast = true;
                        // _this.toastmsg = '退出成功!';
                        setTimeout(() => {
                            window.location.href = location.protocol + '//' + location.host + '/qudao/v1/page/login.html'
                        }, 0);
                    } else {
                        if (data_return.respmsg) {
                            _this.toastmsg = data_return.respmsg;
                        } else {
                            _this.toastmsg = data_return.resperr;
                        }
                        _this.visible_toast = true;
                    }
                }, function(response) {
                    _this.loading = false;
                    _this.visible_toast = true;
                    _this.toastmsg = '网络超时!';
                })
                .catch(function(response) {
                    _this.loading = false;
                });
        },
        //输入是否正确--随之更改确认保存 按钮的 颜色
        if_right: function() {
            let _this = this;
            this.$refs.pass.validate((valid) => {
                if (valid) {
                    _this.if_right_class = true;
                } else {
                    _this.if_right_class = false;
                }
            });
        },
        //关闭修改密码弹框--并重置  输入内容
        pass_reset: function() {
            this.passdialog = false; //关闭修改密码弹框
            this.$refs.pass.resetFields(); //重置输入内容
            this.if_right_class = false; //确认保存  按钮 样式 重置
        },
        //修改密码--点击确定
        mendpass: function() {
            let _this = this;
            this.$refs.pass.validate((valid) => {
                if (valid) {
                    _this.mendpass_post();
                } else {
                    return false;
                }
            });
        },
        //修改密码--发送请求
        mendpass_post: function() {
            let _this = this;
            _this.passdialog = false; //关闭修改密码弹框
            let post_data = {
                "old_password": _this.pass.old_password,
                "new_password": _this.pass.new_password,
            };
            this.$http.post(this.mendpass_url, post_data, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    var data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.login_dialog = true; //打开跳转到登陆页面弹框
                    } else {
                        if (data_return.respmsg) {
                            _this.toastmsg = data_return.respmsg;
                        } else {
                            _this.toastmsg = data_return.resperr;
                        }
                        _this.visible_toast = true;
                    }
                }, function(response) {
                    _this.loading = false;
                    _this.visible_toast = true;
                    _this.toastmsg = '网络超时!';
                })
                .catch(function(response) {
                    _this.loading = false;
                });
        },
        //返回登录页
        tologin: function() {
            window.location.href = location.protocol + '//' + location.host + '/qudao/v1/page/login.html'
        },
        //获取特定渠道的基本信息
        get_info: function() {
            var _this = this;
            this.$http.get(this.qd_info_url, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    var data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.base = data_return.data.base;
                        if (_this.base.logo_url.length <= 0 || !_this.base.logo_url) {
                            _this.base.logo_url = '/qudao/v1/static/login/img/logo.png';
                        }
                    } else {
                        if (data_return.respmsg) {
                            _this.toastmsg = data_return.respmsg;
                        } else {
                            _this.toastmsg = data_return.resperr;
                        }
                        _this.visible_toast = true;
                    }
                }, function(response) {
                    _this.loading = false;
                    _this.visible_toast = true;
                    _this.toastmsg = '网络超时!';
                })
                .catch(function(response) {
                    _this.loading = false;
                });
            //测试1级渠道显示广告管理  栏目    
            // _this.base = {
            //     "name": "", // 渠道名称
            //     "short_name": '',
            //     "logo_url": "", // 企业LOGO的URL
            //     "level": '1', //渠道等级--1级才可以使用广告管理
            // };
        },
    }
}
</script>
<style lang="less" rel="stylesheet/less">
@import "./css/common/const";
body,
p,
ul,
ol,
li,
dl,
dt,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
form,
fieldset,
legend,
input,
select,
textarea,
button,
th,
td {
    margin: 0;
    padding: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-size: 100%;
}

ul,
dl,
ol {
    list-style: none;
}

img,
fieldset,
input[type="submit"] {
    border: 0 none;
}

img {
    display: inline-block;
    overflow: hidden;
    vertical-align: top;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

button,
input[type="button"] {
    cursor: pointer;
    border: 0 none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    tap-highlight-color: rgba(0, 0, 0, 0);
}

textarea {
    word-wrap: break-word;
    resize: none;
}


/* word-wrap for opera, resize for webkit */

menu {
    margin: 0;
    padding: 0;
}

body {
    //-webkit-user-select: none;
    -webkit-text-size-adjust: none;
    font-family: Arial, helvetica, "微软雅黑", "Microsoft Yahei", sans-serif;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    //色调调整
    // //输入框--focus色调
    // .el-input__inner:focus {
    //     outline: 0;
    //     border-color: @orange;
    // }
    // //下拉菜单--focus色调
    // .el-select .el-input__inner:focus {
    //     border-color: @orange;
    // }
    // .el-select-dropdown__item.selected.hover {
    //     background-color: @orange;
    // }
    // .el-select-dropdown__item.selected {
    //     color: #fff;
    //     background-color: @orange;
    // }
    //按钮色调调整
    .el-button--primary {
        color: #fff;
        background-color: @orange;
        border-color: @orange;
    }
    .el-button--default {
        color: @orange;
        background-color: white;
        border-color: @orange;
    }
    //调整日期框长度
    .el-date-editor.el-input {
        width: 100%;
        min-width: 193px;
    }
}

input[type="number"] {
    -webkit-user-select: text;
}

a,
button,
input,
img {
    -webkit-touch-callout: none;
}


/* 1.ios 长按时不触发系统的菜单 2.禁止长按时下载图片 */

input,
select,
textarea {
    outline: none;
}

a,
button,
input,
textarea,
span {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    tap-highlight-color: rgba(0, 0, 0, 0);
}

a,
a:link,
a:visited,
a:hover {
    text-decoration: none;
    color: @black;
    cursor: pointer;
}

@media all and (-webkit-transform-3d) {
    /* android4.0+ ios4+ 恢复按钮被点击时产生的效果 */
    a,
    button,
    input,
    textarea,
    span {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        tap-highlight-color: rgba(0, 0, 0, 0);
    }
}

textarea {
    /* 消除ios内阴影 */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
}

a {
    text-decoration: none;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}

input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
    background-color: white;
    background-image: none;
    color: #000000;
}

section,
div,
dl,
dt,
dd,
footer {
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}


/* ==================共用============================================================ */

.t_c {
    text-align: center;
}

.t_r {
    text-align: right;
}

.mar_t20 {
    margin-top: 20px;
}

.mar_r6 {
    margin-right: 6px;
}

.fl {
    float: left;
}

.fr {
    float: right;
}

.clearfix {
    display: block;
    zoom: 1;
}

.clearfix:after {
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
    overflow: hidden;
}

.clearfix_line {
    content: "";
    clear: both;
    overflow: hidden;
    width: 100%;
    height: 1px;
    background: @line_color;
}

.clearfix_liner {
    content: "";
    clear: both;
    overflow: hidden;
    width: 92%;
    margin: 0 auto;
    height: 1px;
    background: @line_color;
}

.clearfix_liner1 {
    content: "";
    clear: both;
    overflow: hidden;
    width: 100%;
    box-sizing: content-box;
    padding-right: 20px;
    margin: 0 auto;
    height: 0px;
    border-bottom: 1px dashed @line_color;
    margin-bottom: 22px;
}

.grey {
    color: @grey;
}

.black {
    color: @black;
}

.red {
    color: @red;
}

.orange {
    color: @orange;
}

.border_red {
    color: @red;
}

i.i_normal {
    font-style: normal;
}

a.orange,
a.orange:link,
a.orange:visited,
a.orange:hover {
    text-decoration: none;
    color: @orange;
    cursor: pointer;
}

body {
    background: @background_color;
    color: @black;
    /* 增加该属性，可以增加弹性 */
    -webkit-overflow-scrolling: touch;
}

//本页面
.manage_body {
    width: 100%;
    position: relative;
    padding-left: 250px;
    div.header {
        width: 250px;
        margin: 0px;
        background: #2A2A2A;
        top: 0;
        left: 0;
        padding: 20px 0px 20px 0px;
        border-right: 0px solid @line_color;
        border-top: 0px solid @line_color;
        height: 100%;
        float: left;
        position: fixed;
        color: white;
        z-index: 12;
        display: block;
        overflow-y: auto;
        transition: all .5s;
        p.show_menu {
            width: 35px;
            height: 35px;
            position: fixed;
            left: 0px;
            top: 7px;
            background: url('./img/menub.png') center center no-repeat #2A2A2A;
            background-size: 20px auto;
            z-index: 12;
            display: none;
            transition: all .5s;
        }
        &.show_menu {
            left: 0;
            p.show_menu {
                display: block;
                left: 250px;
            }
        }
        .nav_menu_logo {
            text-align: center;
            margin: 0px 0px 10px;
            font-size: 16px;
            line-height: 50px;
            padding: 10px;
            img {
                width: 60px;
                height: auto;
                border-radius: 10px;
            }
            a {
                display: inline-block;
                color: white;
            }
        }
        .head_foot {
            position: absolute;
            bottom: 36px;
            width: 100%;
            text-align: center;
            font-size: 14px;
            display: none;
        }
    }
    .main_main {
        margin: 0px 0 0 0px;
        padding: 0px 0;
        .manage_head {
            width: 100%;
            padding: 0 30px 0 10px;
            height: 50px;
            line-height: 50px;
            background: @orangebg_color;
            color: white;
            display: block;
            .manage_head_l {
                text-align: left;
                font-size: 18px;
                line-height: 50px;
                a {
                    display: inline-block;
                }
                img {
                    width: auto;
                    height: 50px;
                    margin: 0 10px 0 0px;
                }
            }
            .manage_head_r {
                text-align: right;
                line-height: 50px;
                span {
                    margin-left: 40px;
                    height: 50px;
                    display: inline-block;
                    float: right;
                    .el-button span {
                        margin-left: 0;
                    }
                    &.name_button {
                        position: relative;
                        display: inline-block;
                        padding-right: 18px;
                        box-sizing: border-box;
                        .el-submenu__icon-arrow {
                            right: 0;
                            margin-top: -6px;
                        }
                    }
                    dl {
                        position: absolute;
                        top: 70px;
                        right: 0;
                        display: none;
                        background: @orange;
                        width: 100%+20;
                        min-width: 150px;
                        z-index: 100;
                        border-radius: 3px;
                        box-shadow: 0px 1px 5px @grey;
                        dt {
                            height: 70px;
                            line-height: 70px;
                            text-align: center;
                            padding: 0 20px;
                            box-sizing: border-box;
                        }
                        dd {
                            width: 100%;
                            height: 45px;
                            line-height: 45px;
                            background: white;
                            padding: 0 20px;
                            box-sizing: border-box;
                            color: @black;
                            text-align: left;
                            cursor: pointer;
                            span {
                                margin: 0;
                                width: 100%;
                                display: inline-block;
                                height: 45px;
                                i {
                                    width: 20px;
                                    height: 20px;
                                    padding-right: 8px;
                                    display: inline-block;
                                    position: relative;
                                    &.icon_password {
                                        background: url('./img/ic_Password@3x.png') left center no-repeat;
                                        background-size: auto 20px;
                                        top: 3px;
                                    }
                                    &.icon_fenrun {
                                        background: url('./img/ic_fenrun.png') left center no-repeat;
                                        background-size: auto 20px;
                                        top: 3px;
                                    }
                                }
                            }
                            &:last-child {
                                border-radius: 0 0 3px 3px;
                            }
                            a {
                                &:hover {
                                    color: @orange;
                                }
                            }
                            &:hover {
                                color: @orange;
                            }
                        }
                        p.arrow {
                            position: relative;
                            width: 100%;
                            height: 20px;
                            margin-top: -20px;
                            left: 0;
                            span {
                                position: absolute;
                                width: 0px;
                                height: 0px;
                                border: 10px solid @orange;
                                border-color: transparent transparent @orange transparent;
                                top: 0;
                                right: 20px;
                            }
                        }
                    }
                    &:hover {
                        .el-submenu__icon-arrow {
                            transform: rotateZ(180deg);
                        }
                        dl {
                            display: block;
                        }
                    }
                }
                &:after {
                    content: '';
                    clear: both;
                    height: 0;
                    line-height: 0;
                    font-size: 0;
                }
            }
        }
        .right_head {
            width: 100%;
            height: 76px;
            line-height: 76px;
            box-sizing: border-box;
            padding: 0 20px;
            font-size: 24px;
            background: white;
            margin-bottom: 30px;
        }
        .home_body {
            width: 100%;
            box-sizing: border-box;
            padding: 0px 30px 0px;
        }
        .right_body {
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px 20px;
            &:after {
                content: '';
                clear: both;
                line-height: 0px;
                height: 0px;
                font-size: 0px;
            }
            .right_body_inner {
                width: 100%;
                background: white;
                border-radius: 3px;
            }
        }
    }
}

.icon_quit {
    width: 16px;
    height: 21px;
    display: inline-block;
    background: url('./img/quit.png') center center no-repeat;
    background-size: 16px auto;
    position: relative;
    top: 6px;
    margin-right: 6px;
}

//导航样式调整------elementUI特殊调整
.header {
    .el-menu {
        background: none;
        color: white;
        a {
            color: white;
        }
        .el-submenu__title {
            color: white;
            /*padding-left: 0;*/
            &:hover {
                background: none;
            }
        }
        .el-menu-item {
            color: white;
            &:hover {
                background: none;
            }
            i.icon_left {
                margin-right: 6px;
                display: inline-block;
                width: 16px;
                height: 16px;
                position: relative;
                &.icon_yester_w {
                    background: url('./img/yester_iw.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
            }
            &.is-active {
                background: #252424;
                position: relative;
                color: @orange;
                &:before {
                    content: '';
                    position: absolute;
                    left: 0;
                    width: 3px;
                    height: 56px;
                    background: @orangebg_color;
                }
                i.icon_left {
                    &.icon_yester_w {
                        background: url('./img/yester_i.png') center center no-repeat;
                        background-size: 16px auto;
                        top: 2px;
                    }
                }
            }
            a {
                color: @orange;
            }
        }
        .el-submenu.is-opened .el-submenu__title {
            color: @orange;
        }
    }
    .el-submenu {
        .el-menu {
            background: none;
            a li.is-active {
                color: @orange;
            }
        }
        .el-menu-item {
            color: #8A8C92;
            &.is-active:before {
                content: '';
                position: absolute;
                left: 0;
                width: 3px;
                height: 50px;
                background: @orangebg_color;
            }
        }
        i.icon_left {
            margin-right: 6px;
            display: inline-block;
            width: 16px;
            height: 16px;
            position: relative;
            &.icon_yester_w {
                background: url('./img/yester_iw.png') center center no-repeat;
                background-size: 16px auto;
                top: 2px;
            }
            &.icon_qudao_w {
                background: url('./img/qudao_iw.png') center center no-repeat;
                background-size: 16px auto;
                top: 2px;
            }
            &.icon_shanghu_w {
                background: url('./img/shanghu_iw.png') center center no-repeat;
                background-size: 16px auto;
                top: 2px;
            }
            &.icon_slsm_w {
                background: url('./img/ic_yewuyuanw.png') center center no-repeat;
                background-size: 16px auto;
                top: 2px;
            }
            &.icon_trade_w {
                background: url('./img/ic_jiaoyiguanliw.png') center center no-repeat;
                background-size: 16px auto;
                top: 2px;
            }
            &.icon_forms_w {
                background: url('./img/ic_tongjiw.png') center center no-repeat;
                background-size: 16px auto;
                top: 2px;
            }
            &.icon_settle_w {
                background: url('./img/settle_iw.png') center center no-repeat;
                background-size: 16px auto;
                top: 2px;
            }
            &.icon_ad_w {
                background: url('./img/ad_iw.png') center center no-repeat;
                background-size: 16px auto;
                top: 2px;
            }
            &.icon_notice_w{
                background: url('./img/ic_gonggao@3x.png') center center no-repeat;
                background-size: 16px auto;
                top: 2px;
            }
        }
        &.is-opened {
            i.icon_left {
                &.icon_shanghu_w {
                    background: url('./img/shanghu_i.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
                &.icon_yester_w {
                    background: url('./img/yester_i.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
                &.icon_qudao_w {
                    background: url('./img/qudao_i.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
                &.icon_slsm_w {
                    background: url('./img/ic_yewuyuan.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
                &.icon_trade_w {
                    background: url('./img/ic_jiaoyiguanli.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
                &.icon_forms_w {
                    background: url('./img/ic_tongji.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
                &.icon_settle_w {
                    background: url('./img/settle_i.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
                &.icon_ad_w {
                    background: url('./img/ad_i.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
                &.icon_notice_w{
                    background: url('./img/ic_gonggao_sel@3x.png') center center no-repeat;
                    background-size: 16px auto;
                    top: 2px;
                }
            }
        }
    }
}


/*自适应特殊设置-----------------------------------------------------------------------------------------------------------------------*/

@media only screen and (min-width: 1450px) {
    header {
        width: 100%;
        height: auto;
        margin: 0px auto 0px;
        padding: 0px 0px;
    }
}

@media only screen and (max-width: 1450px) and (min-width: 768px) {
    header {
        width: 100%;
        height: auto;
        margin: 0 auto;
        padding: 10px 0px;
    }
    div.header {
        margin: 0px auto;
    }
}

@media only screen and (max-width: 768px) and (min-width: 500px) {
    header {
        width: 100%;
    }
    .manage_body div.header {
        margin: 0px auto;
        left: -250px;
        p.show_menu {
            display: block;
        }
    }
    .manage_body {
        padding-left: 0;
    }
}

@media only screen and (max-width: 500px) {
    .container {
        width: auto;
    }
    .manage_body div.header {
        margin: 0px auto;
        left: -250px;
        p.show_menu {
            display: block;
        }
    }
    .manage_body {
        padding-left: 0;
    }
    .home_body {
        padding: 0px 10px 0px;
    }
    .home_body_b {
        padding: 0px 10px 30px 10px;
    }
    .right_body {
        padding: 0 10px 20px;
    }
}

//*通用样式---------------------------------------------------------------------------------------------------------------------*/

/*图片上传*/

.el_pic {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    dd {
        display: inline-block;
        float: left;
        &.tips {
            color: @red;
            position: absolute;
            top: -15px;
            left: 34px;
            display: none;
        }
        &.ipload {
            width: 30%;
            min-width: 60px;
            background-color: @light_orange;
            border: 1px solid @element_bordercolor;
            position: relative;
            text-align: center;
            border-radius: 4px;
            top: 1px;
            left: 8px;
            input {
                width: 100%;
                height: 30px;
                background: 0 0;
                border: none;
                opacity: 0;
                position: absolute;
                left: 0;
                top: 0
            }
            &.disa {
                background: @element_disacolor;
                color: #bbb;
                cursor: not-allowed;
            }
        }
        &.opload_img {
            width: 41px;
            height: 40px;
            border: 1px solid @element_bordercolor;
            border-radius: 3px;
            position: relative;
            text-align: center;
            box-sizing: border-box;
            overflow: hidden;
            img {
                width: 41px;
                height: auto;
                border-radius: 3px;
                position: relative;
                top: -1px;
                left: -1px;
            }
        }
    }
    &.error {
        dd.tips {
            display: block;
        }
        dd.ipload {
            color: @red;
        }
    }
    &:after {
        content: '';
        clear: both;
        height: 0;
        line-height: 0;
        font-size: 0;
    }
}

//*自定义组建样式---------------------左侧导航z-index:12------------------------------------------------------------------------------------------------*/
//加载动画load-------------------------z-index: 20;
#load_small_bg {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 10;
    top: 0px;
    left: 0px;
    &:after {
        background: black;
        opacity: 0;
    }
    #load_small {
        width: 120px;
        height: 120px;
        text-align: center;
        line-height: 30px;
        padding-top: 40px;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -60px;
        margin-left: -60px;
        background: black;
        opacity: 0.7;
        z-index: 20;
        border-radius: 6px;
        font-size: 12px;
        span {
            color: white;
            display: none;
        }
        i {
            width: 35px;
            height: 35px;
            -webkit-animation: swiper-preloader-spin 1s steps(12, end) infinite;
            animation: swiper-preloader-spin 1s steps(12, end) infinite;
            display: inline-block;
            background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48IVtDREFUQVsKQGZvbnQtZmFjZSB7IGZvbnQtZmFtaWx5OiBpZm9udDsgc3JjOiB1cmwoaHR0cDovL2F0LmFsaWNkbi5jb20vdC9mb250XzE0NDIzNzM4OTZfNDc1NDQ1NS5lb3Q/I2llZml4KSBmb3JtYXQoZW1iZWRkZWQtb3BlbnR5cGUpLCB1cmwoaHR0cDovL2F0LmFsaWNkbi5jb20vdC9mb250XzE0NDIzNzM4OTZfNDc1NDQ1NS53b2ZmKSBmb3JtYXQod29mZiksIHVybChodHRwOi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTQ0MjM3Mzg5Nl80NzU0NDU1LnR0ZikgZm9ybWF0KHRydWV0eXBlKSwgdXJsKGh0dHA6Ly9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUuc3ZnI2lmb250KSBmb3JtYXQoc3ZnKTsgfQoKXV0+PC9zdHlsZT48L2RlZnM+PGcgY2xhc3M9InRyYW5zZm9ybS1ncm91cCI+PGcgdHJhbnNmb3JtPSJzY2FsZSgwLjE5NTMxMjUsIDAuMTk1MzEyNSkiPjxwYXRoIGQ9Ik0zOTcuMTUyIDE1OC4yNzJtLTE1Ni45OTIgMGE0LjkwNiA0LjkwNiAwIDEgMCAzMTMuOTg0IDAgNC45MDYgNC45MDYgMCAxIDAtMzEzLjk4NCAwWk0xNTEuMTM2IDQ2MS4yOG0tMTMyIDBhNC4xMjUgNC4xMjUgMCAxIDAgMjY0IDAgNC4xMjUgNC4xMjUgMCAxIDAtMjY0IDBaTTI1Ny45ODQgODAwLjI4OG0tMTE5LjAwOCAwYTMuNzE5IDMuNzE5IDAgMSAwIDIzOC4wMTYgMCAzLjcxOSAzLjcxOSAwIDEgMC0yMzguMDE2IDBaTTU2MS40NCA5MjAuMjg4bS0xMDIuNDMyIDBhMy4yMDEgMy4yMDEgMCAxIDAgMjA0Ljg2NCAwIDMuMjAxIDMuMjAxIDAgMSAwLTIwNC44NjQgMFpNODE2LjI1NiA3OTkuNTJtLTg4LjUxMiAwYTIuNzY2IDIuNzY2IDAgMSAwIDE3Ny4wMjQgMCAyLjc2NiAyLjc2NiAwIDEgMC0xNzcuMDI0IDBaTTkyOC45MjggNTc1LjIzMm0tNzUuOTM2IDBhMi4zNzMgMi4zNzMgMCAxIDAgMTUxLjg3MiAwIDIuMzczIDIuMzczIDAgMSAwLTE1MS44NzIgMFpNOTAwLjQ4IDM2NC4xOTJtLTU2LjkyOCAwYTEuNzc5IDEuNzc5IDAgMSAwIDExMy44NTYgMCAxLjc3OSAxLjc3OSAwIDEgMC0xMTMuODU2IDBaTTc3My43NiAyMTIuNzY4bS00Mi40OTYgMGExLjMyOCAxLjMyOCAwIDEgMCA4NC45OTIgMCAxLjMyOCAxLjMyOCAwIDEgMC04NC45OTIgMFoiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==");
            background-position: 50%;
            background-size: 100%;
            background-repeat: no-repeat;
        }
    }
}

@keyframes swiper-preloader-spin {
    100% {
        transform: rotate(360deg);
    }
}

//文字提示toast-------------------------z-index: 20;
div.nomoredata {
    width: 3.6rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    color: white;
    font-size: 0.4rem;
    display: inline-block;
    background: black;
    position: fixed;
    z-index: 20;
    bottom: 1rem;
    border-radius: 3px;
    left: 50%;
    margin-left: -2rem;
    opacity: 0;
}

div.toast_data {
    width: auto;
    padding: 10px;
    height: auto;
    line-height: 21px;
    text-align: center;
    color: white;
    font-size: 16px;
    display: inline-block;
    background: #2F323A;
    position: fixed;
    z-index: 20;
    border-radius: 10px;
    opacity: 0;
    top: 50%;
    margin-top: -30px;
    left: 15px;
    right: 15px;
    z-index: -12;
}

div.toast_data_short {
    width: auto;
    min-width: 300px;
    padding: 20px;
    height: auto;
    line-height: 21px;
    text-align: center;
    color: white;
    font-size: 16px;
    display: inline-block;
    background: #2F323A;
    position: fixed;
    z-index: 20;
    border-radius: 10px;
    opacity: .86;
    top: 50%;
    left: 50%;
    margin-top: -30px;
    margin-left: -150px;
    .close {
        position: absolute;
        top: 5px;
        right: 15px;
        font-size: 20px;
        color: white;
        opacity: 1;
    }
}

//自定义弹框样式bounced------------------------z-index: 20;
.bounced_my {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 10;
    top: 0px;
    left: 0px;
    z-index: 20;
    font-size: 14px;
    &:after {
        content: '';
        background: black;
        opacity: 0.8;
        position: fixed;
        width: 100%;
        height: 100%;
    }
    .bounced_my_body {
        position: absolute;
        z-index: 21;
        width: 360px;
        padding: 0 0 35px;
        background-color: white;
        border-radius: 3px;
        top: 40%;
        left: 50%;
        margin-left: -180px;
        header {
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 16px;
            border-bottom: 1px solid @border_color;
            position: relative;
            display: none;
            i.close {
                position: absolute;
                top: -15px;
                right: -15px;
                width: 40px;
                height: 40px;
                display: inline-block;
                background: url('./img/ic_close@3x.png') center center no-repeat;
                background-size: 40px auto;
            }
        }
        main {
            width: 100%;
            padding: 30px 35px 0;
            box-sizing: border-box;
        }
        footer {
            width: 100%;
            text-align: center;
            p {
                margin-top: 30px;
            }
        }
        //弹框中单行文字
        .bounced_text {
            width: 100%;
            text-align: center;
            line-height: 24px;
            font-size: 16px;
            i {
                font-style: normal;
            }
        }
        //弹框中底部按钮
        .bounced_button {
            display: inline-block;
            padding: 0 10px;
            width: 110px;
            text-align: center;
            height: 40px;
            line-height: 40px;
            margin: 0 10px 0 0;
            border-radius: 3px;
            color: white;
            cursor: pointer;
            &.bounced_sure {
                background-color: @grey_bg;
                &.bounced_sure_right {
                    background-color: @orange;
                }
            }
            &.bounced_cancle {
                background-color: @orange;
            }
            &.bounced_sub {
                width: 160px;
                margin: 20px 0 0;
                background-color: @grey_bg;
                &.bounced_sub_right {
                    background-color: @orange;
                }
            }
            &.single_button {
                margin: 0 0;
            }
        }
        //大弹框
        &.big_bounced {
            width: auto;
            min-width: 460px;
            margin-left: -230px;
            top: 30%;
            header {
                display: block;
            }
        }
    }
}

//*elementUI样式调整---------------------------------------------------------------------------------------------------------------------*/
//table边框火狐浏览器显示--兼容性处理
table {
    border-collapse: separate; //保留边框
}

//隐藏日期插件的  清空 和 此刻 按钮____no_clear和no_now为自定义类
.no_clear {
    .el-picker-panel__footer .el-picker-panel__link-btn {
        display: none;
    }
}

.no_now {
    .el-picker-panel__footer .el-picker-panel__link-btn {
        display: none;
    }
}

//列表搜索栏--时间输入框变短--0000-09
.time_date_short .el-date-editor.el-input {
    width: 100%;
    min-width: 124px;
}

//交易明细--左侧标题 显示灰色
.detail_page {
    .el-form-item__label {
        color: @grey;
    }
}

//新信息框样式
.el-popover {
    &.popover_new {
        padding: 0;
        font-size: 14px;
        border-radius: 3px;
        p {
            width: 100%;
            height: 45px;
            text-align: center;
            line-height: 45px;
            color: white;
            background: @orange;
            border-radius: 3px 3px 0 0;
        }
        ul {
            width: 100%;
            padding: 10px 20px 10px;
            box-sizing: border-box;
            line-height: 30px;
            li {
                width: 100%;
            }
        }
        .popper__arrow {
            &::after {
                content: '';
                border-width: 10px;
            }
        }
        &[x-placement^="bottom"] .popper__arrow {
            top: -10px;
            border-bottom-color: @orange;
            border-width: 10px;
            border-top-width: 0;
            &::after {
                content: '';
                border-bottom-color: @orange;
                display: none;
            }
        }
        &[x-placement^="top"] .popper__arrow {
            bottom: -10px;
            border-width: 10px;
            border-bottom-width: 0;
            &::after {
                content: '';
                margin-left: -10px;
            }
        }
    }
}
</style>
