<template>
    <div class="toast_data_short" v-show="myvisible">{{mymsg}}<span class="close" v-on:click="close_toast">×</span></div>
</template>
<script>
export default {
    name: 'toast',
    props: ['msg', 'visible'],
    data() {
        return {
            myvisible: this.visible, //data中新增字段
            mymsg: this.msg //data中新增字段
        }
    },
    watch: {
        visible(val) {
            this.myvisible = val; //新增visible的watch，监听变更并同步到myvisible上
        },
        myvisible(val) {
            if (val == true) {
                setTimeout(() => {
                    this.myvisible = false;
                    this.$emit("on-visible-change", val); //③组件内对myvisible变更后向外部发送事件通知
                }, 3000);
            } else {
                this.$emit("on-visible-change", val); //③组件内对myvisible变更后向外部发送事件通知
            }
        },
        msg(val) {
            this.mymsg = val;
        },
        mymsg(val) {
            this.$emit("on-msg-change", val);
        },
    },
    methods: {
        close_toast: function() {
            this.mymsg = '';
            this.myvisible = false;
        },
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
/*没有更多数据了-----------------------------------------------*/

div.nomoredata {
    width: 3.6rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    color: white;
    font-size: 0.4rem;
    display: inline-block;
    background: black;
    position: fixed;
    z-index: 20;
    bottom: 1rem;
    border-radius: 3px;
    left: 50%;
    margin-left: -2rem;
    opacity: 0;
}

div.toast_data {
    width: auto;
    padding: 10px;
    height: auto;
    line-height: 21px;
    text-align: center;
    color: white;
    font-size: 16px;
    display: inline-block;
    background: #2F323A;
    position: fixed;
    z-index: 20;
    border-radius: 10px;
    opacity: 0;
    top: 50%;
    margin-top: -30px;
    left: 15px;
    right: 15px;
    z-index: -12;
}

div.toast_data_short {
    width: auto;
    min-width: 300px;
    padding: 20px;
    height: auto;
    line-height: 21px;
    text-align: center;
    color: white;
    font-size: 16px;
    display: inline-block;
    background: #2F323A;
    position: fixed;
    z-index: 20;
    border-radius: 10px;
    opacity: .86;
    top: 50%;
    left: 50%;
    margin-top: -30px;
    .close {
        position: absolute;
        top: 5px;
        right: 15px;
        font-size: 20px;
        color: white;
        opacity: 1;
    }
}
</style>
