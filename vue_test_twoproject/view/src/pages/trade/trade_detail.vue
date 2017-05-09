<template>
    <div>
        <div class="right_head">
            交易明细 --
            <span v-if="detail.trade_status=='成功'" class="orange">{{detail.trade_status}}</span><span class="red" v-else>{{detail.trade_status}}</span> 
        </div>
        <div class="right_body">
            <el-form ref="trade" label-width="125px" class="demo-ruleForm">
                <el-row>
                    <div class="step_show detail_page">
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="商户编号：">
                                <span class="word">{{detail.mchnt_uid}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="商户名称：">
                                <span class="word">{{detail.mchnt_name}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="交易流水号：">
                                <span class="word">{{detail.trade_syssn}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="交易金额：">
                                <span class="word">{{(detail.trade_amt/100).toFixed(2)}}元</span>
                            </el-form-item>
                        </el-col>
                       <!--  <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="手续费：">
                                <span class="word">{{(detail.trade_fee/100).toFixed(2)}}元</span>
                            </el-form-item>
                        </el-col> -->
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="交易时间：">
                                <span class="word">{{detail.trade_dtm}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="交易类型：">
                                <span class="word">{{detail.trade_type}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="交易状态：">
                                <span class="word">{{detail.trade_status}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="交易描述：">
                                <span class="word">{{detail.trade_msg}}</span>
                            </el-form-item>
                    </div>
                    <div class="m_t_20 t_c">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24">
                            <el-button @click="goback">返回</el-button>
                        </el-col>
                    </div>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'trade_detail',
    data() {
        return {
            detail: {
                "qudao_uid": 0, // 渠道 userid
                "qudao_name": "", // 渠道名
                "mchnt_uid": 0, // 商户 userid
                "mchnt_name": "", // 商户名
                "trade_syssn": "", // 交易流水号
                "trade_amt": 0, // 交易金额, 单位为分
                "trade_fee": 0, // 手续费, 单位分
                "trade_dtm": "", // 交易时间
                "trade_type": "", // 交易类型
                "trade_status": "", // 交易状态
                "trade_msg": "", // 交易失败原因
                "mchnt_mobile": "", // 手机号
            },
        }
    },
    created: function() {
        this.detail = this.$store.state.trade_detail;
    },
    methods: {
        goback: function() {
            this.$router.go(-1);
        },
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
</style>
