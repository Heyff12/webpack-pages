<template>
    <div>
        <div class="right_head">
            渠道信息列表
        </div>
        <div class="right_body">
            <el-form label-width="110px" class="demo-ruleForm">
                <el-row :gutter="30">
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="渠道编号：">
                            <el-input v-model="searchkey.id"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="渠道名称：">
                            <el-input v-model="searchkey.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="渠道状态：">
                            <el-select v-model="searchkey.status" placeholder="请选择活动区域">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="正常" value="0"></el-option>
                                <el-option label="停用" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label-width="0" class="t_c">
                            <el-button type="default" @click="fresh_sub">刷新</el-button>
                            <el-button type="primary" @click="search_sub">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template>
                <el-table :data="channels_now" border stripe style="width: 100%">
                    <el-table-column prop="base.userid" label="渠道编号" resizable min-width="80px">
                    </el-table-column>
                    <el-table-column prop="base.name" label="渠道全称" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="base.short_name" label="渠道简称" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column label="渠道状态" resizable>
                        <template scope="scope">
                            <span v-if="scope.row.base.status">停用</span>
                            <span v-else>正常</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="基本信息" resizable min-width="100px" align="center">
                        <template scope="scope">
                            <router-link :to="{ name: 'channel_base',params: { userid: scope.row.base.userid }}">
                                <el-button type="text">点击查看</el-button>
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="账户信息" resizable min-width="100px" align="center">
                        <template scope="scope">
                            <router-link :to="{ name: 'channel_account',params: { userid: scope.row.base.userid }}">
                                <el-button type="text">点击查看</el-button>
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="增值产品" resizable min-width="100px" align="center">
                        <template scope="scope">
                            <router-link :to="{ name: 'channel_pro',params: { userid: scope.row.base.userid }}">
                                <el-button type="text">点击查看</el-button>
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="base.join_dtm" label="注册时间" resizable min-width="170px">
                    </el-table-column>
                    <el-table-column label="操作" resizable min-width="100px" align="center">
                        <template scope="scope">
                            <span v-if="scope.row.base.status"><el-button type="info" @click="open_chan(scope.row.base)">开启</el-button></span>
                            <span v-else><el-button type="warning" @click="stop_chan(scope.row.base)">停用</el-button></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" resizable min-width="100px">
                    </el-table-column>
                </el-table>
            </template>
            <div class="block t_r mar_t20">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page_now" :page-sizes="[20,50,100,200,250]" :page-size="page_per" layout="total, sizes, prev, pager, next" :total="pages_all">
                </el-pagination>
            </div>
        </div>
        <el-dialog v-model="opratedialog" size="tiny">
            <span class="dialog_text">
                确定要<i class="orange" v-if="oprate_if">开启</i><i class="orange" v-else>停用</i>该渠道信息吗？
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="opratedialog = false">取 消</el-button>
                <el-button type="primary" @click="mend_chan">确 定</el-button>
            </span>
        </el-dialog>
        <load :visible="loading"></load>
        <toast :msg="toastmsg" :visible="visible_toast" @on-visible-change="onVisibleChange" @on-msg-change="onMsgChange"></toast>
    </div>
</template>
<script>
import load from '../../components/load'
import toast from '../../components/toast'
export default {
    name: 'channel_list',
    components: {
        load,
        toast
    },
    data() {
        return {
            opratedialog: false, //开启、停用弹框是否开启
            oprate_if: true, //true代表开启，false代表停用
            oprate_data: {}, //弹框需要传入的代码
            loading: false, //load是否显示
            toastmsg: '', //toast提示文字
            visible_toast: false, //toast是否显示
            searchkey: {
                id: '',
                name: '',
                status: ''
            },
            channels: [],
            list_url: location.protocol + '//' + location.host + '/qudao/v1/api/qd/list', //获取渠道信息列表
            chan_url: location.protocol + '//' + location.host + '/qudao/v1/api/qd/', //渠道开启停用
            pages_all: 0, //总信息数
            page_per: 20, //每页信息数
            pages: 1, //总页数
            page_now: 1, //当前页数
            channels_mid: [], //搜索后的总信息
            channels_now: [], //当前展示信息
        }
    },
    created: function() {
        this.get_list(); //获取渠道信息列表 
    },
    watch: {
        channels_mid: function(val, oldVal) {
            var _this = this;
            _this.pages_all = _this.channels_mid.length;
            _this.page_now = 1;
            _this.channels_now = _this.channels_mid.slice(0, _this.page_now * _this.page_per);
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
        //获取渠道信息列表
        get_list: function() {
            let _this = this;
            let post_data = {
                'pos': 0,
                'count': 1000000,
                'query': {
                    'userid': '',
                    'name': '',
                    'status': ''
                }
            };
            this.$http.get(this.list_url, {
                    'params': post_data,
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    let data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.channels = data_return.data;
                        _this.channels_mid = _this.channels;
                        _this.pages_all = _this.channels_mid.length;
                        _this.channels_now = _this.channels_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
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
            //获取测试数据--本地
            //_this.getdava_test();          
        },
        //提交查询
        search_sub: function() {
            var _this = this;
            _this.channels_mid = [];
            var key_id = this.searchkey.id;
            var key_name = this.searchkey.name;
            var key_status = this.searchkey.status;
            for (let i = 0; i < _this.channels.length; i++) {
                let userid = _this.channels[i].base.userid.toString();
                let status = _this.channels[i].base.status.toString();
                let name = _this.channels[i].base.name;
                if (userid.indexOf(key_id) != '-1' && name.indexOf(key_name) != '-1' && status.indexOf(key_status) != '-1') {
                    _this.channels_mid.push(_this.channels[i]);
                }
            }
            return _this.channels_mid;
        },
        //清空并刷新
        fresh_sub:function(){
            var _this = this;
            _this.searchkey = {
                id: '',
                name: '',
                status: '',
            };//清空搜索内容
            _this.page_now=1;//页数回到第一页
            _this.get_list(); //获取最新列表
        },
        //筛选--停用
        num_ser: function(channels) {
            var key_id = this.searchkey.id;
            var key_name = this.searchkey.name;
            var key_status = this.searchkey.status;
            return channels.filter(function(channel) {
                var userid = channel.base.userid.toString();
                var status = channel.base.status.toString();
                return userid.indexOf(key_id) != '-1' && channel.base.name.indexOf(key_name) != '-1' && status.indexOf(key_status) != '-1';
            })
        },
        handleSizeChange(val) {
            let _this = this;
            //console.log(`每页 ${val} 条`);
            _this.page_per = val;
            _this.page_now = 1;
            _this.channels_now = _this.channels_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
        },
        handleCurrentChange(val) {
            //console.log(`当前页: ${val}`);
            let _this = this;
            _this.page_now = val;
            _this.channels_now = _this.channels_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
        },
        //开启渠道状态
        open_chan: function(val) {
            let _this = this;
            _this.oprate_data = val;
            _this.oprate_if = true;
            _this.opratedialog = true;
        },
        //关闭渠道状态
        stop_chan: function(val) {
            let _this = this;
            _this.oprate_data = val;
            _this.oprate_if = false;
            _this.opratedialog = true;
        },
        //操作事件
        mend_chan: function() {
            let _this = this;
            let userid = _this.oprate_data.userid;
            let status;
            _this.opratedialog = false;//关闭弹框
            if (_this.oprate_if) {
                status = 0;//需要开启该状态
            } else {
                status = 1;
            }
            let post_data = {
                'status': status,
            };
            this.$http.post(this.chan_url + userid + '/status', post_data, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    let data_return = response.body;
                    if (data_return.respcd == '0000') {
                        for (let i = 0; i < _this.channels.length; i++) {
                            if (_this.channels[i].base.userid == userid) {
                                if (_this.oprate_if) {
                                    this.channels[i].base.status = 0;
                                } else {
                                    this.channels[i].base.status = 1;
                                }
                                //如果帅选的状态不是全部，更新筛选数据    
                                if (_this.searchkey.status == '0' || _this.searchkey.status == '1') {
                                    _this.search_sub();
                                }
                                break;
                            }
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
        },
        //测试列表数据--仅供测试
        getdava_test(){
            _this.channels = [{
                "base": {
                    "userid": 123, // 渠道编号
                    "status": 0, // 渠道状态: 0 启用, 1 禁用
                    "join_dtm": "2016-01-01 12:22:23", // 注册时间
                    "email": "chen@qfpay.com", // 注册邮箱
                    "type": 1, // 渠道类型: 1 白牌, 2 联名
                    "slsm_uid": 123, // 所属业务员ID

                    "name": "四川渠道01", // 渠道名称
                    "short_name": "川01", // 渠道简称
                    "legal_name": "王二", // 法人姓名
                    "legal_idnumber": "511325197001013333", // 法人省份证号码
                    "province": "四川省", // 所在省份
                    "city": "成都市", // 所在城市
                    "address": "华阳", // 商户地址
                    "business_name": "李二", // 业务联系人姓名
                    "business_mobile": "13012340000", // 业务联系人手机号
                    "business_email": "lier@qfpay.com", // 业务联系人邮箱
                    "finace_name": "李二", // 财务联系人姓名
                    "finace_mobile": "13012340000", // 财务联系人手机号
                    "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                    "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                    "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                    "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                    "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                }, // 渠道基本信息
                "account": {
                    "userid": 123, // 渠道编号
                    "bankaccount": "623300000", // 收款账户(网点账户号)
                    "bankuser": "张三", // 开户名称(网点开户名)
                    "headbankname": "中国银行", // 银行总行名称
                    "bankname": "朝阳门支行", // 银行开户行名称(网店名称/支行名称)
                    "banktype": 1, // 结算类型(账户类型): 1 对私, 2 对公
                    "settle_cycle": 1, // 结算方式(结算周期): 1 实时, 2 月结, 3 季度结
                    "settle_base_amt": 3000000, // 起结金额, 单位: 分
                    "fee": 1.5, // 手续费, 单位: 百分比
                }, // 渠道账户信息
                "product": [{
                    "userid": 123, // 渠道编号
                    "product_id": 123, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 0, // 开通状态: 0 已开通, 1 未开通
                }, {
                    "userid": 133, // 渠道编号
                    "product_id": 133, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 1, // 开通状态: 0 已开通, 1 未开通
                }]
            }, {
                "base": {
                    "userid": 23446457, // 渠道编号
                    "status": 0, // 渠道状态: 0 启用, 1 禁用
                    "join_dtm": "2016-01-01 12:22:23", // 注册时间
                    "email": "chen@qfpay.com", // 注册邮箱
                    "type": 1, // 渠道类型: 1 白牌, 2 联名
                    "slsm_uid": 123, // 所属业务员ID

                    "name": "四川渠道01", // 渠道名称
                    "short_name": "川01", // 渠道简称
                    "legal_name": "王二", // 法人姓名
                    "legal_idnumber": "511325197001013333", // 法人省份证号码
                    "province": "四川省", // 所在省份
                    "city": "成都市", // 所在城市
                    "address": "华阳", // 商户地址
                    "business_name": "李二", // 业务联系人姓名
                    "business_mobile": "13012340000", // 业务联系人手机号
                    "business_email": "lier@qfpay.com", // 业务联系人邮箱
                    "finace_name": "李二", // 财务联系人姓名
                    "finace_mobile": "13012340000", // 财务联系人手机号
                    "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                    "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                    "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                    "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                    "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                }, // 渠道基本信息
                "account": {
                    "userid": 123, // 渠道编号
                    "bankaccount": "623300000", // 收款账户(网点账户号)
                    "bankuser": "张三", // 开户名称(网点开户名)
                    "headbankname": "中国银行", // 银行总行名称
                    "bankname": "朝阳门支行", // 银行开户行名称(网店名称/支行名称)
                    "banktype": 1, // 结算类型(账户类型): 1 对私, 2 对公
                    "settle_cycle": 1, // 结算方式(结算周期): 1 实时, 2 月结, 3 季度结
                    "settle_base_amt": 3000000, // 起结金额, 单位: 分
                    "fee": 1.5, // 手续费, 单位: 百分比
                }, // 渠道账户信息
                "product": [{
                    "userid": 123, // 渠道编号
                    "product_id": 123, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 0, // 开通状态: 0 已开通, 1 未开通
                }, {
                    "userid": 133, // 渠道编号
                    "product_id": 133, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 1, // 开通状态: 0 已开通, 1 未开通
                }]
            }, {
                "base": {
                    "userid": 45634345, // 渠道编号
                    "status": 0, // 渠道状态: 0 启用, 1 禁用
                    "join_dtm": "2016-01-01 12:22:23", // 注册时间
                    "email": "chen@qfpay.com", // 注册邮箱
                    "type": 1, // 渠道类型: 1 白牌, 2 联名
                    "slsm_uid": 123, // 所属业务员ID

                    "name": "四川大概01", // 渠道名称
                    "short_name": "川01", // 渠道简称
                    "legal_name": "王二", // 法人姓名
                    "legal_idnumber": "511325197001013333", // 法人省份证号码
                    "province": "四川省", // 所在省份
                    "city": "成都市", // 所在城市
                    "address": "华阳", // 商户地址
                    "business_name": "李二", // 业务联系人姓名
                    "business_mobile": "13012340000", // 业务联系人手机号
                    "business_email": "lier@qfpay.com", // 业务联系人邮箱
                    "finace_name": "李二", // 财务联系人姓名
                    "finace_mobile": "13012340000", // 财务联系人手机号
                    "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                    "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                    "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                    "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                    "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                }, // 渠道基本信息
                "account": {
                    "userid": 123, // 渠道编号
                    "bankaccount": "623300000", // 收款账户(网点账户号)
                    "bankuser": "张三", // 开户名称(网点开户名)
                    "headbankname": "中国银行", // 银行总行名称
                    "bankname": "朝阳门支行", // 银行开户行名称(网店名称/支行名称)
                    "banktype": 1, // 结算类型(账户类型): 1 对私, 2 对公
                    "settle_cycle": 1, // 结算方式(结算周期): 1 实时, 2 月结, 3 季度结
                    "settle_base_amt": 3000000, // 起结金额, 单位: 分
                    "fee": 1.5, // 手续费, 单位: 百分比
                }, // 渠道账户信息
                "product": [{
                    "userid": 123, // 渠道编号
                    "product_id": 123, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 1, // 开通状态: 0 已开通, 1 未开通
                }, {
                    "userid": 133, // 渠道编号
                    "product_id": 133, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 1, // 开通状态: 0 已开通, 1 未开通
                }]
            }, {
                "base": {
                    "userid": 34547, // 渠道编号
                    "status": 1, // 渠道状态: 0 启用, 1 禁用
                    "join_dtm": "2016-01-01 12:22:23", // 注册时间
                    "email": "chen@qfpay.com", // 注册邮箱
                    "type": 1, // 渠道类型: 1 白牌, 2 联名
                    "slsm_uid": 123, // 所属业务员ID

                    "name": "四渠道44", // 渠道名称
                    "short_name": "川01", // 渠道简称
                    "legal_name": "王二", // 法人姓名
                    "legal_idnumber": "511325197001013333", // 法人省份证号码
                    "province": "四川省", // 所在省份
                    "city": "成都市", // 所在城市
                    "address": "华阳", // 商户地址
                    "business_name": "李二", // 业务联系人姓名
                    "business_mobile": "13012340000", // 业务联系人手机号
                    "business_email": "lier@qfpay.com", // 业务联系人邮箱
                    "finace_name": "李二", // 财务联系人姓名
                    "finace_mobile": "13012340000", // 财务联系人手机号
                    "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                    "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                    "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                    "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                    "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                }, // 渠道基本信息
                "account": {
                    "userid": 123, // 渠道编号
                    "bankaccount": "623300000", // 收款账户(网点账户号)
                    "bankuser": "张三", // 开户名称(网点开户名)
                    "headbankname": "中国银行", // 银行总行名称
                    "bankname": "朝阳门支行", // 银行开户行名称(网店名称/支行名称)
                    "banktype": 1, // 结算类型(账户类型): 1 对私, 2 对公
                    "settle_cycle": 1, // 结算方式(结算周期): 1 实时, 2 月结, 3 季度结
                    "settle_base_amt": 3000000, // 起结金额, 单位: 分
                    "fee": 1.5, // 手续费, 单位: 百分比
                }, // 渠道账户信息
                "product": [{
                    "userid": 123, // 渠道编号
                    "product_id": 123, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 0, // 开通状态: 0 已开通, 1 未开通
                }, {
                    "userid": 133, // 渠道编号
                    "product_id": 133, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 1, // 开通状态: 0 已开通, 1 未开通
                }]
            }, {
                "base": {
                    "userid": 456400545, // 渠道编号
                    "status": 0, // 渠道状态: 0 启用, 1 禁用
                    "join_dtm": "2016-01-01 12:22:23", // 注册时间
                    "email": "chen@qfpay.com", // 注册邮箱
                    "type": 1, // 渠道类型: 1 白牌, 2 联名
                    "slsm_uid": 123, // 所属业务员ID

                    "name": "四川渠道01", // 渠道名称
                    "short_name": "川01", // 渠道简称
                    "legal_name": "王二", // 法人姓名
                    "legal_idnumber": "511325197001013333", // 法人省份证号码
                    "province": "四川省", // 所在省份
                    "city": "成都市", // 所在城市
                    "address": "华阳", // 商户地址
                    "business_name": "李二", // 业务联系人姓名
                    "business_mobile": "13012340000", // 业务联系人手机号
                    "business_email": "lier@qfpay.com", // 业务联系人邮箱
                    "finace_name": "李二", // 财务联系人姓名
                    "finace_mobile": "13012340000", // 财务联系人手机号
                    "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                    "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                    "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                    "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                    "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                }, // 渠道基本信息
                "account": {
                    "userid": 123, // 渠道编号
                    "bankaccount": "623300000", // 收款账户(网点账户号)
                    "bankuser": "张三", // 开户名称(网点开户名)
                    "headbankname": "中国银行", // 银行总行名称
                    "bankname": "朝阳门支行", // 银行开户行名称(网店名称/支行名称)
                    "banktype": 1, // 结算类型(账户类型): 1 对私, 2 对公
                    "settle_cycle": 1, // 结算方式(结算周期): 1 实时, 2 月结, 3 季度结
                    "settle_base_amt": 3000000, // 起结金额, 单位: 分
                    "fee": 1.5, // 手续费, 单位: 百分比
                }, // 渠道账户信息
                "product": [{
                    "userid": 123, // 渠道编号
                    "product_id": 123, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 0, // 开通状态: 0 已开通, 1 未开通
                }, {
                    "userid": 133, // 渠道编号
                    "product_id": 133, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 1, // 开通状态: 0 已开通, 1 未开通
                }]
            }, {
                "base": {
                    "userid": 12345677880, // 渠道编号
                    "status": 1, // 渠道状态: 0 启用, 1 禁用
                    "join_dtm": "2016-01-01 12:22:23", // 注册时间
                    "email": "chen@qfpay.com", // 注册邮箱
                    "type": 1, // 渠道类型: 1 白牌, 2 联名
                    "slsm_uid": 123, // 所属业务员ID

                    "name": "四川渠道01", // 渠道名称
                    "short_name": "川01", // 渠道简称
                    "legal_name": "王二", // 法人姓名
                    "legal_idnumber": "511325197001013333", // 法人省份证号码
                    "province": "四川省", // 所在省份
                    "city": "成都市", // 所在城市
                    "address": "华阳", // 商户地址
                    "business_name": "李二", // 业务联系人姓名
                    "business_mobile": "13012340000", // 业务联系人手机号
                    "business_email": "lier@qfpay.com", // 业务联系人邮箱
                    "finace_name": "李二", // 财务联系人姓名
                    "finace_mobile": "13012340000", // 财务联系人手机号
                    "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                    "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                    "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                    "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                    "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                }, // 渠道基本信息
                "account": {
                    "userid": 123, // 渠道编号
                    "bankaccount": "623300000", // 收款账户(网点账户号)
                    "bankuser": "张三", // 开户名称(网点开户名)
                    "headbankname": "中国银行", // 银行总行名称
                    "bankname": "朝阳门支行", // 银行开户行名称(网店名称/支行名称)
                    "banktype": 1, // 结算类型(账户类型): 1 对私, 2 对公
                    "settle_cycle": 1, // 结算方式(结算周期): 1 实时, 2 月结, 3 季度结
                    "settle_base_amt": 3000000, // 起结金额, 单位: 分
                    "fee": 1.5, // 手续费, 单位: 百分比
                }, // 渠道账户信息
                "product": [{
                    "userid": 123, // 渠道编号
                    "product_id": 123, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 0, // 开通状态: 0 已开通, 1 未开通
                }, {
                    "userid": 133, // 渠道编号
                    "product_id": 133, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 1, // 开通状态: 0 已开通, 1 未开通
                }]
            }, {
                "base": {
                    "userid": 4575687, // 渠道编号
                    "status": 0, // 渠道状态: 0 启用, 1 禁用
                    "join_dtm": "2016-01-01 12:22:23", // 注册时间
                    "email": "chen@qfpay.com", // 注册邮箱
                    "type": 1, // 渠道类型: 1 白牌, 2 联名
                    "slsm_uid": 123, // 所属业务员ID

                    "name": "四川渠道01", // 渠道名称
                    "short_name": "川01", // 渠道简称
                    "legal_name": "王二", // 法人姓名
                    "legal_idnumber": "511325197001013333", // 法人省份证号码
                    "province": "四川省", // 所在省份
                    "city": "成都市", // 所在城市
                    "address": "华阳", // 商户地址
                    "business_name": "李二", // 业务联系人姓名
                    "business_mobile": "13012340000", // 业务联系人手机号
                    "business_email": "lier@qfpay.com", // 业务联系人邮箱
                    "finace_name": "李二", // 财务联系人姓名
                    "finace_mobile": "13012340000", // 财务联系人手机号
                    "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                    "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                    "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                    "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                    "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                }, // 渠道基本信息
                "account": {
                    "userid": 123, // 渠道编号
                    "bankaccount": "623300000", // 收款账户(网点账户号)
                    "bankuser": "张三", // 开户名称(网点开户名)
                    "headbankname": "中国银行", // 银行总行名称
                    "bankname": "朝阳门支行", // 银行开户行名称(网店名称/支行名称)
                    "banktype": 1, // 结算类型(账户类型): 1 对私, 2 对公
                    "settle_cycle": 1, // 结算方式(结算周期): 1 实时, 2 月结, 3 季度结
                    "settle_base_amt": 3000000, // 起结金额, 单位: 分
                    "fee": 1.5, // 手续费, 单位: 百分比
                }, // 渠道账户信息
                "product": [{
                    "userid": 123, // 渠道编号
                    "product_id": 123, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 0, // 开通状态: 0 已开通, 1 未开通
                }, {
                    "userid": 133, // 渠道编号
                    "product_id": 133, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 1, // 开通状态: 0 已开通, 1 未开通
                }]
            }, {
                "base": {
                    "userid": 2344, // 渠道编号
                    "status": 0, // 渠道状态: 0 启用, 1 禁用
                    "join_dtm": "2016-01-01 12:22:23", // 注册时间
                    "email": "chen@qfpay.com", // 注册邮箱
                    "type": 1, // 渠道类型: 1 白牌, 2 联名
                    "slsm_uid": 123, // 所属业务员ID

                    "name": "四川渠道01", // 渠道名称
                    "short_name": "川01", // 渠道简称
                    "legal_name": "王二", // 法人姓名
                    "legal_idnumber": "511325197001013333", // 法人省份证号码
                    "province": "四川省", // 所在省份
                    "city": "成都市", // 所在城市
                    "address": "华阳", // 商户地址
                    "business_name": "李二", // 业务联系人姓名
                    "business_mobile": "13012340000", // 业务联系人手机号
                    "business_email": "lier@qfpay.com", // 业务联系人邮箱
                    "finace_name": "李二", // 财务联系人姓名
                    "finace_mobile": "13012340000", // 财务联系人手机号
                    "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                    "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                    "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                    "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                    "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                }, // 渠道基本信息
                "account": {
                    "userid": 123, // 渠道编号
                    "bankaccount": "623300000", // 收款账户(网点账户号)
                    "bankuser": "张三", // 开户名称(网点开户名)
                    "headbankname": "中国银行", // 银行总行名称
                    "bankname": "朝阳门支行", // 银行开户行名称(网店名称/支行名称)
                    "banktype": 1, // 结算类型(账户类型): 1 对私, 2 对公
                    "settle_cycle": 1, // 结算方式(结算周期): 1 实时, 2 月结, 3 季度结
                    "settle_base_amt": 3000000, // 起结金额, 单位: 分
                    "fee": 1.5, // 手续费, 单位: 百分比
                }, // 渠道账户信息
                "product": [{
                    "userid": 123, // 渠道编号
                    "product_id": 123, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 0, // 开通状态: 0 已开通, 1 未开通
                }, {
                    "userid": 133, // 渠道编号
                    "product_id": 133, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 1, // 开通状态: 0 已开通, 1 未开通
                }]
            }, {
                "base": {
                    "userid": 444, // 渠道编号
                    "status": 0, // 渠道状态: 0 启用, 1 禁用
                    "join_dtm": "2016-01-01 12:22:23", // 注册时间
                    "email": "chen@qfpay.com", // 注册邮箱
                    "type": 1, // 渠道类型: 1 白牌, 2 联名
                    "slsm_uid": 123, // 所属业务员ID

                    "name": "四川渠道01", // 渠道名称
                    "short_name": "川01", // 渠道简称
                    "legal_name": "王二", // 法人姓名
                    "legal_idnumber": "511325197001013333", // 法人省份证号码
                    "province": "四川省", // 所在省份
                    "city": "成都市", // 所在城市
                    "address": "华阳", // 商户地址
                    "business_name": "李二", // 业务联系人姓名
                    "business_mobile": "13012340000", // 业务联系人手机号
                    "business_email": "lier@qfpay.com", // 业务联系人邮箱
                    "finace_name": "李二", // 财务联系人姓名
                    "finace_mobile": "13012340000", // 财务联系人手机号
                    "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                    "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                    "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                    "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                    "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                }, // 渠道基本信息
                "account": {
                    "userid": 123, // 渠道编号
                    "bankaccount": "623300000", // 收款账户(网点账户号)
                    "bankuser": "张三", // 开户名称(网点开户名)
                    "headbankname": "中国银行", // 银行总行名称
                    "bankname": "朝阳门支行", // 银行开户行名称(网店名称/支行名称)
                    "banktype": 1, // 结算类型(账户类型): 1 对私, 2 对公
                    "settle_cycle": 1, // 结算方式(结算周期): 1 实时, 2 月结, 3 季度结
                    "settle_base_amt": 3000000, // 起结金额, 单位: 分
                    "fee": 1.5, // 手续费, 单位: 百分比
                }, // 渠道账户信息
                "product": [{
                    "userid": 123, // 渠道编号
                    "product_id": 123, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 0, // 开通状态: 0 已开通, 1 未开通
                }, {
                    "userid": 133, // 渠道编号
                    "product_id": 133, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 1, // 开通状态: 0 已开通, 1 未开通
                }]
            }, {
                "base": {
                    "userid": 333, // 渠道编号
                    "status": 0, // 渠道状态: 0 启用, 1 禁用
                    "join_dtm": "2016-01-01 12:22:23", // 注册时间
                    "email": "chen@qfpay.com", // 注册邮箱
                    "type": 1, // 渠道类型: 1 白牌, 2 联名
                    "slsm_uid": 123, // 所属业务员ID

                    "name": "四川渠道01", // 渠道名称
                    "short_name": "川01", // 渠道简称
                    "legal_name": "王二", // 法人姓名
                    "legal_idnumber": "511325197001013333", // 法人省份证号码
                    "province": "四川省", // 所在省份
                    "city": "成都市", // 所在城市
                    "address": "华阳", // 商户地址
                    "business_name": "李二", // 业务联系人姓名
                    "business_mobile": "13012340000", // 业务联系人手机号
                    "business_email": "lier@qfpay.com", // 业务联系人邮箱
                    "finace_name": "李二", // 财务联系人姓名
                    "finace_mobile": "13012340000", // 财务联系人手机号
                    "finace_email": "lier@qfpay.com", // 财务联系人邮箱
                    "logo_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业LOGO的URL
                    "icon_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 企业ICON
                    "business_license_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 营业执照
                    "bank_account_url": "https://qudao.qfpay.com/qudao/upload/pic/sdfsd.pic", // 开户许可证
                }, // 渠道基本信息
                "account": {
                    "userid": 123, // 渠道编号
                    "bankaccount": "623300000", // 收款账户(网点账户号)
                    "bankuser": "张三", // 开户名称(网点开户名)
                    "headbankname": "中国银行", // 银行总行名称
                    "bankname": "朝阳门支行", // 银行开户行名称(网店名称/支行名称)
                    "banktype": 1, // 结算类型(账户类型): 1 对私, 2 对公
                    "settle_cycle": 1, // 结算方式(结算周期): 1 实时, 2 月结, 3 季度结
                    "settle_base_amt": 3000000, // 起结金额, 单位: 分
                    "fee": 1.5, // 手续费, 单位: 百分比
                }, // 渠道账户信息
                "product": [{
                    "userid": 123, // 渠道编号
                    "product_id": 123, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 0, // 开通状态: 0 已开通, 1 未开通
                }, {
                    "userid": 133, // 渠道编号
                    "product_id": 133, // 产品编号
                    "name": "会员体系", // 产品名称
                    "intro": "简介", // 产品简介
                    "status": 1, // 开通状态: 0 已开通, 1 未开通
                }], // 渠道增值产品开通信息列表
            }];
            _this.channels_mid = _this.channels;
            _this.pages_all = _this.channels_mid.length;
            _this.channels_now = _this.channels_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
        },
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
.dialog_text {
    display: inline-block;
    width: 100%;
    line-height: 25px;
    text-align: center;
    i {
        font-style: normal;
    }
}
</style>
