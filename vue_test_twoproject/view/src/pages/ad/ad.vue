<template>
    <div>
        <div class="right_head">
            广告管理
        </div>
        <div class="right_body time_date_short">
            <el-form label-width="100px" class="demo-ruleForm" :model="searchkey" :rules="searchkey_rule" ref="searchkey">
                <el-row :gutter="10">
                    <el-col :xs="24" :sm="24" :md="12" :lg="5">
                        <el-form-item label="广告名称：" prop="name">
                            <el-input v-model.trim="searchkey.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="5">
                        <el-form-item label="状态：" prop="status">
                            <el-select v-model="searchkey.status" placeholder="请选择状态">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="生效" value="1"></el-option>
                                <el-option label="失效" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="6">
                        <el-form-item label="日期：">
                            <el-date-picker v-model="searchkey.during_date" type="date" placeholder="请选择日期" :picker-options="pickerOptions" @change="change_date" format="yyyy-MM-dd" :editable="false" :clearable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8">
                        <el-form-item label-width="0" class="t_c">
                            <el-button type="primary" @click="search_sub_ajax">查询</el-button>
                            <el-button type="default" @click="resetForm('searchkey')">重置</el-button>
                            <el-button type="primary" icon="plus" @click="add_open">添加</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template>
                <el-table :data="table_data" border stripe style="width: 100%">
                    <el-table-column prop="id" label="广告id" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="name" label="广告名称" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="start_time" label="生效时间" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="end_time" label="失效时间" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="update_time" label="最后操作时间" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" resizable min-width="120px">
                        <template scope="scope">
                            <span v-if="scope.row.status">生效</span>
                            <span v-else>失效</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="memo" label="备注" resizable min-width="180px">
                    </el-table-column>
                    <el-table-column label="操作" resizable min-width="100px">
                        <template scope="scope">
                            <el-button type="warning" icon="edit" @click="fix_open(scope.row)">修改</el-button>
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
        <bounced :visible="add_ad" :newclass="big_bounced">
            <span slot="header">
            <template v-if="add_or_fix">添加</template><template v-else>修改</template>广告
            <i class="close"  @click="add_ad=false"></i>
            </span>
            <el-form :model="add_ader" :rules="add_ader_rules" ref="add_ader" label-width="110px" class="demo-ruleForm">
                <el-form-item label="广告名称" prop="name">
                    <el-input v-model="add_ader.name" type="text" auto-complete="off" @blur="if_right"></el-input>
                </el-form-item>
                <el-form-item label="广告链接" prop="orig_url">
                    <el-input v-model="add_ader.orig_url" type="text" auto-complete="off" @blur="if_right"></el-input>
                </el-form-item>
                <el-form-item label="有效时间区间：">
                    <el-date-picker v-model="add_ader.daterange" type="daterange" align="right" placeholder="选择有效时间范围" :picker-options="pickerOptions_erea" :editable="false" @change="time_change">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="生效状态" prop="status">
                    <el-select v-model="add_ader.status" placeholder="请选择状态">
                        <el-option label="生效" value="1"></el-option>
                        <el-option label="失效" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="memo">
                    <el-input type="textarea" :rows="3" placeholder="请输入备注内容" v-model="add_ader.memo" @blur="if_right">
                    </el-input>
                </el-form-item>
                <el-form-item label="">
                    <span class="bounced_button bounced_sure" v-bind:class="{bounced_sure_right:if_right_class}" @click="add_ader_sub">保存</span>
                    <span class="bounced_button bounced_cancle" @click="add_ad = false">取消</span>
                </el-form-item>
            </el-form>
        </bounced>
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
                'name': '',
                'status': '',
                'during_date': '',
            },
            list_url: this.$store.state.ad_url + '/adv/banner/list', //获取交易列表 
            adder_url: this.$store.state.ad_url + '/adv/banner/create?format=cors', //增加广告主   
            adder_fix_url: this.$store.state.ad_url + '/adv/banner/edit?format=cors', //修改广告主   
            adder_to_url: this.$store.state.ad_url + '/adv/redirect/create?format=cors', //广告跳转链接创建接口                                  
            pages_all: 0, //总信息数
            pages: 1, //总页数
            page_per: 10, //每页信息数
            page_now: 1, //当前页数
            table_data: [], //当前展示信息
            pickerOptions: {
                // disabledDate(time) {
                //     return time.getTime() >= Date.now();
                // }
            },
            searchkey_rule: {
                name: [{
                    required: false,
                    // pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,30}$/,
                    // message: '请输入广告名称，长度在 1 到 30 个字符(中文/英文/数字)',
                    message: '请输入广告名称，长度在 1 到 30 个字符',
                    min: 0,
                    max: 30,
                    trigger: 'blur'
                }],
                status: [{
                    require: false,
                    message: '请选择状态',
                    trigger: 'change',
                }],
            },
            add_ad: false, //添加广告弹框是否显示
            big_bounced: 'big_bounced mar_t_exp', //弹框特殊样式--大弹框
            add_or_fix: true, //操作是添加or编辑,true 添加
            if_right_class: false, //弹框输入内容是否都正确，都正确，增加类 显示橙色，否则 灰色
            now_id: '', //当前正在编辑的广告id
            target_url: '', //生成的跳转链接
            add_ader: {
                "name": "",
                "orig_url": "",
                "end_time": "",
                "start_time": "",
                "status": "1",
                "memo": "",
                "daterange": "",
            },
            add_ader_rules: {
                name: [{
                    required: true,
                    // pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,30}$/,
                    // message: '请输入广告名称，长度在 1 到 30 个字符(中文/英文/数字)',
                    message: '请输入广告名称，长度在 1 到 30 个字符',
                    min: 0,
                    max: 30,
                    trigger: 'blur'
                }],
                orig_url: [{
                    required: true,
                    message: '请输入广告链接，长度在 0 到 500 个字符',
                    min: 0,
                    max: 500,
                    trigger: 'blur'
                }],
                end_time: [{
                    required: false,
                    message: '请选择生效时间',
                    trigger: 'blur'
                }],
                start_time: [{
                    required: false,
                    message: '请选择失效时间',
                    trigger: 'blur'
                }],
                status: [{
                    require: false,
                    message: '请选择生效状态',
                    trigger: 'change',
                }],
                memo: [{
                    required: false,
                    message: '请输入官网地址，长度在 0 到 200 个字符',
                    min: 0,
                    max: 200,
                    trigger: 'blur'
                }],
                // daterange: [{
                //     type: 'date',
                //     required: true,
                //     message: '请选择有效时间区间',
                //     trigger: 'change'
                // }],
            },
            pickerOptions_erea: {
                disabledDate: (time) => time.getTime() < Date.now() - 3600 * 1000 * 24,
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
        }
    },
    created: function() {
        //设置默认时间
        this.searchkey.during_date = new Date();
        setTimeout(() => {
            this.get_list(); //获取商户列表
        }, 0);
    },
    methods: {
        //输入是否正确--随之更改确认保存 按钮的 颜色
        if_right: function() {
            let _this = this;
            this.$refs.add_ader.validate((valid) => {
                if (valid) {
                    _this.if_right_class = true;
                } else {
                    _this.if_right_class = false;
                }
            });
        },
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
                'start': (_this.page_now - 1) * this.page_per,
                'length': _this.page_per,
                'name': _this.searchkey.name,
                'status': _this.searchkey.status,
                'during_date': _this.searchkey.during_date.toString().indexOf('-') != '-1' ? this.searchkey.during_date : this.time_change_dearch(this.searchkey.during_date),
                "format": 'cors',
            };
            //console.log(post_data);
            this.$http.get(this.list_url, {
                    'params': post_data,
                    credentials: true,
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    let data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.pages_all = data_return.data.count;
                        _this.table_data = data_return.data.list;
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
            let _this = this;
            this.$refs.searchkey.validate((valid) => {
                if (valid) {
                    _this.get_list();
                } else {
                    return false;
                }
            });
        },
        //重置搜索信息表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            //重置时间
            this.searchkey.during_date = new Date();
        },
        //更换日期--搜索
        change_date(date) {
            this.searchkey.during_date = date;
        },
        //弹框有效时间区间时间变化--弹框
        time_change(val) {
            //console.log(val);
            if (!val) {
                this.add_ader.start_time = '';
                this.add_ader.end_time = '';
            } else {
                let timerange = val.split(' - ');
                this.add_ader.start_time = timerange[0] + ' 00:00:00';
                this.add_ader.end_time = timerange[1] + ' 23:59:59';
            }
            //console.log(this.add_ader.start_time);
        },
        //点击添加按钮
        add_open: function() {
            this.add_or_fix = true; //添加状态
            this.$refs.add_ader.resetFields(); //重置表单
            this.if_right_class = false; //确定按钮--恢复灰色
            //this.add_ader.daterange = ''; //日期区间置空
            this.get_daterange(); //设置默认时间区间
            this.add_ad = true; //打开弹框
        },
        //点击修改按钮
        fix_open: function(val) {
            this.add_or_fix = false; //添加状态
            this.$refs.add_ader.resetFields(); //重置表单
            this.if_right_class = true; //确定按钮--显示橙色
            this.add_ader.daterange = ''; //日期区间置空
            this.add_ader = {
                "name": val.name,
                "orig_url": val.orig_url,
                "end_time": val.end_time,
                "start_time": val.start_time,
                "status": val.status.toString(),
                "memo": val.memo,
                "daterange": [this.get_datetime(val.start_time), this.get_datetime(val.end_time)],
            }; //填充内容
            this.now_id = val.id; //获取当前广告id
            this.add_ad = true; //打开弹框
        },
        //点击确定
        add_ader_sub: function() {
            let _this = this;
            this.$refs.add_ader.validate((valid) => {
                if (valid) {
                    _this.to_sub();
                } else {
                    return false;
                }
            });
        },
        //生成广告跳转链接
        to_sub: function() {
            let _this = this;
            _this.add_ad = false; //关闭弹框
            let post_data = {};
            post_data = {
                "name": this.add_ader.name,
                "status": this.add_ader.status,
                "orig_url": this.add_ader.orig_url,
                //"ownerid":"",
            };
            this.$http.post(this.adder_to_url, post_data, {
                    emulateJSON: true,
                    credentials: true,
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    var data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.target_url = data_return.data.target_url; //重新获取列表信息
                        _this.adder_sub();
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
        //提交新增加or修改的广告主信息
        adder_sub: function() {
            let _this = this;
            //_this.add_ad = false; //关闭弹框
            let url_now;
            let post_data = {
                "name": this.add_ader.name,
                "target_url": this.target_url,
                "end_time": this.add_ader.end_time,
                "start_time": this.add_ader.start_time,
                "status": this.add_ader.status,
                "memo": this.add_ader.memo,
                //"weight":'1',
            };
            if (this.add_or_fix) {
                url_now = this.adder_url;
            } else {
                url_now = this.adder_fix_url;
                post_data.id = this.now_id;
            }
            this.$http.post(url_now, post_data, {
                    emulateJSON: true,
                    credentials: true,
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    var data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.get_list(); //重新获取列表信息
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
        //获取默认时间区间--
        get_daterange: function() {
            let d = new Date();
            let year = d.getFullYear();
            let month = d.getMonth();
            let day = d.getDate();
            //this.add_ader.daterange = [new Date(year, month, 1), d]; //日期区间-当前月份到今天
            this.add_ader.daterange = [d, new Date(d.getTime() + 3600 * 1000 * 24 * 30)]; //日期区间--最近一个月
        },
        //处理时间格式——yyyy-MM-dd--搜索用
        time_change_dearch(date) {
            let Year = date.getFullYear();
            let Month = this.date_long(date.getMonth() + 1);
            let day = this.date_long(date.getDate());
            return Year + '-' + Month + '-' + day;
        },
        //获取年月日，时间格式化
        get_datetime: function(d) {
            let time_zu = d.split('-');
            let date_str = time_zu[0] + '-' + time_zu[1] + '-' + time_zu[2];
            return new Date(date_str);
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
                "id": 11111115,
                "name": "渠道名称",
                "start_time": "2017-03-01", // 交易日期
                "end_time": "2017-03-01",
                "update_time": "2017-03-01",
                "status": '0',
                "memo": "收款行总行",
                "orig_url": "http://yaya12.com",
            }, {
                "id": 11111115,
                "name": "渠道名称",
                "start_time": "2017-03-01", // 交易日期
                "end_time": "2017-03-01",
                "update_time": "2017-03-01",
                "status": '1',
                "memo": "收款行总行",
                "orig_url": "http://yaya12.com",
            }, {
                "id": 11111115,
                "name": "渠道名称",
                "start_time": "2017-03-01", // 交易日期
                "end_time": "2017-03-01",
                "update_time": "2017-03-01",
                "status": '0',
                "memo": "收款行总行",
                "orig_url": "http://yaya12.com",
            }, {
                "id": 11111115,
                "name": "渠道名称",
                "start_time": "2017-03-01", // 交易日期
                "end_time": "2017-03-01",
                "update_time": "2017-03-01",
                "status": '1',
                "memo": "收款行总行",
                "orig_url": "http://yaya12.com",
            }, {
                "id": 11111115,
                "name": "渠道名称",
                "start_time": "2017-03-01", // 交易日期
                "end_time": "2017-03-01",
                "update_time": "2017-03-01",
                "status": '0',
                "memo": "收款行总行",
                "orig_url": "http://yaya12.com",
            }, {
                "id": 11111115,
                "name": "渠道名称",
                "start_time": "2017-03-01", // 交易日期
                "end_time": "2017-03-01",
                "update_time": "2017-03-01",
                "status": 1,
                "memo": "收款行总行",
                "orig_url": "http://yaya12.com",
            }, {
                "id": 11111115,
                "name": "渠道名称",
                "start_time": "2017-03-01", // 交易日期
                "end_time": "2017-03-01",
                "update_time": "2017-03-01",
                "status": '0',
                "memo": "收款行总行",
                "orig_url": "http://yaya12.com",
            }, {
                "id": 11111115,
                "name": "渠道名称",
                "start_time": "2017-03-01", // 交易日期
                "end_time": "2017-03-01",
                "update_time": "2017-03-01",
                "status": '1',
                "memo": "收款行总行",
                "orig_url": "http://yaya12.com",
            }, {
                "id": 11111115,
                "name": "渠道名称",
                "start_time": "2017-03-01", // 交易日期
                "end_time": "2017-03-01",
                "update_time": "2017-03-01",
                "status": '0',
                "memo": "收款行总行",
                "orig_url": "http://yaya12.com",
            }, {
                "id": 11111115,
                "name": "渠道名称",
                "start_time": "2017-03-01", // 交易日期
                "end_time": "2017-03-01",
                "update_time": "2017-03-01",
                "status": '1',
                "memo": "收款行总行",
                "orig_url": "http://yaya12.com",
            }, ];
            _this.table_data = _this.trades;
            _this.pages_all = 100;
        },
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
</style>
