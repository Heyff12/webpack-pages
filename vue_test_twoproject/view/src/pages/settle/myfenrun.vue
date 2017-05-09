<template>
    <div>
        <div class="right_head">
            我的分润
        </div>
        <div class="right_body time_date_short">
            <el-form label-width="100px" class="demo-ruleForm">
                <el-row :gutter="10">
                    <!-- <el-col :xs="24" :sm="24" :md="12" :lg="5">
                        <el-form-item label="渠道编号：">
                            <el-input v-model.trim="searchkey.mchnt_userid"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="5">
                        <el-form-item label="渠道名称：">
                            <el-input v-model.trim="searchkey.mchnt_name"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="开始时间：">
                            <el-date-picker v-model="searchkey.start_time" type="month" align="right" placeholder="选择开始时间" :picker-options="pickerOptions_s" format="yyyy-MM" @change="start_change" :editable="false" :clearable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="结束时间：">
                            <el-date-picker v-model="searchkey.end_time" type="month" align="right" placeholder="选择结束时间" :picker-options="pickerOptions_e" format="yyyy-MM" popper-class="no_now" :editable="false" :clearable="false">
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
                    <el-table-column prop="qd_uid" label="渠道编号" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="qd_name" label="渠道名称" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="bankuser" label="收款账户" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="bankaccount" label="收款账号" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="bankname" label="收款银行" resizable min-width="180px">
                    </el-table-column>
                    <el-table-column label="交易金额/元" resizable min-width="120px">
                        <template scope="scope">
                            {{scope.row.trade_amt | yuan}}
                        </template>
                    </el-table-column>
                    <el-table-column label="交易手续费/元" resizable min-width="120px">
                        <template scope="scope">
                            {{scope.row.trade_fee | yuan}}
                        </template>
                    </el-table-column>
                    <el-table-column label="成本手续费/元" resizable min-width="120px">
                        <template scope="scope">
                            {{scope.row.cost_fee | yuan}}
                        </template>
                    </el-table-column>
                    <el-table-column label="分润金额/元" resizable min-width="110px">
                        <template scope="scope">
                            {{scope.row.royalty_amt | yuan}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" resizable min-width="100px">
                        <template scope="scope">
                            <el-button type="warning" @click="download(scope.row)">明细下载</el-button>
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
    name: 's_channel',
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
            list_url: location.protocol + '//' + location.host + '/qudao/v1/api/settlement/qd_royalty/me', //获取交易列表      
            down_url: location.protocol + '//' + location.host + '/qudao/v1/api/settlement/qd_royalty/me/download', //下载                  
            pages_all: 0, //总信息数
            pages: 1, //总页数
            page_per: 10, //每页信息数
            page_now: 1, //当前页数
            table_data: [], //当前展示信息
            now_year: new Date().getFullYear(), //当前年份
            now_month: new Date().getMonth() + 1, //当前月份
            last_day: new Date(), //月份最后一天
            start_day: this.get_daystart(), //结束时间可选的第一个月份时间
            pickerOptions_s: {
                disabledDate: (time) => time.getTime() > Date.now()
            },
            pickerOptions_e: {
                disabledDate: (time) => time.getTime() > this.last_day || time.getTime() < this.start_day
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
                // 'qd_uid': _this.searchkey.mchnt_userid,
                // 'qd_name': _this.searchkey.mchnt_name,
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
            this.get_list();
        },
        //开始时间变化事件，计算开始时间月份
        start_change(time) {
            let _this = this;
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            //计算当前选择月份
            let now_day = year + '-' + month + '-' + '01' + ' 00:00:00';
            _this.start_day = new Date(now_day);
        },
        //明细下载
        download(data_val){
            let _this=this;
            let post_data={
                // 'qd_uid': data_val.qd_uid,
                // 'qd_name': data_val.qd_name,
                // 'start_date': _this.get_datetime(_this.searchkey.start_time),
                // 'end_date': _this.get_datetime(_this.searchkey.end_time),
                'start_date': data_val.trade_date,
                'end_date': data_val.trade_date,
            };
            let url = this.down_url + '?';
            let data;
            for (data in post_data) {
                url += data + '=' + post_data[data] + '&';
            }
            url=url.substr(0,url.length-1);
            window.open(url);
        },
        //获取当前年份1月1号的时间--初始赋值使用
        get_daystart: function() {
            let _this = this;
            let d = new Date();
            let year = d.getFullYear();
            // let month = _this.date_long(d.getMonth() + 1);
            // let day = _this.date_long(d.getDate());
            // let dd = year + '/' + month + '/' + day + ' 00:00:00';
            let dd = year + '/' + '01' + '/' + '01';
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
            // return year + '-' + month + '-' + day;
            return year + '-' + month;
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
                "qd_uid": 11111115,
                "qd_name": "渠道名称",
                "bankaccount": "收款账号",
                "bankuser": "收款人",
                "headbankname": "收款行总行",
                "bankname": "开户行名称",
                "trade_amt": 12345, // 交易金额
                "trade_fee": 2345, // 交易手续费
                "cost_fee": 2000, // 成本手续费
                "royalty_amt": 345, // 分润金额
            }, {
                "qudao_uid": 12345, // 渠道 userid
                "qd_uid": 11111118,
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
                "qd_uid": 11111110,
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
