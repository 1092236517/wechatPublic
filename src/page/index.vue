<template>
    <div>
        <div class="content">
            <router-view/>
        </div>
        
        <div class="footer">
            <ul>
                <li @click="selectPage(1,'/ten_brand')">
                    <i class="iconfont icon-heart-fill" v-if="isSelect == 1"></i>
                    <i class="iconfont icon-heart" v-else></i>
                    <span>首页</span>
                </li>
                <li @click="selectPage(2,'/join')">
                    <i class="iconfont icon-smile-fill" v-if="isSelect == 2"></i>
                    <i class="iconfont icon-meh" v-else></i>
                    <span>招商加盟</span>
                </li>
                <li @click="selectPage(3,'/news')">
                    <i class="iconfont icon-read-fill" v-if="isSelect == 3"></i>
                    <i class="iconfont icon-read" v-else></i>
                    <span>筑牛资讯</span>
                </li>
            </ul>
        </div>


    </div>
</template>

<script>
export default {
    data(){
        return{
            isSelect:1,
        }
    },
    methods:{
        selectPage(index,path){
            let that = this;
            that.isSelect = index;
            that.$router.push({path:path});
        }

    },
    mounted(){
        let that = this;
        that.isSelect = that.$route.meta.indexnum;
        // window.localStorage.setItem('token','eyJpdiI6IlptUmhhMmx1Wld3N2FXNXFZV3BrYWc9PSIsInZhbHVlIjoieU5CUzRLM1I2ZmtKbzBNODhBRmo1aTFLdjVmWU1WUlY0NGFxdXlJQVc4cklDcXVORlZKcmNVcUtWQXZNWUpDaCJ9')
    }
}
</script>

<style scoped>
.content{
    height: calc(100% - 1.2rem);
    width: 100%;
    position:fixed;
}
.footer{
    position: fixed;
    bottom: 0;
    height: 1.2rem;
    width: 100%;
    background-color: #b2884c;
    color: #fff;
    font-size: .3rem;
}
.footer ul li{
    width: 33.33%;
    text-align: center;
    float: left;
    cursor: pointer;
}
.footer ul li i{
    display: inline-table;
    width: 100%;
    padding-top: .15rem;
    line-height: .5rem;
}
 
</style>


