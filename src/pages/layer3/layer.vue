<template>
    <div>
        <div class="example">{{ msg }}</div>
        <img src="../../assets/218.png">
        <div class="layer">
            <div>this is a layer33333333333333333333333</div>
        </div>
        <div class="layer1"><div></div></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            msg: 'Hello world!'
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less">
@import './modal.less';
.layer {
    width: 600px;
    height: 340px;
    background: green;
    img {
        width: 200px;
        height: auto;
    }
    div {
        width: 350px;
        height: 120px;
        font-size: 37.5px;
        border-top: 1px solid yellow;
        /*no*/
        background: url('../../assets/218.png') top left no-repeat red;
    }
}

.example {
    color: red;
}
</style>
