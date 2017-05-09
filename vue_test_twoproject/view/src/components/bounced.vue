<template>
    <div class="bounced_my" v-show="visible">
        <div class="bounced_my_body" v-bind:class="newclass">
            <header>
                <slot name="header"></slot>
            </header>
            <main>
                <slot></slot>
            </main>
            <footer>
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>
    <!-- <div class="bounced_my">
        <div class="bounced_my_body">
            <header>
                <p class="bounced_text">
                    您确认要<i class="orange" v-if="oprate_if">开启</i><i class="orange" v-else>注销</i>该商户？
                </p>
            </header>
            <footer>
                <p>
                    <el-button @click="opratedialog = false">取 消</el-button>
                    <el-button type="primary" @click="mend_chan">确 定</el-button>
                </p>
            </footer>
        </div>
    </div> -->
</template>
<script>
export default {
    name: 'bounced',
    props: ['visible','newclass'],
    data() {
        return {}
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
.bounced_my {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 10;
    top: 0px;
    left: 0px;
    z-index: 20;
    font-size: 14px;
    &:after {
        content: '';
        background: black;
        opacity: 0.8;
        position: fixed;
        width: 100%;
        height: 100%;
    }
    .bounced_my_body {
        position: absolute;
        z-index: 21;
        width: 360px;
        padding:0 0 35px;
        background-color: white;
        border-radius: 3px;
        top: 40%;
        left: 50%;
        margin-left: -180px;
        header{
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 16px;
            border-bottom: 1px solid @border_color;
            position: relative;
            display: none;
            i.close{
                position: absolute;
                top:-100px;
                right: -100px;
                width: 20px;
                height: 20px;
                display: inline-block;
                background: url('./img/ic_close@3x.png') center center no-repeat;
                background-size: 20px auto;
            }
        }
        main{
            width: 100%;
            padding: 30px 35px;
            box-sizing: border-box;
        }
        footer {
            width: 100%;
            text-align: center;
        }
        //弹框中单行文字
        .bounced_text {
            width: 100%;
            text-align: center;
            line-height: 24px;
            font-size: 16px;
            i {
                font-style: normal;
            }
        }
        //弹框中底部按钮
        .bounced_button {
            display: inline-block;
            padding: 0 10px;
            width: 110px;
            text-align: center;
            height: 40px;
            line-height: 40px;
            margin: 0 10px;
            border-radius: 3px;
            color: white;
            cursor: pointer;
            &.bounced_sure {
                background-color: #8A8C92;
            }
            &.bounced_cancle {
                background-color: @orange;
            }
        }
        //大弹框
        &.big_bounced{
            width: auto;
            min-width: 460px;
            margin-left: -230px;
            top:30%;
            header{
                display: block;
            }
        }
    }
}
</style>
