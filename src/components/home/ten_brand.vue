<template>
    <div class="ten-list">
        <!-- <div class="tips">
            <ul>
                <li>集成墙面</li>
                <li>集成墙面</li>
                <li>集成墙面</li>
            </ul>
        </div> -->
        <div class="list">
            <ul><!-- v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30" infinite-scroll-immediate-check="false"-->
                <li v-for="(item,index) in brandList" :key='index' @click="brandDetial(item.brand_id)">
                    <div style="height:100%;width:100%;background-color:#fff;border-radius:3px;">
                        <div class="brandlogo"><img :src="item.brand_logo" width="100%" height="100%"/></div>
                        <div class="votelogo" @click.stop="vote(item.brand_id)"><img src='@/assets/images/vote.png' width="100%" height="100%"/></div>
                    </div>
                    
                </li>
            </ul>
        </div>

                <!-- 点赞弹窗 -->
    <mt-popup v-model="voteVisible" popup-transition="popup-fade" class="votepopup">
        <div><img src='@/assets/images/vote_1.png' width="100%"></div>
    </mt-popup>

    <mt-popup v-model="votedVisible" popup-transition="popup-fade" class="votepopup">
        <div><img src='@/assets/images/vote_2.png' width="100%"></div>
    </mt-popup>
    </div>
</template>

<script>
import { Toast,InfiniteScroll} from 'mint-ui';
import { setTimeout } from 'timers';
export default {
    components:{InfiniteScroll},
    data(){
        return{
            token:'',
            type_id:'',
            //品牌列表
            brandList:[],
            currentPage:1,
            total:0,
            last_page:0,
            loading:false,
            //点赞
            voteVisible:false,
            votedVisible:false
        }
    },
    watch: {
        '$route' (to, from){
            if(to.params.typeId){
                this.type_id = to.params.typeId;
                this.getBrandList();
            }
        }
    },
    mounted(){
        this.token = window.localStorage.getItem('token');
        this.type_id = this.$route.params.typeId;
        this.getBrandList();
    },
    methods:{
        //列表
        getBrandList(){
            let that = this;
            that.brandList = [];
            let params = {
                token:that.token,
                currentPage:that.currentPage,
                tag_id:1,
                per_page:10,
                order_type:'created_at'
            }
            if(that.type_id){
                params.type_id = that.type_id;
            }
            that.$http.get('/api/frontend/heat_search/brand/lists',{params}).then(response=>{
                if(response.data.msg_code===100000){
                    //that.brandList = that.brandList.concat(response.data.response.data);
                    that.brandList = response.data.response.data
                    // .map(item=>{
                    //     item.brand_logo = JSON.parse(item.brand_logo);
                    //     return item;
                    // });
                    that.total = response.data.response.total;
                    that.last_page = response.data.response.last_page;
                    that.loading = false;
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
        //加载更多
        // loadMore(){
        //     this.currentPage +=1;
        //     if(this.last_page>1){
        //         this.loading = true,
        //         setTimeout(this.getBrandList(), 2500);
        //     }
            
        // },
        //投票
        vote(id){
            let that = this;
            that.$http.post('/api/frontend/heat_search/brand/vote',{
                token:that.token,
                //type_id:type_id,
                id:id
            }).then(response=>{
                if(response.data.msg_code===100000){
                    that.voteVisible = true;
                    setTimeout(()=>{
                        that.voteVisible = false;
                        that.getBrandList();
                    },1500)
                }else if(response.data.msg_code===200003){
                    that.votedVisible = true;
                    setTimeout(()=>{
                        that.votedVisible = false;
                    },1500)
                }else{
                    Toast({
                        message: response.data.message,
                        position: 'middle',
                        duration: 2000
                    });
                }
            }).catch(function(error){
                Toast(error , '警告', {
                    confirmButtonText: '确定',
                    callback: action => {
                    }
                });
            })

        },
        
        //品牌详情
        brandDetial(id){
            let that = this;
            that.$router.push({path:'/branddetail/'+id})
        }
    }
    
}
</script>


<style scoped lang='less'>
.ten-list{
    height: 100%;
    width:100%;
    .tips{
        height:1rem;
        ul{
            li{
                float: left;
                color:#c99549;
                font-size:.4rem;
                line-height:1rem;
                padding-left:10px;
            }
        }
    }
    .list{
        height:100%;
        overflow: hidden;
        overflow-y:auto;
        padding: 0 .2rem .2rem .2rem;
        box-sizing: border-box;
        ul{
            li{
                width: 49%;
                height: 3.5rem;
                float: left;
                box-sizing:border-box;
                //border-radius:3px;
                margin-top:2%;
                //background-color: #fff;
                div{
                    text-align:center;
                    color:#946821;
                    font-size:.4rem;
                    //float: left;
                }
                .brandlogo{
                    height: 2.1rem;
                    width: 3.5rem;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    /* padding: 2%; */
                    margin: 0 auto;
                    margin-top: 4%;
                    display: inline-block;
                }
                .votelogo{
                    height: calc(100% - 8% - 2.1rem);
                    width: 100%;
                    padding: 5% 40%;
                    box-sizing: border-box;
                }
            }
            :nth-child(2n){
                margin-left:2%;
            }
        }
    }
    /*点赞*/
.votepopup{
    width: 70%;
    box-sizing: border-box;
    padding:20px; 
    background:none;
}
.votepopup div:last-child{
    margin-top:20px;
}
}
</style>