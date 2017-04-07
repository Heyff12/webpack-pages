<template>
    <div>
        {{ word | lowercase }} {{ amount | currency }}
        <button class="b_click" v-on:key.enter="key_enter">点击enter键</button>
        <button class="b_click" v-on:click="b_click($event)" v-on:key.enter="key_enter">测试$event参数</button>
        <div id="demo_transition">
            <button v-on:click="show = !show">
                Toggle
            </button>
            <transition name="fade">
                <p v-if="show">hello+++Toggle</p>
            </transition>
            <transition name="slide-fade">
                <p v-if="show">hello+++Toggle render</p>
            </transition>
            <transition name="bounce">
                <p v-if="show">Look at me!</p>
            </transition>
        </div>
        <div class="example">{{ msg }}</div>
        <img src="../../assets/218.png">
        <div class="layer">
            <div>this is a layer333333333</div>
        </div>
        <div class="layer1">
            <div></div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
            return {
                msg: 'Hello world!',
                word: 'ABC',
                amount: 120,
                show: true,
            }
        },
        filters: {
            lowercase: function(value) {
                return value.toString().toLowerCase();
            },
            currency: function(value) {
                return (value / 100).toFixed(2)
            }
        },
        methods: {
            b_click: function(e) {
                console.log(e);
                console.log(e.target);
            },
            key_enter:function(){
                console.log('点击了enter键');
            },
        },
}
</script>
<style lang="less" rel="stylesheet/less">
@import './modal.less';
#demo_transition {
    width: 100%;
    height: 200px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s
}

.fade-enter,
.fade-leave-active {
    opacity: 0
}


/* 可以设置不同的进入和离开动画 */


/* 设置持续时间和动画函数 */

.slide-fade-enter-active {
    transition: all .3s ease;
}

.slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-active {
    transform: translateX(10px);
    opacity: 0;
}

.bounce-enter-active {
    animation: bounce-in .5s;
}

.bounce-leave-active {
    animation: bounce-out .5s;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.5);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes bounce-out {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.5);
    }
    100% {
        transform: scale(0);
    }
}

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
