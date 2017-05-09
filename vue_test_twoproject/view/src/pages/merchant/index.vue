<template>
    <div>
        <div class="right_head">
            商户信息列表
        </div>
        <div class="right_body">
            <el-form label-width="100px" class="demo-ruleForm" :model="searchkey" :rules="searchkey_rule" ref="searchkey">
                <el-row :gutter="10">
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="渠道编号：" prop="id">
                            <el-input v-model.trim="searchkey.id"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="渠道名称：" prop="name">
                            <el-input v-model.trim="searchkey.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="7">
                        <el-form-item label="时间区间：">
                            <el-date-picker v-model="searchkey.daterange" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions" :editable="false" @change="time_change">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="5">
                        <el-form-item label="商户编号：" prop="userid">
                            <el-input v-model.trim="searchkey.userid"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="商户名称：" prop="shopname">
                            <el-input v-model.trim="searchkey.shopname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="手机号：" prop="mobile">
                            <el-input v-model.trim="searchkey.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="所属业务员：" prop="slsm_name">
                            <el-input v-model.trim="searchkey.slsm_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label-width="0" class="t_c">
                            <!-- <el-button type="default" @click="fresh_sub">刷新</el-button> -->
                            <el-button type="primary" @click="search_sub">查询</el-button>
                            <el-button type="default" @click="download_sub">商户信息下载</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template>
                <el-table :data="merchants_now" border stripe style="width: 100%">
                    <el-table-column prop="qd_info.base.userid" label="渠道编号" resizable min-width="80px">
                    </el-table-column>
                    <el-table-column prop="qd_info.base.name" label="渠道名称" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="userid" label="商户编号" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="shopname" label="商户名称" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column label="商户费率" resizable min-width="100px">
                        <template scope="scope">
                            <el-popover trigger="click" placement="bottom-end" popper-class="popover_new">
                                <p class="title">商户费率明细</p>
                                <ul>
                                    <li>微信费率：<span class="orange">{{middle_fee.wechat_fee | percent_f }}</span></li>
                                    <li>支付宝费率：<span class="orange">{{middle_fee.alipay_fee | percent_f }}</span></li>
                                    <li>京东费率：<span class="orange">{{middle_fee.jd_fee | percent_f }}</span></li>
                                    <li>QQ钱包费率：<span class="orange">{{middle_fee.qqwallet_fee | percent_f }}</span></li>
                                    <li>刷卡费率：<span class="orange">{{middle_fee.swipecard_fee | percent_f }}</span></li>
                                </ul>
                                <span slot="reference" class="hover_color" @click="middle_fee=scope.row.fee_ratios">点击查看</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="法人名称" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="mobile" label="电话" resizable min-width="130px">
                    </el-table-column>
                    <el-table-column prop="jointime" label="注册时间" resizable min-width="170px">
                    </el-table-column>
                    <el-table-column prop="audit_status" label="审核状态" resizable min-width="100px">
                        <!-- <template scope="scope">
                            <span v-if="scope.row.audit_status==2">失败</span>
                            <span v-if="scope.row.audit_status==1">成功</span>
                            <span v-if="scope.row.audit_status==0">拒绝</span>
                            <span v-else>审核中</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="audit_memo" label="失败原因" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="status" label="商户状态" resizable min-width="100px">
                        <template scope="scope">
                            <span v-if="scope.row.status">注销</span>
                            <span v-else>正常</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="slsm_name" label="所属业务员" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column label="操作" resizable min-width="100px">
                        <template scope="scope">
                            <template v-if="scope.row.status">
                                <el-button type="info" @click="open_chan(scope.row.userid)">启用</el-button>
                            </template>
                            <template v-else>
                                <el-button type="warning" @click="stop_chan(scope.row.userid)">注销</el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div class="block t_r mar_t20">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page_now" :page-sizes="[20,50,100,200,250]" :page-size="page_per" layout="total, sizes, prev, pager, next" :total="pages_all">
                </el-pagination>
            </div>
        </div>
        <load :visible="loading"></load>
        <toast :msg="toastmsg" :visible="visible_toast" @on-visible-change="onVisibleChange" @on-msg-change="onMsgChange"></toast>
        <!-- 取消使用elementUI弹框样式 -->
        <!-- <el-dialog v-model="opratedialog" size="tiny">
            <span class="dialog_text">
                您确认要<i class="orange" v-if="oprate_if">开启</i><i class="orange" v-else>注销</i>该商户？
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="opratedialog = false">取 消</el-button>
                <el-button type="primary" @click="mend_chan">确 定</el-button>
            </span>
        </el-dialog> -->
        <bounced :visible="opratedialog">
            <p class="bounced_text">
                您确认要<i class="orange" v-if="oprate_if">开启</i><i class="orange" v-else>注销</i>该商户？
            </p>
            <p slot="footer">
                <span class="bounced_button bounced_sure" @click="mend_chan">确认</span>
                <span class="bounced_button bounced_cancle" @click="opratedialog = false">取消</span>
            </p>
        </bounced>
    </div>
</template>
<script>
export default {
    name: 'merchant_index',
    data() {
        return {
            opratedialog: false, //开启、停用弹框是否开启
            oprate_if: true, //true代表开启，false代表停用
            oprate_data: '', //弹框需要传入的代码
            loading: false, //load是否显示
            bounced_show: true, //弹框是否显示
            toastmsg: '', //toast提示文字
            visible_toast: false, //toast是否显示
            searchkey: {
                id: '',
                name: '',
                userid: '',
                shopname: '',
                mobile: '',
                stime: '',
                etime: '',
                daterange: '',
                slsm_name: '',
            },
            merchants: [],
            list_url: location.protocol + '//' + location.host + '/qudao/v1/api/mchnt/list', //获取商户列表  
            down_url: location.protocol + '//' + location.host + '/qudao/v1/api/mchnt/list/download', //下载   
            chan_url: location.protocol + '//' + location.host + '/qudao/v1/api/mchnt/', // 注销            
            pages_all: 0, //总信息数
            page_per: 20, //每页信息数
            page_now: 1, //当前页数
            pages: 1, //总页数
            merchants_mid: [], //搜索后的总信息
            merchants_now: [], //当前展示信息
            middle_fee: {
                "wechat_fee": '',
                "alipay_fee": '',
                "jd_fee": '',
                "qqwallet_fee": '',
                "swipecard_fee": '',
            }, //商户费率-中转参数，scope不能直接识别2级信息scope.row.fee_ratios.wechat_fee
            pickerOptions: {
                disabledDate: (time) => time.getTime() > Date.now(),
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            searchkey_rule: {
                id: [{
                    required: false,
                    pattern: /^[0-9\s]{0,300}$/,
                    message: '请输入渠道编号，只能包含数字',
                    trigger: 'blur'
                }],
                name: [{
                    required: false,
                    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9\s]{1,20}$/,
                    message: '请输入渠道名称，长度在 1 到 20 个字符',
                    trigger: 'blur'
                }],
                userid: [{
                    required: false,
                    pattern: /^[0-9\s]{0,300}$/,
                    message: '请输入商户编号，只能包含数字',
                    trigger: 'blur'
                }],
                shopname: [{
                    required: false,
                    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9\s]{1,20}$/,
                    message: '请输入商户名称，长度在 1 到 20 个字符',
                    trigger: 'blur'
                }],
                mobile: [{
                    required: false,
                    pattern: /^1[0-9]{10}$/,
                    message: '请填写正确的手机号',
                    trigger: 'blur'
                }],
                slsm_name: [{
                    required: false,
                    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9\s]{1,20}$/,
                    message: '请输入所属业务员，长度在 1 到 20 个字符',
                    trigger: 'blur'
                }],
            },
        }
    },
    created: function() {
        this.get_list(); //获取商户列表 
    },
    watch: {
        // merchants_mid: function(val, oldVal) {
        //     var _this = this;
        //     _this.pages_all = _this.merchants_mid.length;
        //     _this.page_now = 1;
        //     _this.merchants_now = _this.merchants_mid.slice(0, _this.page_now * _this.page_per);
        // },
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
        //获取商户列表
        get_list: function() {
            let _this = this;
            let post_data = {
                'page': _this.page_now,
                'page_size': _this.page_per,
                'mchnt_uid': _this.searchkey.userid.replace(/\s/g, ''),
                'mchnt_name': _this.searchkey.shopname.replace(/\s/g, ''),
                'mchnt_mobile': _this.searchkey.mobile.replace(/\s/g, ''),
                'mchnt_s_join_dtm': _this.searchkey.stime,
                'mchnt_e_join_dtm': _this.searchkey.etime,
                'qd_uid': _this.searchkey.id.replace(/\s/g, ''),
                'qd_name': _this.searchkey.name.replace(/\s/g, ''),
                'slsm_name': _this.searchkey.slsm_name.replace(/\s/g, ''),
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
                        // _this.merchants = data_return.data;
                        // _this.merchants_mid = _this.merchants;
                        // _this.pages_all = _this.merchants_mid.length;
                        // _this.merchants_now = _this.merchants_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
                        _this.pages_all = data_return.data.mchnt_cnt;
                        _this.merchants_now = data_return.data.mchnt_infos;
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
            //列表测试数据--仅供测试
            //_this.getdata_test();
        },
        //时间变化
        time_change(val) {
            if (val.length == 0) {
                this.searchkey.stime = '';
                this.searchkey.etime = '';
            } else {
                let timerange = val.split(' - ');
                this.searchkey.stime = timerange[0] + ' 00:00:00';
                this.searchkey.etime = timerange[1] + ' 23:59:59';
            }
        },
        //提交查询
        search_sub: function() {
            // var _this = this;
            // _this.merchants_mid = [];
            // var key_id = this.searchkey.id;
            // var key_name = this.searchkey.name;
            // var key_userid = this.searchkey.userid;
            // var key_shopname = this.searchkey.shopname;
            // var key_mobile = this.searchkey.mobile;
            // var key_date = this.searchkey.daterange;
            // console.log(this.searchkey);
            // var key_stime = 0,
            //     key_etime = new Date().getTime();
            // if (key_date[0]) {
            //     var k_stime = _this.get_date(key_date[0]) + ' 00:00:00';
            //     var k_etime = _this.get_date(key_date[1]) + ' 23:59:59';
            //     key_stime = new Date(k_stime).getTime();
            //     key_etime = new Date(k_etime).getTime();
            // }
            // for (let i = 0; i < _this.merchants.length; i++) {
            //     let id = _this.merchants[i].qd_info.base.userid.toString();
            //     let name = _this.merchants[i].qd_info.base.name;
            //     let userid = _this.merchants[i].userid.toString();
            //     let shopname = _this.merchants[i].shopname;
            //     let mobile = _this.merchants[i].mobile;
            //     let jointime = new Date(_this.merchants[i].jointime).getTime();
            //     if (id.indexOf(key_id) != '-1' && name.indexOf(key_name) != '-1' && userid.indexOf(key_userid) != '-1' && shopname.indexOf(key_shopname) != '-1' && mobile.indexOf(key_mobile) != '-1' && key_etime >= jointime && jointime >= key_stime) {
            //         _this.merchants_mid.push(_this.merchants[i]);
            //     }
            // }
            // return _this.merchants_mid;
            this.$refs.searchkey.validate((valid) => {
                if (valid) {
                    this.get_list();
                } else {
                    return false;
                }
            });
            // this.get_list();
        },
        //下载
        download_sub: function() {
            this.$refs.searchkey.validate((valid) => {
                if (valid) {
                    let _this = this;
                    let post_data = {
                        'mchnt_uid': _this.searchkey.userid.replace(/\s/g, ''),
                        'mchnt_name': _this.searchkey.shopname.replace(/\s/g, ''),
                        'mchnt_mobile': _this.searchkey.mobile.replace(/\s/g, ''),
                        'mchnt_s_join_dtm': _this.searchkey.stime,
                        'mchnt_e_join_dtm': _this.searchkey.etime,
                        'qd_uid': _this.searchkey.id.replace(/\s/g, ''),
                        'qd_name': _this.searchkey.name.replace(/\s/g, ''),
                        'slsm_name': _this.searchkey.slsm_name.replace(/\s/g, ''),
                    };
                    let url = this.down_url + '?';
                    let data;
                    for (data in post_data) {
                        url += data + '=' + post_data[data] + '&';
                    }
                    url = url.substr(0, url.length - 1);
                    window.open(url);
                } else {
                    return false;
                }
            });
        },
        get_date: function(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return year + '/' + month + '/' + day;
        },
        handleSizeChange(val) {
            let _this = this;
            //console.log(`每页 ${val} 条`);
            _this.page_per = val;
            _this.page_now = 1;
            // _this.merchants_now = _this.merchants_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
            this.get_list();
        },
        handleCurrentChange(val) {
            //console.log(`当前页: ${val}`);
            let _this = this;
            _this.page_now = val;
            // _this.merchants_now = _this.merchants_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
            this.get_list();
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
            let userid = _this.oprate_data;
            let status;
            _this.opratedialog = false; //关闭弹框
            if (_this.oprate_if) {
                status = 0; //需要开启该状态
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
                        _this.get_list();
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
        //清空并刷新--更改成ajax提交，取消使用
        fresh_sub: function() {
            var _this = this;
            _this.searchkey = {
                id: '',
                name: '',
                userid: '',
                shopname: '',
                mobile: '',
                stime: '',
                etime: '',
                daterange: '',
            }; //清空搜索内容
            _this.page_now = 1; //页数回到第一页
            _this.get_list(); //获取最新列表
        },
        //列表测试数据--仅供测试
        getdata_test() {
            let _this = this;
            _this.merchants_now = [{
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 45556, // 商户编号
                "shopname": "百度超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道02", // 渠道名称
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
                    }
                }, // 业务员基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 23343456, // 商户编号
                "shopname": "百度", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道03", // 渠道名称
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 2266456, // 商户编号
                "shopname": "阿里", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12345, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 8456, // 商户编号
                "shopname": "发发", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12322, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 345699, // 商户编号
                "shopname": "超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 45556, // 商户编号
                "shopname": "百度超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道02", // 渠道名称
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
                    }
                }, // 业务员基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 23343456, // 商户编号
                "shopname": "百度", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道03", // 渠道名称
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 2266456, // 商户编号
                "shopname": "阿里", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12345, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 8456, // 商户编号
                "shopname": "发发", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12322, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 345699, // 商户编号
                "shopname": "超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 45556, // 商户编号
                "shopname": "百度超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道02", // 渠道名称
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
                    }
                }, // 业务员基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 23343456, // 商户编号
                "shopname": "百度", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道03", // 渠道名称
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 2266456, // 商户编号
                "shopname": "阿里", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12345, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 8456, // 商户编号
                "shopname": "发发", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12322, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 345699, // 商户编号
                "shopname": "超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 45556, // 商户编号
                "shopname": "百度超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道02", // 渠道名称
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
                    }
                }, // 业务员基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 23343456, // 商户编号
                "shopname": "百度", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 123, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
                        "email": "chen@qfpay.com", // 注册邮箱
                        "type": 1, // 渠道类型: 1 白牌, 2 联名
                        "slsm_uid": 123, // 所属业务员ID

                        "name": "四川渠道03", // 渠道名称
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 2266456, // 商户编号
                "shopname": "阿里", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 0, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12345, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 8456, // 商户编号
                "shopname": "发发", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }, {
                "qd_info": {
                    "base": {
                        "userid": 12322, // 渠道编号
                        "status": 0, // 渠道状态: 0 启用, 1 禁用
                        "join_dtm": "2016-01-01 12:22:23", // 注册时间
                        "mobile": "13072842233", // 注册手机号(登录名)
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
                    }
                }, // 渠道基本信息
                "slsm_info": {}, // 业务员基本信息
                "userid": 345699, // 商户编号
                "shopname": "超市", // 商户名称
                "name": "张三", // 法人名称
                "mobile": "13012341111", // 商户手机号码
                "status": 1, // 商户状态
                "jointime": "2016-01-01 12:22:23", // 注册时间
                "fee_ratios": { // 费率
                    "wechat_fee": 12,
                    "alipay_fee": 34,
                    "jd_fee": 56,
                    "qqwallet_fee": 78,
                    "swipecard_fee": 90,
                }, //商户费率
            }];
            // _this.merchants_mid = _this.merchants;
            // _this.pages_all = _this.merchants_mid.length;
            // _this.merchants_now = _this.merchants_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
        },
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
@import "../../css/common/const";
span.hover_color {
    &:hover {
        color: @orange;
    }
}
</style>
