<template>
    <div>
        <div class="right_head">
            账户信息
        </div>
        <div class="right_body">
            <el-form :model="account" :rules="rules_account" ref="account" label-width="125px" class="demo-ruleForm">
                <el-row>
                    <div class="step_show">
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="收款人姓名" prop="bankuser">
                                <el-input v-model="account.bankuser" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="银行账户" prop="bankaccount">
                                <el-input v-model="account.bankaccount" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="总行名称" prop="headbankname">
                                <el-select v-model="account.headbankname" placeholder="请选择总行" disabled>
                                    <el-option v-for="headbankname in headbanks" v-bind:bankid="headbankname.headbankid" v-bind:value="headbankname.headbankname" v-bind:label="headbankname.headbankname">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="支行名称" prop="bankname">
                                <el-input v-model="account.bankname" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24">
                            <div class="clearfix_liner1"></div>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="结算类型" prop="banktype">
                                <el-select v-model.number="account.banktype" placeholder="请选择结算类型" disabled>
                                    <el-option v-for="banktype in banktypes.records" v-bind:value="banktype.tp" v-bind:label="banktype.text">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="结算方式" prop="settle_cycle">
                                <el-select v-model.number="account.settle_cycle" placeholder="请选择结算方式" disabled>
                                    <el-option v-for="cycle in settle_cycle.records" v-bind:value="cycle.tp" v-bind:label="cycle.text">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="起结金额" prop="settle_base_amt">
                                <el-input v-model.number="account.settle_base_amt" :disabled="true">
                                    <template slot="append">元</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="手续费" prop="fee">
                                <el-input v-model.number="account.fee" :disabled="true">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="微信手续费" prop="wechat_fee">
                                <el-input v-model.number="account.wechat_fee" :disabled="true">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="支付宝手续费" prop="alipay_fee">
                                <el-input v-model.number="account.alipay_fee" :disabled="true">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="QQ钱包手续费" prop="qqwallet_fee">
                                <el-input v-model.number="account.qqwallet_fee" :disabled="true">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="京东钱包手续费" prop="jd_fee">
                                <el-input v-model.number="account.jd_fee" :disabled="true">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="刷卡手续费" prop="swipecard_fee">
                                <el-input v-model.number="account.swipecard_fee" :disabled="true">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="商户默认费率" prop="default_mchnt_fee">
                                <el-input v-model.number="account.default_mchnt_fee" :disabled="true">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </div>
                    <div class="m_t_20 t_c">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24">
                            <el-button @click="goback">返回</el-button>
                        </el-col>
                    </div>
                </el-row>
            </el-form>
        </div>
        <load :visible="loading"></load>
        <toast :msg="toastmsg" :visible="visible_toast" @on-visible-change="onVisibleChange" @on-msg-change="onMsgChange"></toast>
    </div>
</template>
<script>
export default {
    name: 'channel_account',
    data() {
        // var checkamt = (rule, value, callback) => {
        //     if (!value) {
        //         return callback(new Error('请输入起结金额'));
        //     }
        //     let reg = /^[0-9]{0,9}$/;
        //     value = value.toString().replace(/\D/g, '');
        //     setTimeout(() => {
        //         if (!reg.test(value)) {
        //             callback(new Error('请输入数字值,最大9位数'));
        //         } else {
        //             callback();
        //         }
        //     }, 1000);
        // };
        var checkamt = (rule, value, callback) => {
            // if (!value) {
            //     return callback(new Error('请输入起结金额'));
            // }
            //let reg = /^[0-9]{0,9}$/;
            let reg = /^[0-9]{0,9}(\.{1}\d{1,2}){0,1}$/;
            //value = value.toString().replace(/\D/g, '');
            setTimeout(() => {
                if (!reg.test(value)) {
                    callback(new Error('请输入数字值,最大9位数'));
                } else {
                    callback();
                }
            }, 100);
        };
        var check_fee_has = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入该费率'));
            }
            let reg = /^[0-9]{0,2}(\.{1}\d{1,2}){0,1}$/;
            //value = value.toString().replace(/\D/g, '');
            setTimeout(() => {
                if (!reg.test(value)) {
                    callback(new Error('请输入小于100的整数或两位小数'));
                } else {
                    callback();
                }
            }, 100);
        };
        var check_fee = (rule, value, callback) => {
            let reg = /^[0-9]{0,2}(\.{1}\d{1,2}){0,1}$/;
            //value = value.toString().replace(/\D/g, '');
            setTimeout(() => {
                if (!reg.test(value)) {
                    callback(new Error('请输入小于100的整数或两位小数'));
                } else {
                    callback();
                }
            }, 100);
        };
        return {
            bank_error: false,
            bankname_error: false,
            loading: false, //load是否显示
            toastmsg: '', //提示文字
            visible_toast: false, //toast是否显示
            banktypes: {}, //ajax获取结算类型
            settle_cycle: {}, //ajax获取结算方式
            headbanks: [], //ajax获取总行列表
            branchbanks: [], //ajax获取支行列表
            account: {
                "userid": '', // 渠道编号
                "bankaccount": "", // 收款账户(网点账户号)
                "bankuser": "", // 开户名称(网点开户名)
                "headbankname": "", // 银行总行名称
                "bankname": "", // 银行开户行名称(网店名称/支行名称)
                "banktype": '', // 结算类型(账户类型): 1 对私, 2 对公
                "settle_cycle": '', // 结算方式(结算周期): 1 实时, 2 月结, 3 季度结
                "settle_base_amt": '', // 起结金额, 单位: 分
                "fee": '', // 手续费, 单位: 百分比
                "wechat_fee": '', // 微信手续费
                "alipay_fee": '', // 支付宝手续费
                "jd_fee": '', // 京东手续费
                "qqwallet_fee": '', // QQ 钱包手续费
                "swipecard_fee": '', // 刷卡手续费
                "default_mchnt_fee": '', //商户默认费率
            },
            headbankid: '', //中间值-总行id
            qd_account_url: location.protocol + '//' + location.host + '/qudao/v1/api/qd/' + this.$route.params.userid + '/account_info', //银行总行列表
            qd_headbanks_url: location.protocol + '//' + location.host + '/qudao/v1/api/tools/headbanks', //银行总行列表
            qd_branchbanks_url: location.protocol + '//' + location.host + '/qudao/v1/api/tools/branchbanks', //银行支行列表
            qd_banktypes_url: location.protocol + '//' + location.host + '/qudao/v1/api/tools/banktypes', //结算类型
            qd_cycle_url: location.protocol + '//' + location.host + '/qudao/v1/api/tools/settle_cycle', //结算方式列表
            banktypes_over: false, //结算类型调用完成为true
            settle_cycle_over: false, //结算方式调用完成为true
            headbanks_over: false, //总行调用完成为true
            rules_account: {
                bankuser: [{
                    required: true,
                    pattern: /^[\u4e00-\u9fa5]{1,4}$/,
                    message: '请输入收款账户，长度在 1 到 4 个字符',
                    trigger: 'blur'
                }],
                bankaccount: [{
                    required: true,
                    pattern: /^[0-9]{10,19}$/,
                    message: '请输入银行账号，长度在 10 到 19 个字符',
                    trigger: 'blur'
                }],
                settle_base_amt: [{
                    validator: checkamt,
                    // type: 'number',
                    // required: false,
                    // len:8,
                    // message: '请输入起结金额，长度在 1 到 8 个字符',
                    trigger: 'blur'
                }],
                fee: [{
                    type: 'number',
                    required: true,
                    max: 100,
                    message: '请输入手续费',
                    trigger: 'blur'
                }],
                banktype: [{
                    type: "number",
                    required: false,
                    message: '请选择结算类型',
                    trigger: 'change'
                }],
                settle_cycle: [{
                    type: "number",
                    required: false,
                    message: '请选择结算方式',
                    trigger: 'change'
                }],
                headbankname: [{
                    required: true,
                    message: '请选择总行',
                    trigger: 'change'
                }],
                bankname: [{
                    required: true,
                    message: '请选择支行',
                    trigger: 'blur'
                }],
                wechat_fee: [{
                    validator: check_fee_has,
                    // type: 'number',
                    required: true,
                    // max: 100,
                    // message: '请输入手续费',
                    trigger: 'blur'
                }],
                alipay_fee: [{
                    validator: check_fee_has,
                    // type: 'number',
                    required: true,
                    // max: 100,
                    // message: '请输入手续费',
                    trigger: 'blur'
                }],
                jd_fee: [{
                    validator: check_fee_has,
                    // type: 'number',
                    required: true,
                    // max: 100,
                    // message: '请输入手续费',
                    trigger: 'blur'
                }],
                qqwallet_fee: [{
                    validator: check_fee_has,
                    // type: 'number',
                    required: true,
                    // max: 100,
                    // message: '请输入手续费',
                    trigger: 'blur'
                }],
                swipecard_fee: [{
                    validator: check_fee_has,
                    // type: 'number',
                    required: true,
                    // max: 100,
                    // message: '请输入手续费',
                    trigger: 'blur'
                }],
                default_mchnt_fee: [{
                    validator: check_fee,
                    // type: 'number',
                    // required: false,
                    // max: 100,
                    // message: '请输入手续费',
                    trigger: 'blur'
                }],
            },
        }
    },
    created: function() {
        this.get_banktypes(); //获取结算类型       
        this.get_cycle(); //获取结算方式      
        this.get_banks(); //获取总行 
    },
    watch: {
        banktypes_over: function(val, oldVal) {
            let _this = this;
            if (_this.banktypes_over && _this.settle_cycle_over && _this.headbanks_over) {
                _this.get_account(); //获取结算类型所有值
            }
        },
        settle_cycle_over: function(val, oldVal) {
            let _this = this;
            if (_this.banktypes_over && _this.settle_cycle_over && _this.headbanks_over) {
                _this.get_account(); //获取结算类型所有值
            }
        },
        headbanks_over: function(val, oldVal) {
            let _this = this;
            if (_this.banktypes_over && _this.settle_cycle_over && _this.headbanks_over) {
                _this.get_account(); //获取结算类型所有值
            }
        },
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
        goback: function() {
            this.$router.go(-1);
        },
        //总行变化后，调整支行
        select_bank: function() {
            // var index = e.target.selectedIndex;
            // var select_op = e.target[index].attributes.areaid.value;
            // var _this = this;
            // let post_data = {
            //     headbankid: select_op
            // };
            // _this.get_branchbank(post_data);

            var _this = this;
            let select_op = '';
            for (let i = 0; i < _this.headbanks.length; i++) {
                if (_this.headbanks[i].headbankname == _this.account.headbankname) {
                    select_op = _this.headbanks[i].headbankid;
                    break;
                }
            }
            let post_data = {
                'headbankid': select_op,
                'cityid': _this.city_id,
            };
            _this.get_branchbank(post_data);
        },
        //获取特定渠道的账户信息
        get_account: function() {
            var _this = this;
            this.$http.get(this.qd_account_url, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    var data_return = response.body;
                    if (data_return.respcd == '0000') {
                        // //设置初始值
                        _this.account = data_return.data;
                        _this.account.settle_base_amt = (data_return.data.settle_base_amt / 100).toFixed(0);
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
            // let return_data = {
            //     "userid": 123, // 渠道编号
            //     "bankaccount": "623300000", // 收款账户(网点账户号)
            //     "bankuser": "张三", // 开户名称(网点开户名)
            //     "headbankname": "中国招商银行", // 银行总行名称
            //     "bankname": "厦门国际银行上海分行", // 银行开户行名称(网店名称/支行名称)
            //     "banktype": 1, // 结算类型(账户类型): 1 对私, 2 对公
            //     "settle_cycle": 1, // 结算方式(结算周期): 1 实时, 2 月结, 3 季度结
            //     "settle_base_amt": 3000000, // 起结金额, 单位: 分
            //     "fee": 1.5, // 手续费, 单位: 百分比
            // };
            // //设置初始值
            // _this.account = return_data;
            // _this.account.settle_base_amt = (return_data.settle_base_amt / 100).toFixed(0);
        },
        //获取结算类型
        get_banktypes: function() {
            var _this = this;
            this.$http.get(this.qd_banktypes_url, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    var data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.banktypes = data_return.data;
                        //设置初始值
                        _this.account.banktype = _this.banktypes.default;
                        _this.banktypes_over = true;
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
            // _this.banktypes = {
            //     "records": [{
            //         "tp": 1,
            //         "text": "对私"
            //     }, {
            //         "tp": 2,
            //         "text": "对公"
            //     }],
            //     "default": 2 // 默认tp
            // };
            // //设置初始值
            // _this.account.banktype = _this.banktypes.default;
            // _this.banktypes_over=true;
        },
        //获取结算方式列表
        get_cycle: function() {
            var _this = this;
            this.$http.get(this.qd_cycle_url, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    var data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.settle_cycle = data_return.data;
                        //设置初始值
                        _this.account.settle_cycle = _this.settle_cycle.default;
                        _this.settle_cycle_over = true;
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
            // _this.settle_cycle = {
            //     "records": [{
            //         "tp": 1,
            //         "text": "实时"
            //     }, {
            //         "tp": 2,
            //         "text": "月结"
            //     }, {
            //         "tp": 3,
            //         "text": "季度结"
            //     }, ],
            //     "default": 2 // 默认tp
            // };
            // //设置初始值
            // _this.account.settle_cycle = _this.settle_cycle.default;
            // _this.settle_cycle_over=true;
        },
        //获取银行总行列表
        get_banks: function() {
            var _this = this;
            this.$http.get(this.qd_headbanks_url, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    var data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.headbanks = data_return.data.records;
                        //设置初始值 
                        _this.account.headbankname = _this.headbanks[0].headbankname;
                        //获取支行
                        // let post_data={headbankid:_this.headbanks[0].headbankid};
                        // _this.get_branchbank(post_data);                        
                        _this.headbanks_over = true;
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
            // _this.headbanks = [{
            //     "headbankid": 1111, //总行id，在获取支行列表中有用
            //     "headbankname": '中国工商银行', //总行名称
            //     "iscommon": 1, //是否常用，1为常用，0为不常用
            //     "csphone": '95555' //客服电话，默认为空
            // }, {
            //     "headbankid": 222, //总行id，在获取支行列表中有用
            //     "headbankname": '中国农业银行', //总行名称
            //     "iscommon": 1, //是否常用，1为常用，0为不常用
            //     "csphone": '95555' //客服电话，默认为空
            // }, {
            //     "headbankid": 3333, //总行id，在获取支行列表中有用
            //     "headbankname": '中国招商银行', //总行名称
            //     "iscommon": 1, //是否常用，1为常用，0为不常用
            //     "csphone": '95555' //客服电话，默认为空
            // }];
            // //设置初始值 
            // _this.account.headbankname = _this.headbanks[0].headbankname;
            // _this.get_branchbank();
        },
        //获取渠道类型列表
        get_branchbank: function(post_data) {
            var _this = this;
            this.$http.get(this.qd_branchbanks_url, post_data, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    var data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.branchbanks = data_return.data.records;
                        //设置初始值
                        _this.account.bankname = _this.branchbanks[0].name;
                        _this.headbanks_over = true;
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
            // _this.branchbanks = [{
            //     "name": "厦门国际银行上海分行" //支行名称
            // }];
            // //设置初始值
            // _this.account.bankname = _this.branchbanks[0].name;
            // _this.headbanks_over=true;
        },
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
</style>
