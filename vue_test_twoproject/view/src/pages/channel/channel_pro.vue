<template>
    <div>
        <!-- 图片上传，保存ajax -->
        <div class="right_head">
            增值产品
        </div>
        <div class="right_body">
            <template>
                <el-table :data="products" ref="products" border stripe style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" :selectable="if_check">
                    </el-table-column>
                    <el-table-column prop="product_id" label="产品编号" resizable min-width="120px">
                    </el-table-column>
                    <el-table-column prop="name" label="产品名称" resizable min-width="100px">
                    </el-table-column>
                    <el-table-column prop="intro" label="产品简介" resizable min-width="170px">
                    </el-table-column>
                </el-table>
            </template>
            <el-form label-width="125px" class="demo-ruleForm">
                <div class="mar_t20 t_c">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24">
                        <el-button type="primary" @click="mend">修改</el-button>
                        <el-button @click="goback">返回</el-button>
                    </el-col>
                </div>
            </el-form>
        </div>
        <load :visible="loading"></load>
        <toast :msg="toastmsg" :visible="visible_toast" @on-visible-change="onVisibleChange" @on-msg-change="onMsgChange"></toast>
    </div>
</template>
<script>
export default {
    name: 'channel_pro',
    data() {
        return {
            loading: false, //load是否显示
            toastmsg: '', //提示文字
            visible_toast: false, //toast是否显示
            check_all: false, //全选
            products: [], //ajax获取
            product: [], // 要开通的增值产品(product_id)列表
            product_start:0,//最初已选中的长度
            products_url: location.protocol + '//' + location.host + '/qudao/v1/api/qd/' + this.$route.params.userid + '/product_info', //获取特定渠道的已开通的增值产品列表  
        }
    },
    created: function() {
        this.get_products(); //获取特定渠道的已开通的增值产品列表
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
        mend: function() {
            var _this = this;
            if (_this.product.length <= _this.product_start) {
                _this.toastmsg = '请选择增值产品！';
                _this.visible_toast = true;
                return false;
            }
            //console.log(_this.product);
            //提交修改ajax--todo
            _this.fix_base();
        },
        //修改特定渠道的基本信息
        fix_base: function() {
            let _this = this;
            let post_data = {
                product:_this.product,
            };
            this.$http.post(this.products_url, post_data, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    let data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.visible_toast = true;
                        _this.toastmsg = '开通成功!';
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
        goback: function() {
            this.$router.go(-1);
        },
        //选择监听事件
        handleSelectionChange(val) {
            let _this = this;
            let select_val = val;
            _this.product = [];
            _this.multipleSelection = val;
            for (let i = 0; i < select_val.length; i++) {
                let id = select_val[i].product_id;
                _this.product.push(id);
            }
            //console.log(_this.product);
        },
        //判断checkbox是否可以点击
        if_check(row, index) {
            let row_val = row;
            let _this = this;
            if (row_val.__ob__.value.status == '0') {
                return false;
            } else {
                return true;
            }
        },
        //获取特定渠道的可用的增值产品列表
        get_products: function() {
            var _this = this;
            this.$http.get(this.products_url, {
                    before: function() {
                        _this.loading = true;
                    }
                })
                .then(function(response) {
                    _this.loading = false;
                    var data_return = response.body;
                    if (data_return.respcd == '0000') {
                        _this.products = data_return.data;
                        setTimeout(() => {
                            for (let i = 0; i < _this.products.length; i++) {
                                if (_this.products[i].status == '0') {
                                    _this.product.push(_this.products[i].product_id);
                                    _this.product_start++;
                                    _this.$refs.products.toggleRowSelection(_this.products[i], true);
                                }
                            }
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
            // setTimeout(() => {
            //     _this.getval_test();
            // }, 0);
        },
        //测试数据
        getval_test: function() {
            var _this = this;
            _this.products = [{
                "userid": 123, // 渠道编号
                "product_id": 12344, // 产品编号
                "name": "会员体系", // 产品名称
                "intro": "简介", // 产品简介
                "status": 0, // 开通状态: 0 已开通, 1 未开通
            }, {
                "userid": 123, // 渠道编号
                "product_id": 33355, // 产品编号
                "name": "会员体系", // 产品名称
                "intro": "简介", // 产品简介
                "status": 0, // 开通状态: 0 已开通, 1 未开通
            }, {
                "userid": 123, // 渠道编号
                "product_id": 44466, // 产品编号
                "name": "会员体系", // 产品名称
                "intro": "简介", // 产品简介
                "status": 1, // 开通状态: 0 已开通, 1 未开通
            }, {
                "userid": 123, // 渠道编号
                "product_id": 555, // 产品编号
                "name": "会员体系", // 产品名称
                "intro": "简介", // 产品简介
                "status": 1, // 开通状态: 0 已开通, 1 未开通
            }, {
                "userid": 123, // 渠道编号
                "product_id": 666, // 产品编号
                "name": "会员体系", // 产品名称
                "intro": "简介", // 产品简介
                "status": 0, // 开通状态: 0 已开通, 1 未开通
            }];
            //console.log(_this.$refs.products);
            // for (let i = 0; i < _this.products.length; i++) {
            //     if (_this.products[i].status == '0') {
            //         _this.product.push(_this.products[i].product_id);
            //         _this.$refs.products.toggleRowSelection(_this.products[i], true);
            //     }
            // }
            setTimeout(() => {
                for (let i = 0; i < _this.products.length; i++) {
                    if (_this.products[i].status == '0') {
                        _this.product.push(_this.products[i].product_id);
                        _this.product_start++;
                        _this.$refs.products.toggleRowSelection(_this.products[i], true);
                    }
                }
            }, 0);
        },
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
</style>
