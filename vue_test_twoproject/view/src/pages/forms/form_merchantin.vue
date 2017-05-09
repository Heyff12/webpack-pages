<template>
    <div>
        <div class="right_head">
            商户入网统计
        </div>
        <div class="right_body forms_form select">
            <div class="line_pic">
                <div class="select wid_long">
                    <span class="sel_title">开始时间（结束时间顺延一周）：</span>
                    <el-date-picker v-model="sel_day" type="date" placeholder="请选择开始日期" :picker-options="pickerOptions" @change="change_date" format="yyyy-MM-dd">
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
            form_url: location.protocol + '//' + location.host + '/qudao/v1/api/statistic/mchnt_register',
            sel_day: '', //筛选的日期
            start_rate: '0', //开始起点x轴--取消未使用，只有7个数据
            end_rate: '100', //结束点x轴--取消未使用，只有7个数据
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
            _this.All_data = [];
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
                        _this.All_data.forEach(function(data) {
                            _this.form_y_data.push(data.mchnt_nums);
                            _this.form_x_data.push(data.date.substr(5, 5));
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
                // dataZoom: [{
                //     type: 'slider',
                //     start: _this.start_rate,
                //     end: _this.end_rate
                // }],
                xAxis: {
                    name: '最近一周/MM-dd',
                    data: _this.form_x_data,
                },
                yAxis: {
                    name: '商户入网数',
                    type: 'value',
                    boundaryGap: ['0%', '5%'],
                },
                series: [{
                    name: '商户入网数',
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
            _this.All_data = [{
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
            }, ];
            _this.All_data.forEach(function(data) {
                _this.form_y_data.push(data.mchnt_nums);
                _this.form_x_data.push(data.date.substr(5, 5));
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
    .select {
        &.wid_long {
            width: 200px;
            padding-left: 180px;
            box-sizing: content-box;
            position: relative;
            padding-right: 0;
        }
        span.sel_title {
            font-size: 12px;
            position: absolute;
            left: 0;
            top: 10px;
        }
    }
}
</style>
