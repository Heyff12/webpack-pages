<template>
    <div>
        <div class="right_head">
            渠道交易统计
        </div>
        <div class="right_body forms_form">
            <div class="line_pic">
                <div class="select">
                    <el-date-picker v-model="sel_day" type="date" placeholder="选择日期" :picker-options="pickerOptions" @change="change_date" format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
                <div class="line_body" id="form_pic"></div>
                <h3 class="note">日期：<span class="orange">{{note_data.date}}</span> ，下级渠道总交易量：<span class="orange">{{(note_data.pass_nums/100).toFixed(2)}}</span>元，下级渠道个数：<span class="orange">{{note_data.sub_qd_cnt}}</span>个。</h3>
            </div>
        </div>
        <load :visible="loading"></load>
        <toast :msg="toastmsg" :visible="visible_toast" @on-visible-change="onVisibleChange" @on-msg-change="onMsgChange"></toast>
    </div>
</template>
<script>
import echarts from 'echarts'

export default {
    name: 'form_merchant',
    data() {
        return {
            loading: false, //load是否显示
            toastmsg: '', //toast提示文字
            visible_toast: false, //toast是否显示  
            from_now: null, //交易折线图
            note_data: {
                "date": "", // 日期
                "pass_nums": 0, // 总交易量
                "sub_qd_cnt": 0 // 下级渠道个数
            }, //合计功能
            All_data: [], //ajax返回交易折线图数据
            form_y_data: [], //交易折线图数据
            form_x_data: [], //交易折线图x轴分钟区间
            legend_data: [], //总折线名称数组
            data_len: 0, //每条折线的数据长度
            form_url: location.protocol + '//' + location.host + '/qudao/v1/api/statistic/qd_trade',
            sel_day: new Date(), //筛选的日期
            start_rate: '40', //开始起点x轴
            end_rate: '100', //结束点x轴
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() >= Date.now();
                }
            },
        }
    },
    created() {
        this.get_formdata(); //设置交易折线图
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
        //获取交易数据
        get_formdata: function() {
            let _this = this;
            //清空数据
            _this.note_data = {
                "date": "", // 日期
                "pass_nums": 0, // 总交易量
                "sub_qd_cnt": 0 // 下级渠道个数
            };
            _this.All_data = [];
            _this.legend_data = [];
            _this.form_x_data = [];
            _this.form_y_data = [];
            let post_data = {
                'date': _this.time_change(_this.sel_day)
            };
            this.$http.get(this.form_url, {
                    'params': post_data,
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    let data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.All_data = data_return.data;
                        _this.note_data = _this.All_data.summary;
                        _this.All_data.detail.forEach(function(data) {
                            _this.legend_data.push(data.qd_name);
                            data.trade.forEach(function(item) {
                                _this.form_y_data.push((item.pass_amt / 100).toFixed(2));
                                _this.form_x_data.push(item.time.substr(11, 2));
                            });
                        });
                        _this.data_len = _this.form_y_data.length / _this.legend_data.length;
                        setTimeout(() => {
                            _this.formpic_line();
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
            //_this.formdata_test();
        },
        //设置交易折线图像
        formpic_line: function() {
            // 基于准备好的dom，初始化echarts实例
            let _this = this;
            _this.from_now = echarts.init(document.getElementById('form_pic'));
            // 绘制图表
            _this.from_now.setOption({
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
                legend: {
                    data: _this.legend_data,
                    z: 3
                },
                xAxis: {
                    name: '时间/小时',
                    data: _this.form_x_data.slice(0, _this.data_len),
                },
                yAxis: {
                    name: '交易金额/元',
                    type: 'value',
                    boundaryGap: ['0%', '5%'],
                },
                series: [{
                    name: _this.legend_data[0],
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'x',
                    data: _this.form_y_data.slice(0, _this.data_len),
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
                }, {
                    name: _this.legend_data[1],
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'x',
                    data: _this.form_y_data.slice(_this.data_len, _this.data_len * 2),
                }, {
                    name: _this.legend_data[2],
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'x',
                    data: _this.form_y_data.slice(_this.data_len * 2, _this.data_len * 3),
                }, {
                    name: _this.legend_data[3],
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'x',
                    data: _this.form_y_data.slice(_this.data_len * 3, _this.data_len * 4),
                }, {
                    name: _this.legend_data[4],
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'x',
                    data: _this.form_y_data.slice(_this.data_len * 4, _this.data_len * 5),
                }, {
                    name: _this.legend_data[5],
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'x',
                    data: _this.form_y_data.slice(_this.data_len * 5, _this.data_len * 6),
                }, ]
            });
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
        //根据日期筛选数据--提交查询
        change_date(date) {
            setTimeout(() => {
                this.get_formdata();
            }, 0);
        },
        //处理时间格式——yyyy-MM-dd
        time_change(date) {
            let Year = date.getFullYear();
            let Month = this.time_long(date.getMonth() + 1);
            let day = this.time_long(date.getDate());
            return Year + '-' + Month + '-' + day;
        },
        //处理时间 --0——01
        time_long(n) {
            if (n < 10) {
                return '0' + n;
            } else {
                return n;
            }
        },
        //测试数据--交易
        formdata_test() {
            let _this = this;
            _this.All_data = {
                "summary": { // 总计
                    "date": "2017-03-01", // 日期
                    "pass_nums": 100, // 总交易量
                    "sub_qd_cnt": 30 // 下级渠道个数
                },
                "detail": [{ // 各渠道详细数据
                    "qd_name": "渠道名1",
                    "trade": [{
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 12300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 5600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 66700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 06:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 665700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 07:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 08:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 09:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 66700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 10:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6653700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 11:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 132300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 12:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 56300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 13:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 14:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 15:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 636700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 16:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6653700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 17:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 18:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 19:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 636700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 20:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6653700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 21:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 22:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 23:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 63700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 24:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 663700, // 交易金额, 单位分
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名2",
                    "trade": [{
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 8866300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 388600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 88400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 8889500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 588500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6688300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 388600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 88400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 8889500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 588500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6688300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 388600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 28800, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 8888500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 588500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6688300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 388600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 88400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 8888500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 558800, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6886300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 388600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 28800, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 8889500, // 交易金额, 单位分
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名3",
                    "trade": [{
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 145300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 4444600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 46600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 4744400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 444400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 455300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 4600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 64600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 4700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 145300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 4600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 679600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 99700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6900, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1295300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55900, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 679600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 99700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1295300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 59600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 679600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 97900, // 交易金额, 单位分
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名4",
                    "trade": [{
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 66700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 06:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 66700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 07:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 08:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 09:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 10:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 665700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 11:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1299300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 12:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 56300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 13:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 14:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 15:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 66700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 16:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 665700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 17:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 679900, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 18:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 19:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6399600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 20:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6653700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 21:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 679900, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 22:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 23:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6399700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 24:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 663700, // 交易金额, 单位分
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名5",
                    "trade": [{
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 666300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 3544600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 24488400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 88889500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 666300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 35600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 244400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 889500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 7355500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 666300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 735600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 244400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 889500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 7388500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 666300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 735600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 288400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 889500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 673300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 73600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 288400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 889500, // 交易金额, 单位分
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名6",
                    "trade": [{
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1255300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 676600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 97700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1255300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 676600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 97700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1255300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 676600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 97700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1255300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 676600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 97700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1255300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 676600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 97700, // 交易金额, 单位分
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名7",
                    "trade": [{
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 12300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 5600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 66700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 06:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 665700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 07:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 08:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 09:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 66700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 10:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6653700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 11:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 132300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 12:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 56300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 13:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 14:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 15:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 636700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 16:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6653700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 17:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 18:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 19:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 636700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 20:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6653700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 21:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 22:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 67700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 23:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 63700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 24:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 663700, // 交易金额, 单位分
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名8",
                    "trade": [{
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 666300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 35600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 2400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 889500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 666300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 35600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 2400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 889500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 666300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 35600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 2400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 889500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 666300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 35600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 2400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 889500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55500, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 666300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 35600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 2400, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 889500, // 交易金额, 单位分
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名9",
                    "trade": [{
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1255300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 676600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 97700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1255300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 676600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 97700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1255300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 676600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 97700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1255300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 676600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 97700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 05:45", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 6700, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 01:41", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 1255300, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 02:42", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 55600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 03:43", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 676600, // 交易金额, 单位分
                    }, {
                        "time": "2017-02-28 04:44", // 时间
                        "pass_nums": 10, // 交易数
                        "pass_amt": 97700, // 交易金额, 单位分
                    }]
                }, ]
            };
            _this.All_data.detail.slice(0, 6).forEach(function(data) {
                _this.legend_data.push(data.qd_name);
                data.trade.forEach(function(item) {
                    _this.form_y_data.push((item.pass_amt / 100).toFixed(2));
                    _this.form_x_data.push(item.time.substr(11, 2));
                });
            });
            _this.data_len = _this.form_y_data.length / _this.legend_data.length;
            setTimeout(() => {
                _this.formpic_line();
            }, 0);
        },
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">

</style>
