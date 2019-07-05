<template>
<div class="home-content">
    <div class="banner">
        <img src="@/assets/images/banner.jpg" width="100%" height="100%">
        <!-- <div class='rule' @click="getRule">规则</div> -->
    </div>

    <img src="@/assets/images/rule_logo.jpg" class="rule" id="moveDiv"
      @mousedown="down" @touchstart="down"
      @mousemove="move" @touchmove="move"
      @mouseup="end" @touchend="end" @click="getRule"/>
    <div class="container">
        <router-view></router-view>
    </div>

    <!-- 规则弹窗 -->
    <mt-popup v-model="popupVisible" class="popup">
        <div class = "rule_title">
            活动规则  
        </div>
        <img src="@/assets/images/rule_line.jpg" width="100%">
        <div class = "rule_contend">
本栏目旨在帮助企业品牌推广，投票结果行业前十为“年度行业十大品牌”。品牌栏目会帮助品牌收录评测、资讯、视频、招商信息。
1、某一品牌详情,一个IP- -天能只能评选- -次
2、一个品牌分属多个行业，一个品牌一个行业能评选--次。<br/>
3、品牌热度=品牌指数X1 %+(品牌好评总数X1.2-品牌差评总数+评论次数X1.5)X99%
品牌指数是根据媒体评选给出的品牌指标。一般来说，媒体知名度越高品牌指数越高。包括品牌基本信息完善度和品牌相关信息(新闻、招商、测评、视频)完善度。
品牌评选总数数=该品牌累计获得好评数 
             
        </div>
    </mt-popup>
</div>

    
</template>

<script>
export default {
    data(){
        return{
            //规则弹窗
            popupVisible:false,
            //悬浮
            flags: false,
            position: { x: 0, y: 0 },
            nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
        }
    },
    methods:{
        // 实现移动端拖拽
        down(){
            this.flags = true;
            var touch;
            if(event.touches){
                touch = event.touches[0];
            }else {
                touch = event;
            }
            this.position.x = touch.clientX;
            this.position.y = touch.clientY;
            this.dx = moveDiv.offsetLeft;
            this.dy = moveDiv.offsetTop;
        },
        move(){
            if(this.flags){
            var touch ;
            if(event.touches){
                touch = event.touches[0];
            }else {
                touch = event;
            }
            this.nx = touch.clientX - this.position.x;
            this.ny = touch.clientY - this.position.y;
            this.xPum = this.dx+this.nx;
            this.yPum = this.dy+this.ny;
            moveDiv.style.left = this.xPum+"px";
            moveDiv.style.top = this.yPum +"px";
            //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
            document.addEventListener("touchmove",function(){
                event.preventDefault();
            },false);
            }
        },
        //鼠标释放时候的函数
        end(){
            this.flags = false;
        },
        //规则弹窗
        getRule(){
            this.popupVisible=true;
        }
    },
}
</script>

<style scoped lang='less'>
.home-content{
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
    overflow-y:auto;
    -webkit-overflow-scrolling: touch;
}
.banner{
    width: 100%;
    height:100px;
    margin: 0;
    position:relative;
}
@keyframes fade {
    from {
        opacity: 1.0;
    }
    to {
        opacity: 0.8;
    }
}

@-webkit-keyframes fade {
    from {
        opacity: 1.0;
    }
    to {
        opacity: 0.8;
    }
}
.rule{
    width: 36px;
    height: 36px;
    position: fixed;
    top: 80%;
    right: 2%;
    cursor: pointer;
    border-radius: 50%;
    background-color: #e4ae6e;
    line-height: 36px;
    text-align: center;
    color: #120000;
    font-size: .3rem;
    box-shadow:0 0 5px 2px #866941;
    z-index: 9999;
    // animation: fade 1000ms infinite;
    // -webkit-animation: fade 1000ms infinite;
}
/*规则*/
.popup{
    width: 70%;
    box-sizing: border-box;
    padding:20px; 
}
.rule_title{
    font-size: .5rem;
    text-align: center;
    font-weight:600;
    /* border-bottom: 1px solid black; */
}
.rule_contend{
    text-indent: .2rem;
}

.container{
    height: 100%;;
    background-color: #1b1b1b;
    box-sizing:border-box;
}

</style>



