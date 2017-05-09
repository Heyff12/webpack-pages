<template>
    <div>
        <div class="right_head">
            业务员统计
        </div>
        <div class="right_body forms_form">
            <div class="line_pic">
                <div class="select">
                    <el-date-picker v-model="sel_day" type="month" placeholder="选择日期" :picker-options="pickerOptions" @change="change_date" format="yyyy-MM">
                    </el-date-picker>
                </div>
                <div class="line_body" id="form_pic"></div>
                <h3 class="note">日期：<span class="orange">{{note_data.date}}</span> ，业务员入网商户总数：<span class="orange">{{note_data.mchnt_nums}}</span>人，业务员个数：<span class="orange">{{note_data.slsm_cnt}}</span>个。</h3>
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
                "date": "2017-03", // 月份
                "mchnt_nums": 100, // 入网商户数
                "slsm_cnt": 30 // 业务员个数
            }, //合计功能
            All_data: [], //ajax返回交易折线图数据
            form_y_data: [], //交易折线图数据
            form_x_data: [], //交易折线图x轴分钟区间
            legend_data: [], //总折线名称数组
            data_len: 0, //每条折线的数据长度
            form_url: location.protocol + '//' + location.host + '/qudao/v1/api/statistic/slsm_netin_record',
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
                'date': _this.sel_day
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
                            _this.legend_data.push(data.slsm_name);
                            data.record.forEach(function(item) {
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
                    name: '时间/天',
                    data: _this.form_x_data.slice(0, _this.data_len),
                },
                yAxis: {
                    name: '签约商户数/人',
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
        //根据日期筛选数据--提交查询
        change_date(date) {
            this.sel_day = date;
            setTimeout(() => {
                this.get_formdata();
            }, 0);
        },
        //测试数据--交易
        formdata_test() {
            let _this = this;
            _this.All_data = {
                "summary": { // 总计
                    "date": "2017-03", // 月份
                    "mchnt_nums": 100, // 入网商户数
                    "slsm_cnt": 30 // 业务员个数
                },
                "detail": [{ // 各渠道详细数据
                    "slsm_name": "渠道名1",
                    "record": [{
                        "date": "2017-02-22", // 日期
                        "mchnt_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-02-23", // 日期
                        "mchnt_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-02-24", // 日期
                        "mchnt_nums": 50, // 入网商户数
                    }, {
                        "date": "2017-02-25", // 日期
                        "mchnt_nums": 120, // 入网商户数
                    }, {
                        "date": "2017-02-26", // 日期
                        "mchnt_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-02-27", // 日期
                        "mchnt_nums": 160, // 入网商户数
                    }, {
                        "date": "2017-02-28", // 日期
                        "mchnt_nums": 110, // 入网商户数
                    }, ]
                }, { // 各渠道详细数据
                    "slsm_name": "渠道名2",
                    "record": [{
                        "date": "2017-02-22", // 日期
                        "mchnt_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-02-23", // 日期
                        "mchnt_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-02-24", // 日期
                        "mchnt_nums": 50, // 入网商户数
                    }, {
                        "date": "2017-02-25", // 日期
                        "mchnt_nums": 120, // 入网商户数
                    }, {
                        "date": "2017-02-26", // 日期
                        "mchnt_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-02-27", // 日期
                        "mchnt_nums": 160, // 入网商户数
                    }, {
                        "date": "2017-02-28", // 日期
                        "mchnt_nums": 110, // 入网商户数
                    }, ]
                }, { // 各渠道详细数据
                    "slsm_name": "渠道名3",
                    "record": [{
                        "date": "2017-02-22", // 日期
                        "mchnt_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-02-23", // 日期
                        "mchnt_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-02-24", // 日期
                        "mchnt_nums": 50, // 入网商户数
                    }, {
                        "date": "2017-02-25", // 日期
                        "mchnt_nums": 120, // 入网商户数
                    }, {
                        "date": "2017-02-26", // 日期
                        "mchnt_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-02-27", // 日期
                        "mchnt_nums": 160, // 入网商户数
                    }, {
                        "date": "2017-02-28", // 日期
                        "mchnt_nums": 110, // 入网商户数
                    }, ]
                }, { // 各渠道详细数据
                    "slsm_name": "渠道名4",
                    "record": [{
                        "date": "2017-02-22", // 日期
                        "mchnt_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-02-23", // 日期
                        "mchnt_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-02-24", // 日期
                        "mchnt_nums": 50, // 入网商户数
                    }, {
                        "date": "2017-02-25", // 日期
                        "mchnt_nums": 120, // 入网商户数
                    }, {
                        "date": "2017-02-26", // 日期
                        "mchnt_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-02-27", // 日期
                        "mchnt_nums": 160, // 入网商户数
                    }, {
                        "date": "2017-02-28", // 日期
                        "mchnt_nums": 110, // 入网商户数
                    }, ]
                }, { // 各渠道详细数据
                    "slsm_name": "渠道名5",
                    "record": [{
                        "date": "2017-02-22", // 日期
                        "mchnt_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-02-23", // 日期
                        "mchnt_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-02-24", // 日期
                        "mchnt_nums": 50, // 入网商户数
                    }, {
                        "date": "2017-02-25", // 日期
                        "mchnt_nums": 120, // 入网商户数
                    }, {
                        "date": "2017-02-26", // 日期
                        "mchnt_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-02-27", // 日期
                        "mchnt_nums": 160, // 入网商户数
                    }, {
                        "date": "2017-02-28", // 日期
                        "mchnt_nums": 110, // 入网商户数
                    }, ]
                }, { // 各渠道详细数据
                    "slsm_name": "渠道名6",
                    "record": [{
                        "date": "2017-02-22", // 日期
                        "mchnt_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-02-23", // 日期
                        "mchnt_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-02-24", // 日期
                        "mchnt_nums": 50, // 入网商户数
                    }, {
                        "date": "2017-02-25", // 日期
                        "mchnt_nums": 120, // 入网商户数
                    }, {
                        "date": "2017-02-26", // 日期
                        "mchnt_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-02-27", // 日期
                        "mchnt_nums": 160, // 入网商户数
                    }, {
                        "date": "2017-02-28", // 日期
                        "mchnt_nums": 110, // 入网商户数
                    }, ]
                }, { // 各渠道详细数据
                    "slsm_name": "渠道名7",
                    "record": [{
                        "date": "2017-02-22", // 日期
                        "mchnt_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-02-23", // 日期
                        "mchnt_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-02-24", // 日期
                        "mchnt_nums": 50, // 入网商户数
                    }, {
                        "date": "2017-02-25", // 日期
                        "mchnt_nums": 120, // 入网商户数
                    }, {
                        "date": "2017-02-26", // 日期
                        "mchnt_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-02-27", // 日期
                        "mchnt_nums": 160, // 入网商户数
                    }, {
                        "date": "2017-02-28", // 日期
                        "mchnt_nums": 110, // 入网商户数
                    }, ]
                }, { // 各渠道详细数据
                    "slsm_name": "渠道名8",
                    "record": [{
                        "date": "2017-02-22", // 日期
                        "mchnt_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-02-23", // 日期
                        "mchnt_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-02-24", // 日期
                        "mchnt_nums": 50, // 入网商户数
                    }, {
                        "date": "2017-02-25", // 日期
                        "mchnt_nums": 120, // 入网商户数
                    }, {
                        "date": "2017-02-26", // 日期
                        "mchnt_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-02-27", // 日期
                        "mchnt_nums": 160, // 入网商户数
                    }, {
                        "date": "2017-02-28", // 日期
                        "mchnt_nums": 110, // 入网商户数
                    }, ]
                }, { // 各渠道详细数据
                    "slsm_name": "渠道名9",
                    "record": [{
                        "date": "2017-02-22", // 日期
                        "mchnt_nums": 10, // 入网商户数
                    }, {
                        "date": "2017-02-23", // 日期
                        "mchnt_nums": 100, // 入网商户数
                    }, {
                        "date": "2017-02-24", // 日期
                        "mchnt_nums": 50, // 入网商户数
                    }, {
                        "date": "2017-02-25", // 日期
                        "mchnt_nums": 120, // 入网商户数
                    }, {
                        "date": "2017-02-26", // 日期
                        "mchnt_nums": 90, // 入网商户数
                    }, {
                        "date": "2017-02-27", // 日期
                        "mchnt_nums": 160, // 入网商户数
                    }, {
                        "date": "2017-02-28", // 日期
                        "mchnt_nums": 110, // 入网商户数
                    }, ]
                }, ]
            };
            _this.All_data.detail.slice(0, 6).forEach(function(data) {
                _this.legend_data.push(data.slsm_name);
                data.record.forEach(function(item) {
                    _this.form_y_data.push(item.mchnt_nums);
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
