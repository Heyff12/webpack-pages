<template>
    <div>
        <div class="right_head">
            商户交易统计
        </div>
        <div class="right_body forms_form">
            <div class="line_pic">
                <div class="select">
                    <el-date-picker v-model="sel_day" type="date" placeholder="选择日期" :picker-options="pickerOptions" @change="change_date" format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
                <div class="line_body" id="form_pic"></div>
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
            All_data: [], //ajax返回交易折线图数据
            form_y_data: [], //交易折线图数据
            form_x_data: [], //交易折线图x轴分钟区间
            form_url: location.protocol + '//' + location.host + '/qudao/v1/api/statistic/mchnt_trade',
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
            _this.All_data = [];
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
                        _this.All_data.forEach(function(data) {
                            _this.form_y_data.push((data.pass_amt / 100).toFixed(2));
                            _this.form_x_data.push(data.time.substr(11, 2));
                        });
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
                xAxis: {
                    name: '时间/小时',
                    data: _this.form_x_data,
                },
                yAxis: {
                    name: '交易金额/元',
                    type: 'value',
                    boundaryGap: ['0%', '5%'],
                },
                series: [{
                    name: '交易金额',
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'x',
                    data: _this.form_y_data,
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
        //根据日期筛选数据
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
            _this.All_data = [{
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
                "time": "2017-02-28 06:46", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 2277400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 07:47", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 33400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 08:48", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 557800, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 09:49", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 334500, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 10:50", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 678900, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 11:51", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 12300, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 12:52", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 5600, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 13:53", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 6700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 14:54", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 666700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 15:55", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 66700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 16:56", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 223400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 17:57", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 33400, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 18:58", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 557800, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 19:59", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 334500, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 20:60", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 678900, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 21:01", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 12300, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 22:02", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 5600, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 23:03", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 6700, // 交易金额, 单位分
            }, {
                "time": "2017-02-28 24:04", // 时间
                "pass_nums": 10, // 交易数
                "pass_amt": 666700, // 交易金额, 单位分
            }];
            _this.All_data.forEach(function(data) {
                _this.form_y_data.push((data.pass_amt / 100).toFixed(2));
                _this.form_x_data.push(data.time.substr(11, 2));
            });
            setTimeout(() => {
                _this.formpic_line();
            }, 0);
        },
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
.forms_form .line_pic {
    background: none;
    .select {
        padding-right: 90px;
        width: 200px;
        float: right;
    }
    .line_body {
        width: 100%;
        height: auto;
        min-height: 500px;
        padding: 10px 0;
        box-sizing: border-box;
        margin-top: -30px;
    }
}
</style>
