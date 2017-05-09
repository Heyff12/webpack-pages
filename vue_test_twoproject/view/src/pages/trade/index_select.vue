<template>
    <div>
        <div class="right_head">
            交易管理
        </div>
        <div class="right_body">
            <el-form label-width="110px" class="demo-ruleForm">
                <el-row :gutter="30">
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="商户名称：">
                            <el-input v-model="searchkey.mchnt_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="手机号：">
                            <el-input v-model="searchkey.mchnt_mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="交易流水号：">
                            <el-input v-model="searchkey.trade_syssn"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="支付状态：">
                            <el-select v-model="searchkey.trade_status" placeholder="请选择支付状态">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="成功" value="成功"></el-option>
                                <el-option label="失败" value="失败"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12">
                        <el-form-item label="时间区间：">
                            <el-date-picker v-model="searchkey.daterange" type="datetimerange" align="right" placeholder="选择日期范围">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="开始时间：">
                            <el-date-picker v-model="searchkey.trade_start_time" type="datetime" align="right" placeholder="选择日期范围" :picker-options="pickerOptions_s" format="yyyy-MM-dd HH:mm:ss" @change="start_change">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="结束时间：">
                            <el-date-picker v-model="searchkey.trade_end_time" type="datetime" align="right" placeholder="选择日期范围" :picker-options="pickerOptions_e" format="yyyy-MM-dd HH:mm:ss" @change="">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label-width="0" class="t_c">
                            <el-button type="default" @click="download_sub">交易流水下载</el-button>
                            <el-button type="primary" @click="search_sub_ajax">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template>
                <el-table :data="trade_now" border stripe style="width: 100%">
                    <el-table-column prop="mchnt_uid" label="商户编号" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="mchnt_name" label="商户名称" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="mchnt_mobile" label="手机号" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="trade_syssn" label="交易流水号" resizable min-width="180px">
                    </el-table-column>
                    <el-table-column prop="trade_amt" label="交易金额" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="trade_fee" label="手续费" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="trade_dtm" label="交易时间" resizable min-width="170px">
                    </el-table-column>
                    <el-table-column prop="trade_type" label="交易类型" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="trade_status" label="交易状态" resizablemin-width="100px">
                    </el-table-column>
                    <el-table-column label="操作" resizable min-width="100px">
                        <template scope="scope">
                            <el-button type="info" @click="scan_detail">明细</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div class="block t_r mar_t20">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page_now" :page-sizes="[1,2,4,20,50,100,200,250]" :page-size="page_per" layout="total, sizes, prev, pager, next" :total="pages_all">
                </el-pagination>
            </div>
        </div>
        <load :visible="loading"></load>
        <toast :msg="toastmsg" :visible="visible_toast" @on-visible-change="onVisibleChange" @on-msg-change="onMsgChange"></toast>
    </div>
</template>
<script>
import load from '../../components/load'
import toast from '../../components/toast'

export default {
    name: 'merchant_index',
    components: {
        load,
        toast,
    },
    data() {
        return {
            loading: false, //load是否显示
            toastmsg: '', //toast提示文字
            visible_toast: false, //toast是否显示
            searchkey: {
                'mchnt_name': '',
                'mchnt_mobile': '',
                'trade_syssn': '',
                'trade_status': '',
                'daterange': '',
                'trade_start_time': '',
                'trade_end_time': '',
            },
            trades: [],
            list_url: location.protocol + '//' + location.host + '/qudao/v1/api/trade/list', //获取交易列表            
            pages_all: 0, //总信息数
            pages: 1, //总页数
            page_per: 20, //每页信息数
            page_now: 1, //当前页数
            trade_mid: [], //搜索后的总信息
            trade_now: [], //当前展示信息
            pickerOptions_s: {
                disabledDate: (time) =>  time.getTime() > Date.now() - 8.64e7
            },
            pickerOptions_e: {
                disabledDate: (time) =>  time.getTime() > this.last_day 
            },
        }
    },
    created: function() {
        //设置默认时间
        this.searchkey.daterange = [this.get_daystart(), new Date()];
        this.searchkey.trade_start_time = this.get_daystart();
        this.searchkey.trade_end_time = new Date();
        setTimeout(() => {
            this.get_list(); //获取商户列表
        }, 0);
    },
    watch: {
        trade_mid: function(val, oldVal) {
            var _this = this;
            //_this.pages_all = _this.trade_mid.length;
            _this.page_now = 1;
            _this.trade_now = _this.trade_mid.slice(0, _this.page_now * _this.page_per);
        },
    },
    methods: {
        //计算开始时间 月份的最后一天
        start_change(time) {
            let _this = this;
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let nextmonth, sec;
            if (month < 12) {
                month++;
                nextmonth = year + '-' + month + '-' + '01 00:00:00';
            } else {
                year++;
                nextmonth = year + '-' + '01-01 00:00:00';
            }
            sec = new Date(new Date(nextmonth).getTime() - 1);
            console.log(sec);
            _this.last_day = sec;
            _this.searchkey.trade_end_time = sec;
        },
        last_day(){
            return this.last_day;
        },
        start_day(){
            return new Date(this.searchkey.trade_start_time);
        },
        //监听toast是否可见的值得变化
        onVisibleChange(val) {
            this.visible_toast = val; //④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        },
        //监听toast内容的值得变化
        onMsgChange(val) {
            this.toastmsg = val; //④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        },
        handleSizeChange(val) {
            let _this = this;
            //console.log(`每页 ${val} 条`);
            _this.page_per = val;
            _this.page_now = 1;
            _this.trade_now = _this.trade_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
        },
        handleCurrentChange(val) {
            //console.log(`当前页: ${val}`);
            let _this = this;
            _this.page_now = val;
            _this.trade_now = _this.trade_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
        },
        //获取商户列表
        get_list: function() {
            let _this = this;
            let post_data = {
                'page': _this.page_now,
                'page_size': _this.page_per,
                'mchnt_name': _this.searchkey.mchnt_name,
                'mchnt_mobile': _this.searchkey.mchnt_mobile,
                'trade_syssn': _this.searchkey.trade_syssn,
                'trade_status': _this.searchkey.trade_status,
                'trade_start_time': _this.get_datetime(_this.searchkey.daterange[0]),
                'trade_end_time': _this.get_datetime(_this.searchkey.daterange[1]),
            };
            // _this.searchkey.trade_start_time = _this.get_datetime(_this.searchkey.daterange[0]);
            // _this.searchkey.trade_end_time = _this.get_datetime(_this.searchkey.daterange[1]);
            // let post_data = _this.searchkey;
            // post_data.page = _this.page_now;
            // post_data.page_size = _this.page_per;
            console.log(post_data);
            // this.$http.get(this.list_url, {
            //         'params': post_data,
            //         before: function() {
            //             _this.loading = true;
            //         }
            //     })
            //     .then(function(response) {
            //         _this.loading = false;
            //         let data_return = response.body;
            //         if (data_return.respcd == '0000') {
            //             _this.pages_all = data_return.data.trade_cnt;
            //             _this.trades = data_return.data.trade;
            //             _this.trade_mid = _this.trades;
            //             _this.trade_now = _this.trade_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
            //         } else {
            //             if (data_return.respmsg) {
            //                 _this.toastmsg = data_return.respmsg;
            //             } else {
            //                 _this.toastmsg = data_return.resperr;
            //             }
            //             _this.visible_toast = true;
            //         }
            //     }, function(response) {
            //         _this.loading = false;
            //         _this.visible_toast = true;
            //         _this.toastmsg = '网络超时!';
            //     })
            //     .catch(function(response) {
            //         _this.loading = false;
            //     }); 
            //列表测试数据--仅供测试
            _this.getdata_test();
        },
        //提交查询--后台处理
        search_sub_ajax: function() {
            let _this = this;
            let if_month = _this.if_onemonth(_this.searchkey.daterange[0], _this.searchkey.daterange[1]);
            if (!if_month) {
                _this.loading = false;
                _this.visible_toast = true;
                _this.toastmsg = '时间区间不能跨月!';
                return false;
            }
            _this.get_list();
        },
        //下载
        download_sub: function() {

        },
        //查看明细
        scan_detail: function() {

        },
        //获取年月日时分秒
        get_datetime: function(d) {
            let _this = this;
            let date = new Date(d);
            let year = date.getFullYear();
            let month = _this.date_long(date.getMonth() + 1);
            let day = _this.date_long(date.getDate());
            let hour = _this.date_long(date.getHours());
            let min = _this.date_long(date.getMinutes());
            let sec = _this.date_long(date.getSeconds());
            return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
        },
        //判断是否属于同一个月份
        if_onemonth: function(d_s, d_e) {
            let date_s = new Date(d_s);
            let date_s_year = date_s.getFullYear();
            let date_s_mon = date_s.getMonth() + 1;
            let date_e = new Date(d_e);
            let date_e_year = date_e.getFullYear();
            let date_e_mon = date_e.getMonth() + 1;
            if (date_s_year != date_e_year || date_s_mon != date_e_mon) {
                return false;
            } else {
                return true;
            }
        },
        //处理1位01
        date_long: function(n) {
            if (n < 10) {
                return '0' + n;
            } else {
                return n;
            }
        },
        //获取当天0点的时间
        get_daystart: function() {
            let _this = this;
            let d = new Date();
            let year = d.getFullYear();
            let month = _this.date_long(d.getMonth() + 1);
            let day = _this.date_long(d.getDate());
            let dd = year + '/' + month + '/' + day + ' 00:00:00';
            return new Date(dd);
        },
        //提交查询--本次不用前端进行搜索
        search_sub: function() {
            let _this = this;
            _this.trade_mid = [];
            let key_name = this.searchkey.mchnt_name;
            let key_mobile = this.searchkey.mchnt_mobile;
            let key_syssn = this.searchkey.trade_syssn;
            let key_status = this.searchkey.trade_status;
            var key_date = this.searchkey.daterange;
            var key_stime = 0,
                key_etime = new Date().getTime();
            if (key_date[0]) {
                var k_stime = _this.get_date(key_date[0]) + ' 00:00:00';
                var k_etime = _this.get_date(key_date[1]) + ' 23:59:59';
                key_stime = new Date(k_stime).getTime();
                key_etime = new Date(k_etime).getTime();
            }
            // let key_date_s = this.searchkey.trade_start_time;
            // let key_date_e = this.searchkey.trade_end_time;
            // let key_stime = 0,
            //     key_etime = new Date().getTime();
            // if (key_date_s && key_date_e) {
            //     key_stime = key_date_s.getTime();
            //     key_etime = key_date_e.getTime();
            // }
            for (let i = 0; i < _this.trades.length; i++) {
                let name = _this.trades[i].mchnt_name;
                let mobile = _this.trades[i].mchnt_mobile;
                let syssn = _this.trades[i].trade_syssn;
                let status = _this.trades[i].trade_status;
                let jointime = new Date(_this.trades[i].trade_dtm).getTime();
                if (name.indexOf(key_name) != '-1' && mobile.indexOf(key_mobile) != '-1' && syssn.indexOf(key_syssn) != '-1' && status.indexOf(key_status) != '-1' && key_etime >= jointime && jointime >= key_stime) {
                    _this.trade_mid.push(_this.trades[i]);
                }
            }
            return _this.trade_mid;
        },
        //获取年月日--由于时间增加时分秒，该函数停用
        get_date: function(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return year + '/' + month + '/' + day;
        },
        //列表测试数据--仅供测试
        getdata_test() {
            let _this = this;
            _this.trades = [{
                "qudao_uid": 12345, // 渠道 userid
                "qudao_name": "渠道名", // 渠道名
                "mchnt_uid": 12346, // 商户 userid
                "mchnt_name": "商户名", // 商户名
                "trade_syssn": "20170227123456", // 交易流水号
                "trade_amt": 100, // 交易金额, 单位为分
                "trade_fee": 100, // 手续费, 单位分
                "trade_dtm": "2017-02-27 01:02:03", // 交易时间
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
                "trade_dtm": "2017-01-27 01:02:03", // 交易时间
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
                "trade_dtm": "2017-02-02 01:02:03", // 交易时间
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
                "trade_dtm": "2016-11-27 01:02:03", // 交易时间
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
                "trade_dtm": "2017-02-02 01:02:03", // 交易时间
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
                "trade_dtm": "2016-11-27 01:02:03", // 交易时间
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
                "trade_dtm": "2017-02-02 01:02:03", // 交易时间
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
                "trade_dtm": "2016-11-27 01:02:03", // 交易时间
                "trade_type": "微信", // 交易类型
                "trade_status": "失败", // 交易状态
                "trade_msg": "交易失败", // 交易失败原因
                "mchnt_mobile": "15893456456", // 手机号
            }];
            _this.trade_mid = _this.trades;
            //_this.pages_all = _this.trade_mid.length;
            _this.pages_all = 100;
            _this.trade_now = _this.trade_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
        },
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
.el-date-editor--daterange.el-input {
    /*width: 204px;*/
    width: 70%;
}
</style>
