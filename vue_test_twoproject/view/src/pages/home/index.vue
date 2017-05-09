<template>
    <div>
        <div class="right_head">
            昨日数据
        </div>
        <div class="home_body">
            <el-row :gutter="10">
                <el-col :xs="24" :sm="24" :md="8" :lg="6">
                    <dl class="home_dl">
                        <dt>交易数据</dt>
                        <dd><span class="data_span">{{(yester_data.trade_amt/100).toFixed(2)}}</span>元</dd>
                    </dl>
                </el-col>
                <el-col :xs="24" :sm="24" :md="8" :lg="6">
                    <dl class="home_dl dl_two">
                        <dt>新入网商户数</dt>
                        <dd><span class="data_span">{{yester_data.new_mchnt_cnt}}</span>个</dd>
                    </dl>
                </el-col>
                <el-col :xs="24" :sm="24" :md="8" :lg="6">
                    <dl class="home_dl dl_three">
                        <dt>净收入</dt>
                        <dd><span class="data_span">{{(yester_data.net_amt/100).toFixed(2)}}</span>元</dd>
                    </dl>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="6">
                    <dl class="home_dl dl_four">
                        <dd v-for="bank in yester_data.mchnt_rank">
                            <!-- <img :src="bank.logo_url"> --><span class="grey">{{ bank.shopname }}</span><span class="grey">{{ (bank.trade_amt/100).toFixed(2) }}元</span>
                        </dd>
                    </dl>
                </el-col>
            </el-row>
        </div>
        <div class="home_body_b">
            <div class="line_pic">
                <p class="title">实时交易折线图</p>
                <!-- <div class="select">
                    <el-select v-model="select_date" placeholder="请选择日期" v-on:change="change_date">
                        <el-option v-for="month in month_data" :label="month" :value="month">
                        </el-option>
                    </el-select>
                </div> -->
                <div class="line_body" id="trade_pic"></div>
            </div>
            <div class="line_pic">
                <p class="title title2">渠道商户入网统计折线图</p>
                <div class="line_body" id="salesman_pic"></div>
            </div>
        </div>
        <load :visible="loading"></load>
        <toast :msg="toastmsg" :visible="visible_toast" @on-visible-change="onVisibleChange" @on-msg-change="onMsgChange"></toast>
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    name: 'home',
    data() {
        return {
            loading: false, //load是否显示
            toastmsg: '', //toast提示文字
            visible_toast: false, //toast是否显示  
            yester_data: {
                "date": "", // 日期
                "trade_cnt": 0, // 交易笔数
                "trade_amt": 0, // 交易金额, 单位为分
                "net_amt": 0, // 净收入, 单位为分
                "new_mchnt_cnt": 0, // 新入商户数
                "mchnt_rank": [{
                    "mchnt_uid": 0,
                    "shopname": "",
                    "trade_amt": 0,
                    "rank": 0,
                    "logo_url": "",
                }, {
                    "mchnt_uid": 0,
                    "shopname": "",
                    "trade_amt": 0,
                    "rank": 0,
                    "logo_url": "",
                }, {
                    "mchnt_uid": 0,
                    "shopname": "",
                    "trade_amt": 0,
                    "rank": 0,
                    "logo_url": "",
                }]
            },
            trade: null, //交易折线图
            salesman: null, //业务员折线图
            tradeAll_data: [], //ajax返回交易折线图数据
            trade_y_data: [], //交易折线图数据
            trade_x_data: [], //交易折线图x轴分钟区间
            salesmanAll_data: [], //ajax返回业务员折线图数据
            salesman_y_data: [], //业务员折线图数据
            salesman_x_data: [], //业务员折线图x轴分钟区间
            yester_url: location.protocol + '//' + location.host + '/qudao/v1/api/statistic/yesterday_data', //退出登录
            trade_url: location.protocol + '//' + location.host + '/qudao/v1/api/statistic/realtime_transaction', //实时交易记录
            salesman_url: location.protocol + '//' + location.host + '/qudao/v1/api/statistic/slsm_mchnt_register', //业务员
            salesman_data: [], //业务员折线图数据--------以下为折线需要的公共数据
            day_data: [], //x轴日期区间----暂时没有用
            nowYear: '', //当前年份
            nowMonth: '', //当前月份
            nowDate: '', //当前日期
            nowHour: '', //当前小时
            nowMin: '', //当前分
            start_rate: '70', //开始起点x轴
            end_rate: '100', //结束点x轴
            month_data: [], //筛选日期数组----暂时没有用
            select_date: '', //帅选的日期----暂时没有用
        }
    },
    created() {
        this.set_banks(); //获取排行
        this.nowdate_get(); //获取年月日
        this.get_trade(); //设置交易折线图
        this.get_salesman(); //设置业务员折线图
        this.get_yester(); //获取昨日数据
        // setTimeout(() => {
        //     this.trade_line();
        //     this.salesman_line();
        // }, 0);//设置成异步执行才能获取id元素
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
        get_yester: function() {
            let _this = this;
            this.$http.get(this.yester_url, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    let data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.yester_data = data_return.data;
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
        //获取排行数据
        set_banks: function() {
            let _this = this;
            _this.banks = [{
                name: '大通冰室',
                price: 678800,
            }, {
                name: '张亮麻辣烫',
                price: 556600,
            }, {
                name: '大通冰室',
                price: 223300,
            }];
        },
        //获取交易数据
        get_trade: function() {
            let _this = this;
            _this.trade_x_data = [];
            _this.trade_y_data = [];
            this.$http.get(this.trade_url, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    let data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.tradeAll_data = data_return.data;
                        _this.tradeAll_data.forEach(function(data) {
                            _this.trade_x_data.push((data.pass_amt / 100).toFixed(2));
                            _this.trade_y_data.push(data.time.substr(11, 5));
                        });
                        setTimeout(() => {
                            _this.trade_line();
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
            //仅供测试
            //_this.tradedata_test();
        },
        //获取交易数据
        get_salesman: function() {
            let _this = this;
            _this.salesman_x_data = [];
            _this.salesman_y_data = [];
            this.$http.get(this.salesman_url, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    let data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.salesmanAll_data = data_return.data;
                        _this.salesmanAll_data.forEach(function(data) {
                            _this.salesman_x_data.push(data.time.substr(5, 5));
                            _this.salesman_y_data.push(data.mchnt_nums);
                        });
                        setTimeout(() => {
                            this.salesman_line();
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
            //测试数据
            //_this.salsemandata_test();
        },
        //设置交易折线图像
        trade_line: function() {
            // 基于准备好的dom，初始化echarts实例
            let _this = this;
            _this.trade = echarts.init(document.getElementById('trade_pic'));
            // 绘制图表
            _this.trade.setOption({
                title: {
                    text: '',
                    show: false,
                },
                tooltip: {},
                dataZoom: [{
                    type: 'slider',
                    start: _this.start_rate,
                    end: _this.end_rate
                }],
                xAxis: {
                    name: '分钟/HH:MM',
                    data: _this.trade_y_data,
                },
                yAxis: {
                    name: '交易金额/元',
                    type: 'value',
                    boundaryGap: ['0%', '5%'],
                },
                series: [{
                    name: '交易金额统计',
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'x',
                    data: _this.trade_x_data,
                    lineStyle: {
                        normal: {
                            color: '#FF8100',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#FF8100',
                        }
                    },
                }]
            });
        },
        //设置业务员折线图像
        salesman_line: function() {
            // 基于准备好的dom，初始化echarts实例
            let _this = this;
            _this.salesman = echarts.init(document.getElementById('salesman_pic'));
            // 绘制图表
            _this.salesman.setOption({
                title: {
                    text: '',
                    show: false,
                },
                tooltip: {},
                xAxis: {
                    name: '最近一周/MM-dd',
                    data: _this.salesman_x_data
                },
                yAxis: {
                    name: '入网商户数/日期',
                },
                series: [{
                    name: '入网商户数',
                    type: 'line',
                    smooth: true,
                    data: _this.salesman_y_data,
                    itemStyle: {
                        normal: {
                            color: '#4A90E2',
                        }
                    },
                }]
            });
        },
        //获取当前年月日--由后台数据提供，已弃用
        nowdate_get: function() {
            let now = new Date();
            this.nowYear = now.getFullYear();
            this.nowMonth = now.getMonth() + 1;
            this.nowDate = now.getDate();
            this.nowHour = now.getHours();
            this.nowMin = now.getMinutes();
            //this.select_date = this.nowYear + '-' + this.nowMonth;//设置默认筛选时间
            //this.day_data = this.day_get(this.nowYear, this.nowMonth);//获取当前月的日期x轴
            //this.month_data = this.month_get(this.nowYear, this.nowMonth, 2);//获取时间筛选月份
            this.trade_min_data = this.minate_get(this.nowHour, this.nowMin); //获取交易折线图的x轴的分钟区间
        },
        //获取1小时的分钟区间--由后台数据提供，已弃用
        minate_get: function(hour, min) {
            let _this = this;
            let arr = [];
            let cha_hour;
            if (hour == 0) {
                cha_hour = 23;
            } else if (hour == 1) {
                cha_hour = 0;
            } else {
                cha_hour = hour - 1;
            }
            if (min == 0) {
                for (let i = 0; i <= 59; i++) {
                    let min_val = cha_hour + ':' + i;
                    arr.push(min_val);
                }
                return arr;
            } else {
                let min_pre = [],
                    min_now = [];
                for (let i = min; i <= 59; i++) {
                    let min_val = cha_hour + ':' + i;
                    min_pre.push(min_val);
                }
                for (let j = 0; j < min; j++) {
                    let min_val = hour + ':' + j;
                    min_now.push(min_val);
                }
                arr = min_pre.concat(min_now);
                return arr;
            }
        },
        //设置显示区间----暂时没有用
        rate_area(now_rate) {
            let _this = this;
            if (now_rate - 25 <= 0) {
                _this.start_rate = 0;
                _this.end_rate = 50;
            } else if (now_rate + 25 >= 100) {
                _this.start_rate = 50;
                _this.end_rate = 100;
            } else {
                _this.start_rate = now_rate - 25;
                _this.end_rate = now_rate + 25;
            }
        },
        //根据选项修改x周时间数据----暂时没有用
        change_date() {
            let _this = this;
            let year = _this.select_date.split('-')[0];
            let month = _this.select_date.split('-')[1];
            this.day_data = this.day_get(year, month);
            setTimeout(() => {
                this.trade_line();
            }, 0);
        },
        //获取月份数组----暂时没有用
        month_get: function(year, month, count) {
            let arr = [];
            for (let i = month; i >= 1; i--) {
                let mon = year + '-' + i;
                // let mon = {
                //     'value': year + '-' + i
                // };
                arr.push(mon);
            }
            if (count >= 1) {
                for (let i = 1; i < count; i++) {
                    let year_p = year - i;
                    for (let j = 12; j >= 1; j--) {
                        let mon = year_p + '-' + j;
                        // let mon = {
                        //     'value': year_p + '-' + j
                        // };
                        arr.push(mon);
                    }
                }
            }
            return arr;
        },
        //获取日期数组----暂时没有用
        day_get: function(year, month) {
            if (/^3|5|7|8|10|12$/.test(month)) {
                return this.formatDate(month, 31);
            } else if (/^4|6|9|11$/.test(month)) {
                return this.formatDate(month, 30);
            } else if (/^1$/.test(month)) {
                return this.formatDate(month, 31);
            } else if (/^2$/.test(month)) {
                if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
                    return this.formatDate(month, 29);
                } else {
                    return this.formatDate(month, 28);
                }
            } else {
                throw new Error('month is illegal');
            }
        },
        //获取当月日期----暂时没有用
        formatDate: function(month, count) {
            let scroll_rate = (this.nowDate * 100 / count).toFixed(0);
            this.rate_area(scroll_rate);
            let arr = [];
            for (let i = 1; i <= count; i++) {
                let day = month + '-' + i;
                arr.push(day);
            }
            return arr;
        },
        //测试数据--交易
        tradedata_test() {
            let _this = this;
            _this.tradeAll_data = [{
                "time": "2017-02-28 14:41", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 12300, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:42", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 5600, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:43", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 6700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:44", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 67700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:45", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 66700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:46", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 2277400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:47", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 33400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:48", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 557800, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:49", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 334500, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:50", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 678900, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:51", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 12300, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:52", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 5600, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:53", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 6700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:54", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 666700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:55", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 66700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:56", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 223400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:57", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 33400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:58", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 557800, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:59", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 334500, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:60", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 678900, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:01", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 12300, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:02", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 5600, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:03", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 6700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:04", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 666700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:05", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 66700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:06", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 223400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:07", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 33400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:08", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 557800, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:09", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 334500, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:10", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 678900, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:11", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 12300, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:12", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 5600, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:13", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 6700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:14", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 666700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:15", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 66700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:16", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 223400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:17", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 33400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:18", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 557800, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:19", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 334500, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:20", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 678900, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:21", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 12300, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:22", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 5600, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:23", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 6700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:24", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 667700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:25", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 66700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:26", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 223400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:27", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 33400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:28", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 557800, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:29", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 334500, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:30", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 678900, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:31", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 12300, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:32", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 5600, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:33", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 6700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:34", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 667700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:35", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 66700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:36", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 23400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:37", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 33400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:38", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 557800, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:39", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 334500, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:40", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 678900, // 交易金额, 单位分
            }];
            _this.tradeAll_data.forEach(function(data) {
                _this.trade_x_data.push((data.pass_amt / 100).toFixed(0));
                _this.trade_y_data.push(data.time.substr(11, 5));
            });
            setTimeout(() => {
                _this.trade_line();
            }, 0);
        },
        //测试数据--业务员
        salsemandata_test() {
            let _this = this;
            _this.salesmanAll_data = [{
                "time": "2017-02-22", // 日期
                "mchnt_nums": 10, // 入网商户数
            }, {
                "time": "2017-02-23", // 日期
                "mchnt_nums": 140, // 入网商户数
            }, {
                "time": "2017-02-24", // 日期
                "mchnt_nums": 60, // 入网商户数
            }, {
                "time": "2017-02-25", // 日期
                "mchnt_nums": 70, // 入网商户数
            }, {
                "time": "2017-02-26", // 日期
                "mchnt_nums": 170, // 入网商户数
            }, {
                "time": "2017-02-27", // 日期
                "mchnt_nums": 210, // 入网商户数
            }, {
                "time": "2017-02-28", // 日期
                "mchnt_nums": 90, // 入网商户数
            }];
            _this.salesmanAll_data.forEach(function(data) {
                _this.salesman_x_data.push(data.time.substr(5, 5));
                _this.salesman_y_data.push(data.mchnt_nums);
            });
            setTimeout(() => {
                this.salesman_line();
            }, 0);
        },
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
@import "../../css/common/const";
.home_body_b {
    width: 100%;
    box-sizing: border-box;
    padding: 0px 30px 30px;
}

dl.home_dl {
    width: 100%;
    padding: 25px 10px;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 38px;
    background: white;
    box-shadow: 0 2px 6px 0 rgb(202, 202, 202, 1);
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    margin: 0px 0 30px;
    &:before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        height: 3px;
        width: 100%;
        background: @green;
    }
    &.dl_two:before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        height: 3px;
        width: 100%;
        background: @pink;
    }
    &.dl_three:before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        height: 3px;
        width: 100%;
        background: @syan;
    }
    dt {
        text-align: center;
        font-size: 18px;
    }
    dd {
        text-align: center;
        color: @orange;
        span.data_span {
            padding-right: 6px;
            font-size: 26px;
        }
    }
    &.dl_four {
        padding: 10px 0px 11px;
        height: 129px;
        &:before {
            display: none;
        }
        dd {
            text-align: left;
            line-height: 36px;
            background: url('@{images}/band1.png') left center no-repeat;
            background-size: auto 25px;
            padding-left: 58px;
            &:nth-child(2) {
                background: url('@{images}/band2.png') left center no-repeat;
                background-size: auto 25px;
            }
            &:nth-child(3) {
                background: url('@{images}/band3.png') left center no-repeat;
                background-size: auto 25px;
            }
            span {
                padding-left: 10px;
            }
            img {
                width: 20px;
                height: 20px;
                border-radius: 100%;
                vertical-align: middle;
            }
        }
    }
}

.line_pic {
    width: 100%;
    background: white;
    padding: 10px 0;
    box-sizing: border-box;
    height: auto;
    min-height: 248px;
    text-align: left;
    margin-bottom: 30px;
    border-radius: 6px;
    position: relative;
    p.title {
        width: 100%;
        padding-left: 15px;
        line-height: 30px;
        font-size: 16px;
        position: relative;
        box-sizing: border-box;
        &:before {
            content: '';
            position: absolute;
            left: 0;
            width: 3px;
            height: 16px;
            background: @orangebg_color;
            top: 7px;
        }
        &.title2:before {
            content: '';
            background: @blue;
        }
    }
    .select {
        text-align: right;
        width: 100%;
        padding-right: 30px;
        box-sizing: border-box;
        position: relative;
        z-index: 2;
    }
    .line_body {
        width: 100%;
        height: auto;
        min-height: 500px;
        padding: 10px 30px;
        box-sizing: border-box;
        margin-top: -30px;
    }
    h3.note {
        width: 100%;
        line-height: 25px;
        text-align: center;
        padding-top: 10px;
        font-weight: normal;
    }
}
</style>
