<template>
    <div>
        <div class="right_head">
            商户结算单
        </div>
        <div class="right_body time_date_short">
            <el-form label-width="100px" class="demo-ruleForm" :model="searchkey" :rules="searchkey_rule" ref="searchkey">
                <el-row :gutter="10">
                    <el-col :xs="24" :sm="24" :md="12" :lg="5">
                        <el-form-item label="商户编号：" prop="mchnt_userid">
                            <el-input v-model.trim="searchkey.mchnt_userid"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="5">
                        <el-form-item label="商户名称：" prop="mchnt_name">
                            <el-input v-model.trim="searchkey.mchnt_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="开始时间：">
                            <el-date-picker v-model="searchkey.start_time" type="date" align="right" placeholder="选择开始时间" :picker-options="pickerOptions_s" format="yyyy-MM-dd" @change="start_change" :editable="false" :clearable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="结束时间：">
                            <el-date-picker v-model="searchkey.end_time" type="date" align="right" placeholder="选择结束时间" :picker-options="pickerOptions_e" format="yyyy-MM-dd" popper-class="no_now" :editable="false" :clearable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="2">
                        <el-form-item label-width="0" class="t_c">
                            <el-button type="primary" @click="search_sub_ajax">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template>
                <el-table :data="table_data" border stripe style="width: 100%">
                    <el-table-column prop="trade_date" label="结算日期" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="mchnt_uid" label="商户编号" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="mchnt_name" label="商户名称" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="bankuser" label="收款账户" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="bankaccount" label="收款账号" resizable min-width="180px">
                    </el-table-column>
                    <el-table-column prop="bankname" label="收款银行" resizable min-width="100px">
                    </el-table-column>
                    <!-- <el-table-column label="交易金额/元" resizable min-width="120px">
                        <template scope="scope">
                            {{scope.row.trade_amt | yuan}}
                        </template>
                    </el-table-column>
                    <el-table-column label="手续费/元" resizable min-width="100px">
                        <template scope="scope">
                            {{scope.row.trade_fee | yuan}}
                        </template>
                    </el-table-column> -->
                    <el-table-column label="结算金额/元" resizable min-width="100px">
                        <template scope="scope">
                            {{scope.row.settle_amt | yuan}}
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div class="block t_r mar_t20">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page_now" :page-sizes="[10,20,50,100,200,250]" :page-size="page_per" layout="total, sizes, prev, pager, next" :total="pages_all">
                </el-pagination>
            </div>
        </div>
        <load :visible="loading"></load>
        <toast :msg="toastmsg" :visible="visible_toast" @on-visible-change="onVisibleChange" @on-msg-change="onMsgChange"></toast>
    </div>
</template>
<script>
export default {
    name: 's_merchant',
    data() {
        return {
            loading: false, //load是否显示
            toastmsg: '', //toast提示文字
            visible_toast: false, //toast是否显示
            searchkey: {
                'mchnt_userid': '',
                'mchnt_name': '',
                'start_time': '',
                'end_time': '',
            },
            list_url: location.protocol + '//' + location.host + '/qudao/v1/api/settlement/mchnt_settle/list', //获取交易列表           
            pages_all: 0, //总信息数
            pages: 1, //总页数
            page_per: 10, //每页信息数
            page_now: 1, //当前页数
            table_data: [], //当前展示信息
            now_year: new Date().getFullYear(), //当前年份
            now_month: new Date().getMonth() + 1, //当前月份
            last_day: new Date(), //月份最后一天
            start_day: this.get_daystart(), //结束时间可选的第一天
            pickerOptions_s: {
                disabledDate: (time) => time.getTime() > Date.now()
            },
            pickerOptions_e: {
                disabledDate: (time) => time.getTime() > this.last_day || time.getTime() < this.start_day
            },
            searchkey_rule: {
                mchnt_userid: [{
                    required: false,
                    pattern: /^[0-9\s]{0,300}$/,
                    message: '请输入渠道编号，只能包含数字',
                    trigger: 'blur'
                }],
                mchnt_name: [{
                    required: false,
                    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9\s]{1,20}$/,
                    message: '请输入渠道名称，长度在 1 到 20 个字符',
                    trigger: 'blur'
                }],
            },
        }
    },
    created: function() {
        //设置默认时间
        this.searchkey.start_time = this.get_daystart();
        this.searchkey.end_time = new Date();
        setTimeout(() => {
            this.get_list(); //获取商户列表
        }, 0);
    },
    watch: {

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
            if (_this.searchkey.start_time.getTime() > _this.searchkey.end_time.getTime()) {
                _this.loading = false;
                _this.visible_toast = true;
                _this.toastmsg = '结束时间小于开始时间!';
                return false;
            }
            let post_data = {
                'page': _this.page_now,
                'page_size': _this.page_per,
                'mchnt_uid': _this.searchkey.mchnt_userid.replace(/\s/g,''),
                'mchnt_name': _this.searchkey.mchnt_name.replace(/\s/g,''),
                'start_date': _this.get_datetime(_this.searchkey.start_time),
                'end_date': _this.get_datetime(_this.searchkey.end_time),
            };
            //console.log(post_data);
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
                        _this.pages_all = data_return.data.total_cnt;
                        _this.table_data = data_return.data.records;
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
        //调整每页显示信息数量
        handleSizeChange(val) {
            let _this = this;
            _this.page_per = val;
            _this.page_now = 1;
            this.get_list();
        },
        //更换当前页
        handleCurrentChange(val) {
            let _this = this;
            _this.page_now = val;
            this.get_list();
        },
        //提交查询--后台处理
        search_sub_ajax: function() {
            this.$refs.searchkey.validate((valid) => {
                if (valid) {
                    this.get_list();
                } else {
                    return false;
                }
            });
            // this.get_list();
        },
        //开始时间变化事件，计算开始时间 月份的最后一天
        start_change(time) {
            let _this = this;
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            //结束时间--年月日
            let end_t = this.searchkey.end_time;
            let end_t_y = new Date(end_t).getFullYear();
            let end_t_m = new Date(end_t).getMonth() + 1;
            let end_t_d = new Date(end_t).getDate();
            //计算当天天的前一天
            let day = date.getDate();
            let now_day = year + '-' + month + '-' + day + ' 00:00:00';
            //let now_day = year + '-' + month + '-' + day;
            _this.start_day = new Date(now_day);
            //计算当前月的最后一天 
            //如果与当前结束日期的年月相同，且小于当前结束日期的day值，则不再重新计算新的结束日期
            if (year == end_t_y && month == end_t_m && day <= end_t_d) {
                return false;
            }
            let nextmonth, lastday, new_month, new_year;
            if (month < 12) {
                new_month = month + 1;
                nextmonth = year + '-' + new_month + '-' + '01 00:00:00';
            } else {
                new_year = year + 1;
                nextmonth = new_year + '-' + '01-01 00:00:00';
            }
            lastday = new Date(new Date(nextmonth).getTime() - 1);
            if (year !== _this.now_year || month !== _this.now_month) {
                _this.last_day = lastday;
                _this.searchkey.end_time = lastday;
            } else {
                _this.last_day = new Date();
                _this.searchkey.end_time = new Date();
            }
        },
        //获取当月第一天的时间--初始赋值使用
        get_daystart: function() {
            let _this = this;
            let d = new Date();
            let year = d.getFullYear();
            let month = _this.date_long(d.getMonth() + 1);
            //let day = _this.date_long(d.getDate());
            // let dd = year + '/' + month + '/' + day + ' 00:00:00';
            let dd = year + '/' + month + '/' + '01';
            return new Date(dd);
        },
        //获取年月日时分秒，时间格式化--在进行ajax提交时做时间格式转化
        get_datetime: function(d) {
            let _this = this;
            let date = new Date(d);
            let year = date.getFullYear();
            let month = _this.date_long(date.getMonth() + 1);
            let day = _this.date_long(date.getDate());
            let hour = _this.date_long(date.getHours());
            let min = _this.date_long(date.getMinutes());
            let sec = _this.date_long(date.getSeconds());
            //return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
            return year + '-' + month + '-' + day;
        },
        //处理1位01
        date_long: function(n) {
            if (n < 10) {
                return '0' + n;
            } else {
                return n;
            }
        },
        //列表测试数据--仅供测试
        getdata_test() {
            let _this = this;
            _this.trades = [{
                "trade_date": "2017-03-01", // 交易日期
                "mchnt_uid": 11111115,
                "mchnt_name": "商户名称",
                "bankaccount": "收款账号",
                "bankuser": "收款人",
                "headbankname": "收款行总行",
                "bankname": "开户行名称",
                "trade_amt": 12345, // 交易金额
                "trade_fee": 2345, // 交易手续费
                "settle_amt": 10000, // 结算金额
            }, {
                "qudao_uid": 12345, // 渠道 userid
                "qudao_name": "渠道名", // 渠道名
                "mchnt_uid": 12346, // 商户 userid
                "mchnt_name": "商户名", // 商户名
                "trade_syssn": "20170227123456", // 交易流水号
                "trade_amt": 100, // 交易金额, 单位为分
                "trade_fee": 100, // 手续费, 单位分
                "trade_dtm": "2017-02-27", // 交易时间
                "trade_type": "微信", // 交易类型
                "trade_status": "成功", // 交易状态
                "trade_msg": "交易失败", // 交易失败原因
                "mchnt_mobile": "15896584456", // 手机号
            }, {
                "qudao_uid": 1255345, // 渠道 userid
                "qudao_name": "渠rtrt道名", // 渠道名
                "mchnt_uid": 1233346, // 商户 userid
                "mchnt_name": "商fghg户名", // 商户名
                "trade_syssn": "20144470227123456", // 交易流水号
                "trade_amt": 500, // 交易金额, 单位为分
                "trade_fee": 100, // 手续费, 单位分
                "trade_dtm": "2017-01-27", // 交易时间
                "trade_type": "微信", // 交易类型
                "trade_status": "失败", // 交易状态
                "trade_msg": "交易失败", // 交易失败原因
                "mchnt_mobile": "15892333456", // 手机号
            }, {
                "qudao_uid": 442345, // 渠道 userid
                "qudao_name": "渠道54名", // 渠道名
                "mchnt_uid": 12346, // 商户 userid
                "mchnt_name": "商户名", // 商户名
                "trade_syssn": "20170227123456", // 交易流水号
                "trade_amt": 100, // 交易金额, 单位为分
                "trade_fee": 100, // 手续费, 单位分
                "trade_dtm": "2017-02-02", // 交易时间
                "trade_type": "微信", // 交易类型
                "trade_status": "成功", // 交易状态
                "trade_msg": "交易失败", // 交易失败原因
                "mchnt_mobile": "15000084456", // 手机号
            }, {
                "qudao_uid": 1200345, // 渠道 userid
                "qudao_name": "渠r456t道名", // 渠道名
                "mchnt_uid": 12344446, // 商户 userid
                "mchnt_name": "商fghg户名", // 商户名
                "trade_syssn": "20144470227123456", // 交易流水号
                "trade_amt": 500, // 交易金额, 单位为分
                "trade_fee": 100, // 手续费, 单位分
                "trade_dtm": "2016-11-27", // 交易时间
                "trade_type": "微信", // 交易类型
                "trade_status": "失败", // 交易状态
                "trade_msg": "交易失败", // 交易失败原因
                "mchnt_mobile": "15896589009", // 手机号
            }, {
                "qudao_uid": 442345, // 渠道 userid
                "qudao_name": "渠道54名", // 渠道名
                "mchnt_uid": 12346, // 商户 userid
                "mchnt_name": "商户名", // 商户名
                "trade_syssn": "20170227123456", // 交易流水号
                "trade_amt": 100, // 交易金额, 单位为分
                "trade_fee": 100, // 手续费, 单位分
                "trade_dtm": "2017-02-02", // 交易时间
                "trade_type": "微信", // 交易类型
                "trade_status": "成功", // 交易状态
                "trade_msg": "交易失败", // 交易失败原因
                "mchnt_mobile": "15896582233", // 手机号
            }, {
                "qudao_uid": 1200345, // 渠道 userid
                "qudao_name": "渠r456t道名", // 渠道名
                "mchnt_uid": 12344446, // 商户 userid
                "mchnt_name": "商fghg户名", // 商户名
                "trade_syssn": "20144470227123456", // 交易流水号
                "trade_amt": 500, // 交易金额, 单位为分
                "trade_fee": 100, // 手续费, 单位分
                "trade_dtm": "2016-11-27", // 交易时间
                "trade_type": "微信", // 交易类型
                "trade_status": "失败", // 交易状态
                "trade_msg": "交易失败", // 交易失败原因
                "mchnt_mobile": "15896580077", // 手机号
            }, {
                "qudao_uid": 442345, // 渠道 userid
                "qudao_name": "渠道54名", // 渠道名
                "mchnt_uid": 12346, // 商户 userid
                "mchnt_name": "商户名", // 商户名
                "trade_syssn": "20170227123456", // 交易流水号
                "trade_amt": 100, // 交易金额, 单位为分
                "trade_fee": 100, // 手续费, 单位分
                "trade_dtm": "2017-02-02", // 交易时间
                "trade_type": "微信", // 交易类型
                "trade_status": "成功", // 交易状态
                "trade_msg": "交易失败", // 交易失败原因
                "mchnt_mobile": "15893702456", // 手机号
            }, {
                "qudao_uid": 1200345, // 渠道 userid
                "qudao_name": "渠r456t道名", // 渠道名
                "mchnt_uid": 12344446, // 商户 userid
                "mchnt_name": "商fghg户名", // 商户名
                "trade_syssn": "20144470227123456", // 交易流水号
                "trade_amt": 500, // 交易金额, 单位为分
                "trade_fee": 100, // 手续费, 单位分
                "trade_dtm": "2016-11-27", // 交易时间
                "trade_type": "微信", // 交易类型
                "trade_status": "失败", // 交易状态
                "trade_msg": "交易失败", // 交易失败原因
                "mchnt_mobile": "15893456456", // 手机号
            }];
            _this.table_data = _this.trades;
            _this.pages_all = 100;
        },
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
</style>
