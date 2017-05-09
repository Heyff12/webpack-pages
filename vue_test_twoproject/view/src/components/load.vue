<template>
    <div id="load_small_bg" v-show="visible">
        <div id="load_small"><i></i>
            <br/><span>数据加载中</span></div>
    </div>
</template>
<script>
export default {
    name: 'load',
    props: ['visible'],
    data() {
        return {}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
#load_small_bg {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 10;
    top: 0px;
    left: 0px;
    &:after {
        background: black;
        opacity: 0;
    }
    #load_small {
        width: 120px;
        height: 120px;
        text-align: center;
        line-height: 30px;
        padding-top: 40px;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -60px;
        margin-left: -60px;
        background: black;
        opacity: 0.7;
        z-index: 20;
        border-radius: 6px;
        font-size: 12px;
        span {
            color: white;
            display: none;
        }
        i {
            width: 35px;
            height: 35px;
            -webkit-animation: swiper-preloader-spin 1s steps(12, end) infinite;
            animation: swiper-preloader-spin 1s steps(12, end) infinite;
            display: inline-block;
            background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48IVtDREFUQVsKQGZvbnQtZmFjZSB7IGZvbnQtZmFtaWx5OiBpZm9udDsgc3JjOiB1cmwoaHR0cDovL2F0LmFsaWNkbi5jb20vdC9mb250XzE0NDIzNzM4OTZfNDc1NDQ1NS5lb3Q/I2llZml4KSBmb3JtYXQoZW1iZWRkZWQtb3BlbnR5cGUpLCB1cmwoaHR0cDovL2F0LmFsaWNkbi5jb20vdC9mb250XzE0NDIzNzM4OTZfNDc1NDQ1NS53b2ZmKSBmb3JtYXQod29mZiksIHVybChodHRwOi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTQ0MjM3Mzg5Nl80NzU0NDU1LnR0ZikgZm9ybWF0KHRydWV0eXBlKSwgdXJsKGh0dHA6Ly9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUuc3ZnI2lmb250KSBmb3JtYXQoc3ZnKTsgfQoKXV0+PC9zdHlsZT48L2RlZnM+PGcgY2xhc3M9InRyYW5zZm9ybS1ncm91cCI+PGcgdHJhbnNmb3JtPSJzY2FsZSgwLjE5NTMxMjUsIDAuMTk1MzEyNSkiPjxwYXRoIGQ9Ik0zOTcuMTUyIDE1OC4yNzJtLTE1Ni45OTIgMGE0LjkwNiA0LjkwNiAwIDEgMCAzMTMuOTg0IDAgNC45MDYgNC45MDYgMCAxIDAtMzEzLjk4NCAwWk0xNTEuMTM2IDQ2MS4yOG0tMTMyIDBhNC4xMjUgNC4xMjUgMCAxIDAgMjY0IDAgNC4xMjUgNC4xMjUgMCAxIDAtMjY0IDBaTTI1Ny45ODQgODAwLjI4OG0tMTE5LjAwOCAwYTMuNzE5IDMuNzE5IDAgMSAwIDIzOC4wMTYgMCAzLjcxOSAzLjcxOSAwIDEgMC0yMzguMDE2IDBaTTU2MS40NCA5MjAuMjg4bS0xMDIuNDMyIDBhMy4yMDEgMy4yMDEgMCAxIDAgMjA0Ljg2NCAwIDMuMjAxIDMuMjAxIDAgMSAwLTIwNC44NjQgMFpNODE2LjI1NiA3OTkuNTJtLTg4LjUxMiAwYTIuNzY2IDIuNzY2IDAgMSAwIDE3Ny4wMjQgMCAyLjc2NiAyLjc2NiAwIDEgMC0xNzcuMDI0IDBaTTkyOC45MjggNTc1LjIzMm0tNzUuOTM2IDBhMi4zNzMgMi4zNzMgMCAxIDAgMTUxLjg3MiAwIDIuMzczIDIuMzczIDAgMSAwLTE1MS44NzIgMFpNOTAwLjQ4IDM2NC4xOTJtLTU2LjkyOCAwYTEuNzc5IDEuNzc5IDAgMSAwIDExMy44NTYgMCAxLjc3OSAxLjc3OSAwIDEgMC0xMTMuODU2IDBaTTc3My43NiAyMTIuNzY4bS00Mi40OTYgMGExLjMyOCAxLjMyOCAwIDEgMCA4NC45OTIgMCAxLjMyOCAxLjMyOCAwIDEgMC04NC45OTIgMFoiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==");
            background-position: 50%;
            background-size: 100%;
            background-repeat: no-repeat;
        }
    }
}
@keyframes swiper-preloader-spin {
    100% {
        transform: rotate(360deg);
    }
}
</style>
