<template>
    <div class="brand_container">
        <div class='menuTitle'>
            <ul>
                <li @click="selectMenu('ten_brands',type_id)"><span :class="{selectli:isSelect =='ten_brands' }">十大品牌</span></li>
                <li @click="selectMenu('popularity_brand',type_id)"><span :class="{selectli:isSelect =='popularity_brand' }">人气品牌</span></li>
            </ul>
        </div>
        <div class="menuBrand">
            <div class='menuleft' >
                <ul>
                    <li v-for="(item,index) in tabList" :key="index" @click="selsctType(item.id)" :class="{select:type_id == item.id }">{{item.type_name}}</li>
                </ul>
            </div>
            <div class='menuright'>
                <router-view></router-view>
            </div>
            <div class="clear"></div>
        </div>
        
        
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
export default {
    data(){
        return{
            //两类品牌
            selectbrands:require('@/assets/images/leftSelect.png'),
            isSelect: 'ten_brands',
            type_id:0,
            tabList:[],
        }
    },
    mounted(){
        let that = this;
        that.isSelect = this.$route.meta.indexN;
        that.token = window.localStorage.getItem('token');
        that.getTabDetial();
        that.selectMenu(that.isSelect);
    },
    methods:{
        //tab列表
        getTabDetial(){
            let that = this;
            let params = {
                token:that.token
            }
            that.$http.get('/api/frontend/heat_search/type/lists',{params}).then(response=>{
                if(response.data.msg_code===100000){
                    that.tabList = response.data.response;
                }else{
                    Toast({
                        message:response.data.message,
                        position: 'middle',
                        duration: 2000
                    });
                }
            }).catch(function(error){
                console.log(error)
                Toast({
                    title:'警告',
                    message:error,
                    position: 'middle',
                    duration: 2000
                });
            })
        },
        //type选择
        selsctType(typeid){
            let that = this;
            that.type_id = typeid;
            if(that.isSelect=='ten_brands'){
                that.$router.push({path:'/ten_brand/'+typeid})
            }else if(that.isSelect=='popularity_brand'){
                that.$router.push({path:'/popular_brand/'+typeid})
            }
        },
        //两类品牌切换
        selectMenu(brandType){
            let that = this;
            if(that.type_id){
                if(brandType == 'ten_brands'){
                    that.selectbrands = require('@/assets/images/leftSelect.png');
                    that.isSelect = 'ten_brands';
                    that.$router.push({path:'/ten_brand/'+that.type_id})
                }else if(brandType == 'popularity_brand'){
                    that.selectbrands = require('@/assets/images/rightSelect.png');
                    that.isSelect = 'popularity_brand';
                    that.$router.push({path:'/popular_brand/'+that.type_id})
                }
            }else{
                if(brandType == 'ten_brands'){
                    that.selectbrands = require('@/assets/images/leftSelect.png');
                    that.isSelect = 'ten_brands';
                    that.$router.push({path:'/ten_brand'})
                }else if(brandType == 'popularity_brand'){
                    that.selectbrands = require('@/assets/images/rightSelect.png');
                    that.isSelect = 'popularity_brand';
                    that.$router.push({path:'/popular_brand'})
                }
            }
            
        },
    },
}
</script>

<style scoped lang='less'>

.clear{
   clear: both; 
}
.brand_container{
    height:100%;
    width:100%;
    .menuTitle{
        height: 1.2rem;
        width: 100%;
        ul{
            li{
                float: left;
                width: 50%;
                text-align: center;
                line-height: 1.2rem;
                color: #fff;
                font-size: .4rem;
            }
            .selectli{
                font-weight: 600;
                border-bottom: 1px solid #e5b064;
                line-height: .9rem;
                display: inline-block;
                width: 40%;
            }
        }
    }
    .menuBrand{
        height: calc(100% - 1.4rem);
        display: block;
        border-top:3px solid #272526;
        .menuleft{
            float: left;
            width: 20%;
            height: 100%;
            overflow: hidden;
            overflow-y: auto;
            ul{
                li{
                    color: #fff;
                    font-size: 0.35rem;
                    padding: 12px 10px;
                    //line-height: .8rem;
                    white-space: normal;
                }
                .select{
                    background-color: #272526;
                }
            }
        }
        .menuright{
            float: right;
            width: 80%;
            height: 100%;
            background-color: #272526;
        }
    }
}


</style>

