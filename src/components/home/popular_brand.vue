<template>
    <div class="brand-list" :style='{height:containerHeight}'>
        <div class="brand-search">
            <div class="searchItem">
                <form @submit.prevent>
                    <span><img src="@/assets/images/search.png" width="100%" height="100%"></span>
                    <input v-model="brandname" type="search" placeholder="搜索品牌" ref="input" @keyup.13="searchBrandList()" v-on:input='searchBrandList()'>
                </form>
            </div>
        </div>
        <div class="list" ref="wrapper" :style="{ height: (wrapperHeight-50) + 'px' }"> <!--  -->
            <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange"  :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore" :auto-fill="false">
        
                <ul>
                    <li v-for="(item,index) in brandList" :key='index' @click="brandDetial(item.brand_id)">
                        <div style="height:100%;width:80%;float:left;box-sizing:border-box;">
                            <div class="brandlogo"><img :src="item.brand_logo" width="100%" height="100%"/></div>
                            <!-- <div class="brandlogo"><img src="@/assets/images/logo.jpg" width="100%" height="100%"/></div> -->
                            <div class="brandname">{{item.brand_name}}</div>
                        </div>
                        <div style="height:100%;width:20%;float:left;box-sizing:border-box;">
                            <div class="votelogo" @click.stop="vote(item.brand_id)"><img src='@/assets/images/vote.png' width="100%" height="100%"/></div>
                            <div class="votenum">{{item.total_vote_num || '0'}}</div>
                        </div>
                        
                        
                    </li>
                </ul>


                <div slot="top" class="mint-loadmore-top" style="text-align:center">
                    <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                    <span v-show="topStatus === 'loading'">
                        <mt-spinner type="snake"></mt-spinner>
                    </span>
                    <span class="mint-loadmore-text">{{ topText }}</span>
                </div>    


                <div slot="bottom" class="mint-loadmore-bottom">
                    <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                    <span v-show="bottomStatus === 'loading'">
                        <mt-spinner type="snake"></mt-spinner>
                    </span>
                    <span class="mint-loadmore-text">{{ bottomText }}</span>
                </div>

                <div v-if="allLoaded" style="text-align:center;" class="data-none">没有更多数据了</div>
            </mt-loadmore>
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
import {InfiniteScroll,Toast,Indicator } from 'mint-ui';
import { setTimeout } from 'timers';
export default {
    components:{InfiniteScroll},
    data(){
        return{
            token:'',
            type_id:'',
            //点赞弹窗
            voteVisible:false,
            votedVisible:false,
            //搜索
            brandname:'',
            //品牌列表
            containerHeight:'',
            brandList:[],
            allLoaded: false,
            bottomStatus: '',
            wrapperHeight: 0,
            topStatus: '',
            currentPage:1,
            total:0,
            last_page:0,

            topText: '',
            topPullText: '下拉刷新',
            topDropText: '释放更新',
            topLoadingText:  '加载中...',
            bottomText: '',
            bottomPullText:  '上拉刷新',
            bottomDropText:  '释放更新',
            bottomLoadingText:  '加载中...',
        }
    },
    watch: {
        '$route' (to, from){
            if(to.params.typeId){
                this.type_id = this.$route.params.typeId;
                this.currentPage = 1;
                this.brandList = [];
                this.getBrandList();
            }
        },
        topStatus(val) {
            switch (val) {
                case 'pull':
                    this.topText = this.topPullText;
                    break;
                case 'drop':
                    this.topText = this.topDropText;
                    break;
                case 'loading':
                    this.topText = this.topLoadingText;
                    break;
            }
        },
        bottomStatus(val) {
            switch (val) {
                case 'pull':
                    this.bottomText = this.bottomPullText;
                    break;
                case 'drop':
                    this.bottomText = this.bottomDropText;
                    break;
                case 'loading':
                    this.bottomText = this.bottomLoadingText;
                    break;
            }
        }
    },
    methods:{
        //列表
        getBrandList(){
            let that = this;
            let params = {
                token:that.token,
                current_page:that.currentPage,
                order_type:'created_at'
            }
            if(that.brandname){
                params.brand_name = that.brandname;
            }
            if(that.type_id){
                params.type_id = that.type_id;
            }
            that.$http.get('/api/frontend/heat_search/brand/lists',{params}).then(response=>{
                if(response.data.msg_code===100000){
                    //that.brandList = that.brandList.concat(response.data.response.data);
                    if(that.currentPage==1){
                        that.brandList = response.data.response.data
                    }else{
                        that.brandListMore = response.data.response.data;
                        that.brandList.push(...that.brandListMore)
                    }
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
        //搜索
        searchBrandList(){
            setTimeout(this.getBrandList(),2500);
        },
        //加载更多
        handleScroll (data) { // 执行函数
            let bigTopSize = document.querySelector('.container').getBoundingClientRect().top;
            if(bigTopSize>0){
                this.containerHeight = "calc(100% - "+bigTopSize+"px)"
            }else{
                this.containerHeight = '100%'
            }
        },
        handleBottomChange(status) {
            this.bottomStatus = status;
        },
        loadBottom() {
            this.handleBottomChange("loading");
            this.currentPage +=1;
            setTimeout(() => {
                if (this.currentPage*20<this.total) {
                    this.getBrandList();
                } else {
                    this.allLoaded = true;
                };
                this.handleBottomChange("loadingEnd");
                this.$refs.loadmore.onBottomLoaded();
            }, 500);
        },
        handleTopChange(status) {
            this.topStatus = status;
        },
        
        loadTop() {
            this.handleTopChange("loading");//下拉时 改变状态码
            this.currentPage = 1;
            this.allLoaded = false;
            setTimeout(() => {
                this.getBrandList();
                this.handleTopChange("loadingEnd");
                this.$refs.loadmore.onTopLoaded();
            //     if(this.currentPage>1){
            //         this.currentPage = 1;
            //         this.getBrandList();
            //         Toast({
            //             message: '刷新成功',
            //             position: 'middle',
            //             duration: 2000
            //         });
            //     }else{
            //         Toast({
            //             message: '已经到达顶部',
            //             position: 'middle',
            //             duration: 2000
            //         });
            //     }
            // this.$refs.loadmore.onTopLoaded();
            }, 500);
        },
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
    },
    mounted(){
        window.addEventListener('scroll', this.handleScroll, true)
        this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        this.token = window.localStorage.getItem('token')
        this.type_id = this.$route.params.typeId;
        this.currentPage = 1;
        this.brandList = [];
        this.getBrandList();
    },
    destroyed () { // 销毁绑定
       window.removeEventListener('scroll', this.handleScroll)
   }
    
    
}
</script>
<style>
.is-rotate{
    color:#946821;
}
.mint-loadmore-text{
    color:#946821;
}
.mint-loadmore-top{
    height: auto;
}
.mint-spinner-snake {
    border-top-color: #946821 !important;
    border-left-color: #946821 !important;
    border-bottom-color: #946821 !important;
    height: 15px !important;
    width: 15px !important;
    display: inline-block;
    vertical-align: middle;
    /* margin-left: 45%;
    margin-bottom: 3%;
    margin-top: 3%; */
}
</style>


<style scoped lang='less'>
.brand-list{
    // height: 100%;
    width:100%;
    overflow: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .brand-search{
        height: 1rem;
        box-sizing: border-box;
        padding: 0.1rem 0.2rem;
        // position: fixed;
        // width: 80%;
        .searchItem{
            background-color:#313131;
            height: .8rem;
            border-radius: 20px;
            line-height: .8rem;
            span{
                display: inline-block;
                height: 0.4rem;
                width: 0.4rem;
                margin: 0.1rem 0.2rem;
                float: left;
            }
            input{
                //height: .8rem;
                width:calc(100% - 1.1rem);
                color:#898989;
                background: none;
                border: none;
                font-size: .35rem;
                // padding: .2rem;
                line-height: .5rem;
            }
        }
    }
    .list{
        height: calc(100% - 1rem);
        // overflow: hidden;
        // overflow-y:auto;
        padding: 0 .2rem .2rem .2rem;
        box-sizing: border-box;
        // margin-top: 1rem;
        ul{
            li{
                height: 1.5rem;
                background-color: #fff;
                border-radius: 3px;
                margin-top: 5px;
                /* padding: 8px; */
                font-weight: 600;
                box-sizing: border-box;
                div{
                    text-align:center;
                    color:#946821;
                    font-size:.4rem;
                }
                .brandlogo{
                    width: 2.5rem;
                    height: 100%;
                    /* padding: 0 10%; */
                    /* -webkit-box-sizing: border-box; */
                    box-sizing: border-box;
                    float: left;
                    // margin-left: 3%;
                }
                .brandname{
                    height: 100%;
                    width: calc(100% - 3% - 2.5rem);
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    text-align: left;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    line-height: 1.5rem;
                    float: left;
                    padding: 0 2%;
                    margin-left: 3%;
                }
                .votenum{
                    width: 100%;
                    height: 30%;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    line-height: 15px;
                }
                .votelogo{
                    height: 70%;
                    width: 100%;
                    padding: 12% 27%;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    cursor: pointer;
                }
            }
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

</style>


