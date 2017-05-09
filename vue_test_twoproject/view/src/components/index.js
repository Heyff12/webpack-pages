import Vue from 'vue'

//load
Vue.component('load', {
	props: ['visible'],
    template: '<div id="load_small_bg" v-show="visible"><div id="load_small"><i></i><br/><span>数据加载中</span></div></div>',
    data: function() {
        return {}
    }
})
//toast
Vue.component('toast', {
	props: ['msg', 'visible'],
    template: '<div class="toast_data_short" v-show="myvisible">{{mymsg}}<span class="close" v-on:click="close_toast">×</span></div>',
    data: function() {
        return {
            myvisible: this.visible ,//data中新增字段
            mymsg: this.msg //data中新增字段
        }
    },
    watch: {
        visible(val) {
            this.myvisible = val; //新增visible的watch，监听变更并同步到myvisible上
        },
        myvisible(val) {
            if(val==true){
                setTimeout(() => {
                  this.myvisible = false;
                  this.$emit("on-visible-change", val); //③组件内对myvisible变更后向外部发送事件通知
                }, 3000);
            }else{
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
})
//bounced
Vue.component('bounced', {
    props: ['visible','newclass'],
    template: '<div class="bounced_my" v-show="visible"><div class="bounced_my_body" v-bind:class="newclass"><header><slot name="header"></slot></header><main><slot></slot></main><footer><slot name="footer"></slot></footer></div></div>',
    data: function() {
        return {}
    }
})