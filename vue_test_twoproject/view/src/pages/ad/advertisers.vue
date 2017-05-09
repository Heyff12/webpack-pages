<template>
    <div>
        <div class="right_head">
            广告主管理
        </div>
        <div class="right_body time_date_short">
            <el-form label-width="100px" class="demo-ruleForm" :model="searchkey" :rules="searchkey_rule" ref="searchkey">
                <el-row :gutter="10">
                    <el-col :xs="24" :sm="24" :md="12" :lg="8">
                        <el-form-item label="广告主名称：" prop="name">
                            <el-input v-model.trim="searchkey.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8">
                        <el-form-item label="状态：" prop="status">
                            <el-select v-model="searchkey.status" placeholder="请选择状态">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="生效" value="1"></el-option>
                                <el-option label="失效" value="0"></el-option>
                            </el-select>
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
                    <el-table-column prop="id" label="广告主id" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="name" label="广告主名称" resizable min-width="130px">
                    </el-table-column>
                    <el-table-column prop="contacts" label="联系人" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="mobile" label="联系方式" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="memo" label="状态" resizable min-width="100px">
                        <template scope="scope">
                            <span v-if="scope.row.status">生效</span>
                            <span v-else>失效</span>
                        </template>
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
            <template v-if="add_or_fix">添加</template><template v-else>修改</template>广告主
            <i class="close"  @click="add_ad=false"></i>
            </span>
            <el-form :model="add_ader" :rules="add_ader_rules" ref="add_ader" label-width="100px" class="demo-ruleForm">
                <el-form-item label="广告主名称" prop="name">
                    <el-input v-model="add_ader.name" type="text" auto-complete="off"  @blur="if_right"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="addr">
                    <el-input v-model="add_ader.addr" type="text" auto-complete="off"  @blur="if_right"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contacts">
                    <el-input v-model="add_ader.contacts" type="text" auto-complete="off"  @blur="if_right"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="mobile">
                    <el-input v-model="add_ader.mobile" type="text" auto-complete="off"  @blur="if_right"></el-input>
                </el-form-item>
                <el-form-item label="官网地址" prop="demo_href">
                    <el-input v-model="add_ader.demo_href" type="text" auto-complete="off"  @blur="if_right"></el-input>
                </el-form-item>
                <el-form-item label="生效状态" prop="status">
                    <el-select v-model="add_ader.status" placeholder="请选择状态">
                        <el-option label="生效" value="1"></el-option>
                        <el-option label="失效" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="memo">
                    <el-input type="textarea" :rows="3" placeholder="请输入备注内容" v-model="add_ader.memo"  @blur="if_right">
                    </el-input>
                </el-form-item>
                <el-form-item label="">
                    <span class="bounced_button bounced_sure" v-bind:class="{bounced_sure_right:if_right_class}" @click="add_ader_sub">保存</span>
                    <span class="bounced_button bounced_cancle" @click="add_ad=false">取消</span>
                </el-form-item>
            </el-form>
        </bounced>
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
                'name': '',
                'status': '',
            },
            list_url: this.$store.state.ad_url + '/adv/owner/list', //获取交易列表 
            adder_url: this.$store.state.ad_url + '/adv/owner/create?format=cors', //增加广告主   
            adder_fix_url: this.$store.state.ad_url + '/adv/owner/edit?format=cors', //修改广告主         
            pages_all: 0, //总信息数
            pages: 1, //总页数
            page_per: 10, //每页信息数
            page_now: 1, //当前页数开始的信息条数次序
            table_data: [], //当前展示信息
            searchkey_rule: {
                name: [{
                    required: false,
                    message: '请输入广告主名称，长度在 1 到 30 个字符',
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
            now_id: '', //当前正在编辑的广告主id
            if_right_class: false, //弹框输入内容是否都正确，都正确，增加类 显示橙色，否则 灰色
            add_ader: {
                "name": "",
                "addr": "",
                "contacts": "",
                "mobile": "",
                "demo_href": "",
                "status": "1",
                "memo": "",
            },
            add_ader_rules: {
                name: [{
                    required: true,
                    //pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,30}$/,
                    //message: '请输入广告主名称，长度在 1 到 30 个字符(中文/英文/数字)',
                    message: '请输入广告主名称，长度在 1 到 30 个字符',
                    min: 1,
                    max: 30,
                    trigger: 'blur'
                }],
                addr: [{
                    required: false,
                    message: '请输入地址，长度在 0 到 30 个字符',
                    min: 0,
                    max: 30,
                    //message: '长度在 0 到 30 个字符',
                    trigger: 'blur'
                }],
                contacts: [{
                    required: true,
                    message: '请输入联系人，长度在 1 到 30 个字符',
                    min: 1,
                    max: 30,
                    trigger: 'blur'
                }],
                mobile: [{
                    required: true,
                    pattern: /(^(0\d{2,3}(-){0,1}){1}\d{7,8})(-\d{3,5}){0,1}$|^1[0-9]{10}$/,
                    message: '请输入联系方式，手机号或者座机号码',
                    trigger: 'blur'
                }],
                demo_href: [{
                    required: false,
                    message: '请输入官网地址，长度在 0 到 200 个字符',
                    min: 0,
                    max: 200,
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
            },
        }
    },
    created: function() {
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
                "format": 'cors',
            };
            //console.log(post_data);
            this.$http.get(this.list_url, {
                    'params': post_data,
                    'credentials': true,
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
        },
        //点击添加按钮
        add_open: function() {
            this.add_or_fix = true; //添加状态
            this.$refs.add_ader.resetFields(); //重置表单
            this.if_right_class=false;//确定按钮--恢复灰色
            this.add_ad = true; //打开弹框
        },
        //点击修改按钮
        fix_open: function(val) {
            //console.log(val);
            this.add_or_fix = false; //添加状态
            this.$refs.add_ader.resetFields(); //重置表单
            this.if_right_class=true;//确定按钮--显示橙色
            this.add_ader = {
                "name": val.name ? val.name : '',
                "addr": val.addr ? val.addr : '',
                "contacts": val.contacts ? val.contacts : '',
                "mobile": val.mobile ? val.mobile : '',
                "demo_href": val.demo_href ? val.demo_href : '',
                "status": val.status.toString(),
                "memo": val.memo ? val.memo : '',
            };//填充内容
            this.now_id = val.id; //获取当前广告主id
            this.add_ad = true; //打开弹框
        },
        //点击确定
        add_ader_sub: function() {
            let _this = this;
            this.$refs.add_ader.validate((valid) => {
                if (valid) {
                    _this.adder_sub();
                } else {
                    return false;
                }
            });
        },
        //提交新增加or修改的广告主信息
        adder_sub: function() {
            let _this = this;
            _this.add_ad = false; //关闭弹框
            let url_now;
            let post_data={};
            post_data = this.add_ader;
            if (this.add_or_fix) {
                url_now = this.adder_url;
                post_data.id = '';
            } else {
                url_now = this.adder_fix_url;
                post_data.id = this.now_id;
            }
            this.$http.post(url_now, post_data, {
                    'emulateJSON': true, //改数据格式application/x-www-form-urlencoded
                    'credentials': true, //加cookie跨域
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
        //列表测试数据--仅供测试
        getdata_test() {
            let _this = this;
            _this.trades = [{
                "ctime": "2017-03-01", // 交易日期
                "id": 11111115,
                "name": "商户名称",
                "contacts": "收款人",
                "mobile": "收款行总行",
                "memo": "开户行名称",
                "status": 0,
            }, {
                "ctime": "2017-03-01", // 交易日期
                "id": 11111115,
                "name": "商户名称",
                "contacts": "收款人",
                "mobile": "收款行总行",
                "memo": "开户行名称",
                "status": 1,
            }, {
                "ctime": "2017-03-01", // 交易日期
                "id": 11111115,
                "name": "商户名称",
                "contacts": "收款人",
                "mobile": "收款行总行",
                "memo": "开户行名称",
                "status": 0,
            }, {
                "ctime": "2017-03-01", // 交易日期
                "id": 11111115,
                "name": "商户名称",
                "contacts": "收款人",
                "mobile": "收款行总行",
                "memo": "开户行名称",
                "status": 1,
            }, {
                "ctime": "2017-03-01", // 交易日期
                "id": 11111115,
                "name": "商户名称",
                "contacts": "收款人",
                "mobile": "收款行总行",
                "memo": "开户行名称",
                "status": 0,
            }, {
                "ctime": "2017-03-01", // 交易日期
                "id": 11111115,
                "name": "商户名称",
                "contacts": "收款人",
                "mobile": "收款行总行",
                "memo": "开户行名称",
                "status": 1,
            }, {
                "ctime": "2017-03-01", // 交易日期
                "id": 11111115,
                "name": "商户名称",
                "contacts": "收款人",
                "mobile": "收款行总行",
                "memo": "开户行名称",
                "status": 0,
            }, {
                "ctime": "2017-03-01", // 交易日期
                "id": 11111115,
                "name": "商户名称",
                "contacts": "收款人",
                "mobile": "收款行总行",
                "memo": "开户行名称",
                "status": 1,
            }, {
                "ctime": "2017-03-01", // 交易日期
                "id": 11111115,
                "name": "商户名称",
                "contacts": "收款人",
                "mobile": "收款行总行",
                "memo": "开户行名称",
                "status": 1,
            }];
            _this.table_data = _this.trades;
            _this.pages_all = 100;
        },
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
.bounced_my .bounced_my_body.big_bounced.mar_t_exp {
    top: 10%;
}
</style>
