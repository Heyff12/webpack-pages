<template>
    <div>
        <div class="right_head">
            渠道商户入网统计
        </div>
        <div class="right_body forms_form">
            <div class="line_pic">
                <div class="select wid_long">
                    <span class="sel_title">开始时间（结束时间顺延一周）：</span>
                    <el-date-picker v-model="sel_day" type="date" placeholder="请选择开始日期" :picker-options="pickerOptions" @change="change_date" format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
                <div class="line_body" id="form_pic"></div>
                <h3 class="note">日期：<span class="orange">{{note_data.start_date}}</span>-<span class="orange">{{note_data.end_date}}</span> ，下级渠道总商户入网量：<span class="orange">{{note_data.mchnt_nums}}</span>人，下级渠道个数：<span class="orange">{{note_data.sub_qd_cnt}}</span>个。</h3>
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
                "start_date": "", // 开始日期
                "end_date": "", // 结束日期
                "mchnt_nums": 0, // 入网商户数
                "sub_qd_cnt": 0 // 下级渠道个数
            }, //合计功能
            All_data: [], //ajax返回交易折线图数据
            form_y_data: [], //交易折线图数据
            form_x_data: [], //交易折线图x轴分钟区间
            legend_data: [], //总折线名称数组
            data_len: 0, //每条折线的数据长度
            form_url: location.protocol + '//' + location.host + '/qudao/v1/api/statistic/qd_mchnt_register',
            sel_day: '', //筛选的日期
            start_rate: '40', //开始起点x轴--暂时不使用，只有7个数据
            end_rate: '100', //结束点x轴--暂时不使用，只有7个数据
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
                "start_date": "", // 开始日期
                "end_date": "", // 结束日期
                "mchnt_nums": 0, // 入网商户数
                "sub_qd_cnt": 0 // 下级渠道个数
            };
            _this.All_data = [];
            _this.legend_data = [];
            _this.form_x_data = [];
            _this.form_y_data = [];
            let post_data = {
                'start_date': _this.sel_day
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
                            data.register_record.forEach(function(item) {
                                _this.form_y_data.push(item.mchnt_nums);
                                _this.form_x_data.push(item.date.substr(5, 5));
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
                // dataZoom: [{
                //     type: 'slider',
                //     start: _this.start_rate,
                //     end: _this.end_rate
                // }],
                legend: {
                    data: _this.legend_data,
                    z: 3,
                },
                xAxis: {
                    name: '最近一周/天',
                    data: _this.form_x_data.slice(0, _this.data_len),
                },
                yAxis: {
                    name: '商户入网数',
                    type: 'value',
                    boundaryGap: ['0%', '5%'],
                },
                series: [{
                    name: _this.legend_data[0],
                    type: 'bar',
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
                    type: 'bar',
                    smooth: true,
                    smoothMonotone: 'x',
                    data: _this.form_y_data.slice(_this.data_len, _this.data_len * 2),
                }, {
                    name: _this.legend_data[2],
                    type: 'bar',
                    smooth: true,
                    smoothMonotone: 'x',
                    data: _this.form_y_data.slice(_this.data_len * 2, _this.data_len * 3),
                }, {
                    name: _this.legend_data[3],
                    type: 'bar',
                    smooth: true,
                    smoothMonotone: 'x',
                    data: _this.form_y_data.slice(_this.data_len * 3, _this.data_len * 4),
                }, {
                    name: _this.legend_data[4],
                    type: 'bar',
                    smooth: true,
                    smoothMonotone: 'x',
                    data: _this.form_y_data.slice(_this.data_len * 4, _this.data_len * 5),
                }, {
                    name: _this.legend_data[5],
                    type: 'bar',
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
            this.sel_day = date;
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
                    "start_date": "2017-03-01", // 开始日期
                    "end_date": "2017-03-01", // 结束日期
                    "mchnt_nums": 100, // 入网商户数
                    "sub_qd_cnt": 30 // 下级渠道个数
                },
                "detail": [{ // 各渠道详细数据
                    "qd_name": "渠道名1",
                    "register_record": [{
                        "date": "2017-02-28", // 时间
                        "mcnht_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-03-01", // 时间
                        "mcnht_nums": 30, // 入网商户数
                    }, {
                        "date": "2017-03-02", // 时间
                        "mcnht_nums": 140, // 入网商户数
                    }, {
                        "date": "2017-03-03", // 时间
                        "mcnht_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-03-04", // 时间
                        "mcnht_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-03-05", // 时间
                        "mcnht_nums": 60, // 入网商户数
                    }, {
                        "date": "2017-03-06", // 时间
                        "mcnht_nums": 80, // 入网商户数
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名1",
                    "register_record": [{
                        "date": "2017-02-28", // 时间
                        "mcnht_nums": 110, // 入网商户数
                    }, {
                        "date": "2017-03-01", // 时间
                        "mcnht_nums": 310, // 入网商户数
                    }, {
                        "date": "2017-03-02", // 时间
                        "mcnht_nums": 140, // 入网商户数
                    }, {
                        "date": "2017-03-03", // 时间
                        "mcnht_nums": 80, // 入网商户数
                    }, {
                        "date": "2017-03-04", // 时间
                        "mcnht_nums": 190, // 入网商户数
                    }, {
                        "date": "2017-03-05", // 时间
                        "mcnht_nums": 69, // 入网商户数
                    }, {
                        "date": "2017-03-06", // 时间
                        "mcnht_nums": 90, // 入网商户数
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名3",
                    "register_record": [{
                        "date": "2017-02-28", // 时间
                        "mcnht_nums": 18, // 入网商户数
                    }, {
                        "date": "2017-03-01", // 时间
                        "mcnht_nums": 38, // 入网商户数
                    }, {
                        "date": "2017-03-02", // 时间
                        "mcnht_nums": 148, // 入网商户数
                    }, {
                        "date": "2017-03-03", // 时间
                        "mcnht_nums": 108, // 入网商户数
                    }, {
                        "date": "2017-03-04", // 时间
                        "mcnht_nums": 98, // 入网商户数
                    }, {
                        "date": "2017-03-05", // 时间
                        "mcnht_nums": 68, // 入网商户数
                    }, {
                        "date": "2017-03-06", // 时间
                        "mcnht_nums": 88, // 入网商户数
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名4",
                    "register_record": [{
                        "date": "2017-02-28", // 时间
                        "mcnht_nums": 122, // 入网商户数
                    }, {
                        "date": "2017-03-01", // 时间
                        "mcnht_nums": 322, // 入网商户数
                    }, {
                        "date": "2017-03-02", // 时间
                        "mcnht_nums": 122, // 入网商户数
                    }, {
                        "date": "2017-03-03", // 时间
                        "mcnht_nums": 22, // 入网商户数
                    }, {
                        "date": "2017-03-04", // 时间
                        "mcnht_nums": 322, // 入网商户数
                    }, {
                        "date": "2017-03-05", // 时间
                        "mcnht_nums": 222, // 入网商户数
                    }, {
                        "date": "2017-03-06", // 时间
                        "mcnht_nums": 122, // 入网商户数
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名5",
                    "register_record": [{
                        "date": "2017-02-28", // 时间
                        "mcnht_nums": 60, // 入网商户数
                    }, {
                        "date": "2017-03-01", // 时间
                        "mcnht_nums": 150, // 入网商户数
                    }, {
                        "date": "2017-03-02", // 时间
                        "mcnht_nums": 140, // 入网商户数
                    }, {
                        "date": "2017-03-03", // 时间
                        "mcnht_nums": 170, // 入网商户数
                    }, {
                        "date": "2017-03-04", // 时间
                        "mcnht_nums": 99, // 入网商户数
                    }, {
                        "date": "2017-03-05", // 时间
                        "mcnht_nums": 30, // 入网商户数
                    }, {
                        "date": "2017-03-06", // 时间
                        "mcnht_nums": 80, // 入网商户数
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名6",
                    "register_record": [{
                        "date": "2017-02-28", // 时间
                        "mcnht_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-03-01", // 时间
                        "mcnht_nums": 30, // 入网商户数
                    }, {
                        "date": "2017-03-02", // 时间
                        "mcnht_nums": 140, // 入网商户数
                    }, {
                        "date": "2017-03-03", // 时间
                        "mcnht_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-03-04", // 时间
                        "mcnht_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-03-05", // 时间
                        "mcnht_nums": 60, // 入网商户数
                    }, {
                        "date": "2017-03-06", // 时间
                        "mcnht_nums": 80, // 入网商户数
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名7",
                    "register_record": [{
                        "date": "2017-02-28", // 时间
                        "mcnht_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-03-01", // 时间
                        "mcnht_nums": 30, // 入网商户数
                    }, {
                        "date": "2017-03-02", // 时间
                        "mcnht_nums": 140, // 入网商户数
                    }, {
                        "date": "2017-03-03", // 时间
                        "mcnht_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-03-04", // 时间
                        "mcnht_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-03-05", // 时间
                        "mcnht_nums": 60, // 入网商户数
                    }, {
                        "date": "2017-03-06", // 时间
                        "mcnht_nums": 80, // 入网商户数
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名8",
                    "register_record": [{
                        "date": "2017-02-28", // 时间
                        "mcnht_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-03-01", // 时间
                        "mcnht_nums": 30, // 入网商户数
                    }, {
                        "date": "2017-03-02", // 时间
                        "mcnht_nums": 140, // 入网商户数
                    }, {
                        "date": "2017-03-03", // 时间
                        "mcnht_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-03-04", // 时间
                        "mcnht_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-03-05", // 时间
                        "mcnht_nums": 60, // 入网商户数
                    }, {
                        "date": "2017-03-06", // 时间
                        "mcnht_nums": 80, // 入网商户数
                    }]
                }, { // 各渠道详细数据
                    "qd_name": "渠道名9",
                    "register_record": [{
                        "date": "2017-02-28", // 时间
                        "mcnht_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-03-01", // 时间
                        "mcnht_nums": 30, // 入网商户数
                    }, {
                        "date": "2017-03-02", // 时间
                        "mcnht_nums": 140, // 入网商户数
                    }, {
                        "date": "2017-03-03", // 时间
                        "mcnht_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-03-04", // 时间
                        "mcnht_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-03-05", // 时间
                        "mcnht_nums": 60, // 入网商户数
                    }, {
                        "date": "2017-03-06", // 时间
                        "mcnht_nums": 80, // 入网商户数
                    }]
                }, ]
            };
            _this.note_data = _this.All_data.summary;
            _this.All_data.detail.slice(0, 6).forEach(function(data) {
                _this.legend_data.push(data.qd_name);
                data.register_record.forEach(function(item) {
                    _this.form_y_data.push(item.mcnht_nums);
                    _this.form_x_data.push(item.date.substr(5, 5));
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
