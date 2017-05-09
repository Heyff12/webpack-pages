<template>
    <div>
        <div class="right_head">
            公告管理
        </div>
        <div class="right_body">
            <template>
                <el-table :data="salesmen_now" border stripe style="width: 100%">
                    <el-table-column prop="title" label="公告标题" resizable min-width="360px">
                        <template scope="scope">
                            <el-button type="text" @click="open_dialog(scope.row)">{{scope.row.title}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" resizable min-width="120px">
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
        <bounced :visible="dialogslsm" :newclass="big_bounced">
            <span slot="header">公告详细<i class="close"  @click="dialogslsm = false"></i></span>
            <el-form label-width="80px" class="demo-ruleForm">
                <el-form-item label="公告标题">
                    <el-input v-model="now_notice.title" type="text" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="公告内容">
                    <el-input v-model="now_notice.content" type="textarea" :rows="6" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
        </bounced>
    </div>
</template>
<script>
export default {
    name: 'notice',
    data() {
        return {
            loading: false, //load是否显示
            toastmsg: '', //toast提示文字
            visible_toast: false, //toast是否显示
            dialogslsm: false, //业务员信息弹框默认不显示 
            big_bounced:'big_bounced',//注销弹框变大--样式 
            salesmen: [],
            slsm_url: location.protocol + '//' + location.host + '/qudao/v1/api/announcement/list', //获取列表 
            pages_all: 0, //总信息数
            page_per: 10, //每页信息数
            page_now: 1, //当前页数
            pages: 1, //总页数
            salesmen_mid: [], //搜索后的总信息
            salesmen_now: [], //当前展示信息
            now_notice:{
                "title":'',
                "content":'',
            },//当前选择的功能
        }
    },
    created: function() {
        this.get_list(); //获取商户列表  
    },
    watch: {
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
        //获取业务员管理列表
        get_list: function() {
            let _this = this;
            let post_data = {
                'page': _this.page_now,
                'page_size': _this.page_per,
            };
            this.$http.get(this.slsm_url, {
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
                        _this.salesmen_now = data_return.data.records;
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
        //更改每页显示信息条数
        handleSizeChange(val) {
            let _this = this;
            //console.log(`每页 ${val} 条`);
            _this.page_per = val;
            _this.page_now = 1;
            this.get_list();
        },
        //获取当前页信息
        handleCurrentChange(val) {
            //console.log(`当前页: ${val}`);
            let _this = this;
            _this.page_now = val;
            this.get_list();
        },
        //打开弹框
        open_dialog(row) {
            this.now_notice={
                "title":row.title,
                "content":row.content,
            };
            this.dialogslsm=true;
        },
        //列表测试数据--仅供测试
        getdata_test() {
            let _this = this;
            _this.salesmen = [{
                "title": "公告标题公告标题公告标题1",
                "content": "公告正文公告正文公告正文公告正文公告正文1",
                "create_time": "2017-05-01 00:00:00",
                "istop": 1,  // 是否置顶
            }, {
                 "title": "公告标题公告标题公告标题2",
                "content": "公告正文公告正文公告正文公告正文公告正文2",
                "create_time": "2017-05-01 00:00:00",
                "istop": 1,  // 是否置顶
            }, {
                "title": "公告标题公告标题公告标题3",
                "content": "公告正文公告正文公告正文公告正文公告正文3",
                "create_time": "2017-05-01 00:00:00",
                "istop": 0,  // 是否置顶
            }, {
                "title": "公告标题公告标题公告标题4",
                "content": "公告正文公告正文公告正文公告正文公告正文4",
                "create_time": "2017-05-01 00:00:00",
                "istop": 1,  // 是否置顶
            }, {
                 "title": "公告标题公告标题公告标题5",
                "content": "公告正文公告正文公告正文公告正文公告正文5",
                "create_time": "2017-05-01 00:00:00",
                "istop": 0,  // 是否置顶
            }, {
                "title": "公告标题公告标题公告标题6",
                "content": "公告正文公告正文公告正文公告正文公告正文6",
                "create_time": "2017-05-01 00:00:00",
                "istop": 1,  // 是否置顶
            }, {
                 "title": "公告标题公告标题公告标题7",
                "content": "公告正文公告正文公告正文公告正文公告正文7",
                "create_time": "2017-05-01 00:00:00",
                "istop": 1,  // 是否置顶
            }, {
                "title": "公告标题公告标题公告标题8",
                "content": "公告正文公告正文公告正文公告正文公告正文8",
                "create_time": "2017-05-01 00:00:00",
                "istop": 0,  // 是否置顶
            }, {
                "title": "公告标题公告标题公告标题9",
                "content": "公告正文公告正文公告正文公告正文公告正文9",
                "create_time": "2017-05-01 00:00:00",
                "istop": 1,  // 是否置顶
            }, {
                 "title": "公告标题公告标题公告标题10",
                "content": "公告正文公告正文公告正文公告正文公告正文10",
                "create_time": "2017-05-01 00:00:00",
                "istop": 0,  // 是否置顶
            },{
                "title": "公告标题公告标题公告标题11",
                "content": "公告正文公告正文公告正文公告正文公告正文11",
                "create_time": "2017-05-01 00:00:00",
                "istop": 1,  // 是否置顶
            }, {
                 "title": "公告标题公告标题公告标题",
                "content": "公告正文公告正文公告正文公告正文公告正文",
                "create_time": "2017-05-01 00:00:00",
                "istop": 1,  // 是否置顶
            }, {
                "title": "公告标题公告标题公告标题",
                "content": "公告正文公告正文公告正文公告正文公告正文",
                "create_time": "2017-05-01 00:00:00",
                "istop": 0,  // 是否置顶
            }, {
                "title": "公告标题公告标题公告标题",
                "content": "公告正文公告正文公告正文公告正文公告正文",
                "create_time": "2017-05-01 00:00:00",
                "istop": 1,  // 是否置顶
            }, {
                 "title": "公告标题公告标题公告标题",
                "content": "公告正文公告正文公告正文公告正文公告正文",
                "create_time": "2017-05-01 00:00:00",
                "istop": 0,  // 是否置顶
            },{
                "title": "公告标题公告标题公告标题",
                "content": "公告正文公告正文公告正文公告正文公告正文",
                "create_time": "2017-05-01 00:00:00",
                "istop": 1,  // 是否置顶
            }, {
                 "title": "公告标题公告标题公告标题",
                "content": "公告正文公告正文公告正文公告正文公告正文",
                "create_time": "2017-05-01 00:00:00",
                "istop": 1,  // 是否置顶
            }, {
                "title": "公告标题公告标题公告标题",
                "content": "公告正文公告正文公告正文公告正文公告正文",
                "create_time": "2017-05-01 00:00:00",
                "istop": 0,  // 是否置顶
            }, {
                "title": "公告标题公告标题公告标题",
                "content": "公告正文公告正文公告正文公告正文公告正文",
                "create_time": "2017-05-01 00:00:00",
                "istop": 1,  // 是否置顶
            }, {
                 "title": "公告标题公告标题公告标题",
                "content": "公告正文公告正文公告正文公告正文公告正文",
                "create_time": "2017-05-01 00:00:00",
                "istop": 0,  // 是否置顶
            }];
            _this.salesmen_mid = _this.salesmen;
            _this.pages_all = _this.salesmen_mid.length;
            _this.salesmen_now = _this.salesmen_mid.slice((_this.page_now - 1) * _this.page_per, _this.page_now * _this.page_per);
        },
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
</style>
