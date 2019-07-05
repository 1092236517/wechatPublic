<template>
<div class="detail_container">
    <div class="cont_card">
        <div class="share">
            <span class="beforBtn" @click='beforClick();'>＜</span>
            <div class="sharbtn" @click="share"><span>分享</span><img src='@/assets/images/share.png'></div>
        </div>
        <div class="title">{{company_name}}</div>
        <div class="logo"><img :src="brand_logo"></div>
        <div class="word">
            {{brand_description}}
        </div>
        <div class="logo" v-for="(item,index) in brand_pics" :key='index'><img :src="item.photo"></div>
        <div class="btns">
            <button type="button" @click="vote()">为TA点赞</button>
            <button type="button" @click="applyjoin()">申请加盟</button>
        </div>

        <!-- 加盟 -->
        <mt-popup v-model="joinVisible" class="popup" :closeOnClickModal="false">
            <i class="iconfont icon-close" style="position:absolute;top: 3%;right: 4%;cursor:pointer" @click="joinVisible = false"></i>
            <div class = "rule_title">
                加盟通道  
            </div>
            <img src="@/assets/images/rule_line.jpg" width="100%">
            <div class = "rule_contend">
                <form>
                    <div class="form-item">
                        <span style='color:red;display:inline;width:0;text-align:right;margin-left:2%;'>*</span><span>手机：</span>
                        <input type="text" v-model.trim="phone" ref='input' placeholder="请输入手机号" @focus="gotoView" @blur="gotoView">
                    </div>
                    <div class="form-item">
                        <span style='color:red;display:inline;width:0;text-align:right;margin-left:2%;'>*</span><span>姓名：</span>
                        <input type="text" v-model.trim="contact_name" ref='input' placeholder="请输入姓名" @focus="gotoView" @blur="gotoView">
                    </div>
                    <div class="form-item">
                        <span style="display:inline;width:0;margin-left:2%;">&nbsp;</span><span>备注：</span>
                        <textarea v-model.trim="remark" ref='input' placeholder="请输入备注" @focus="gotoView" @blur="gotoView"></textarea>
                        <!-- <input type="textarea" v-model="remark"> -->
                    </div>
                    <div class="form-item">
                        <button type="button" @click="submitJoin">申请加盟</button>
                    </div>

                </form>
            </div>
        </mt-popup>
        
        <!-- 点赞 -->
        <mt-popup v-model="voteVisible"  popup-transition="popup-fade" class="votepopup">
            <div><img src='@/assets/images/vote_1.png' width="100%"></div>
        </mt-popup>

        <mt-popup v-model="votedVisible" popup-transition="popup-fade" class="votepopup">
            <div><img src='@/assets/images/vote_2.png' width="100%"></div>
        </mt-popup>

        <mt-popup v-model="shareVisible" popup-transition="popup-fade" class="sharepop" position='top'>
            <div style="width: 276px;"><img src='@/assets/images/sharebg.png' width="100%"></div>
        </mt-popup>
    </div>
</div>
</template>

<script>
import {Toast} from 'mint-ui';
import wx from 'weixin-js-sdk';
export default {
    data(){
        return{
            token:'',
            id:'',
            //详情
            brand_logo:"",
            brand_pics:[],
            brand_description:"",
            company_name:"",
            //加盟弹窗
            joinVisible:false,
            contact_name:'',
            phone:'',
            remark:'',
            //点赞
            voteVisible:false,
            votedVisible:false,
            //分享
            shareVisible:false,
        }
    },
    mounted(){
        this.id = this.$route.params.id;
        this.token = window.localStorage.getItem('token');
        this.getDetial()
    },
    methods:{
        //ios软键盘
        gotoView (event) {
            let This = event.currentTarget;
            setTimeout(() => {
                This.scrollIntoView({
                    block: 'end',
                    behavior: 'smooth'
                });
            }, 500);
        },
        //返回
        beforClick(){
            let that = this;
            that.$router.go(-1)
        },
        //获取详情
        getDetial(){
            let that = this;
            let params = {
                token:that.token,
                id :that.id
            }
            that.$http.get("/api/frontend/heat_search/brand/detail",{params}).then(response=>{
                if(response.data.msg_code===100000){
                    let detialData = response.data.response;
                    if(detialData.detail){
                        that.brand_logo = detialData.detail.brand_logo;
                        that.brand_pics = detialData.detail.pics;
                        that.brand_description = detialData.detail.brand_description;
                        that.company_name = detialData.company_name;
                    }else{
                        Toast({
                            message:"暂无品牌详情",
                            position: 'middle',
                            duration: 2000
                        });
                    }
                    
                }else{
                    Toast({
                        message:response.data.message,
                        position: 'middle',
                        duration: 2000
                    });
                }
            }).catch(error=>{
                console.log(error);
                Toast({
                    title:'警告',
                    message:error,
                    position: 'middle',
                    duration: 2000
                });
            })

        },
        //加盟
        applyjoin(){
            let that = this;
            that.contact_name = '';
            that.phone = '';
            that.remark = '';
            that.joinVisible = true;
        },
        submitJoin(){
            let that = this;
            if(!that.contact_name||!that.phone){
                Toast({
                    message: '信息录入不完整',
                    position: 'middle',
                    duration: 2000
                });
                return false;
            }else if(!(/^1[34578]\d{9}$/.test(that.phone))){
                Toast({
                    message: '手机号码有误',
                    position: 'middle',
                    duration: 2000
                });
                return false;
            }else{
            that.$http.post('/api/frontend/heat_search/brand/apply',{
                token:that.token,
                contact_name:that.contact_name,
                contact_phone:that.phone,
                contact_remark:that.remark,
            }).then(response=>{
                if(response.data.msg_code===100000){
                    Toast({
                        message: '申请成功',
                        position: 'middle',
                        duration: 2000
                    });
                    that.joinVisible = false;
                }else{
                    Toast({
                        message:response.data.message,
                        position: 'middle',
                        duration: 2000
                    });
                }
                }).catch(error=>{
                    console.log(error);
                    Toast({
                        title:'警告',
                        message:error,
                        position: 'middle',
                        duration: 2000
                    });
                })
            }
            
        },
        //点赞
        vote(){
            let that = this;
            that.$http.post('/api/frontend/heat_search/brand/vote',{
                token:that.token,
                id:that.id
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
                Toast({
                    title:'警告',
                    message:error,
                    position: 'middle',
                    duration: 2000
                });
            })
        },
        //分享
        share(){
            this.shareVisible = true;
            // let _this = this;
            // console.log(
            //     {
            //         debug: window.localStorage.getItem('debug'), // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            //         appId: window.localStorage.getItem('appId'), // 必填，公众号的唯一标识
            //         timestamp: window.localStorage.getItem('timestamp'), // 必填，生成签名的时间戳
            //         nonceStr: window.localStorage.getItem('nonceStr'), // 必填，生成签名的随机串
            //         signature: window.localStorage.getItem('signature'),// 必填，签名，见附录1
            //         jsApiList: JSON.parse(window.localStorage.getItem('jsApiList'))
            //     }
            // )
            // wx.config({
            //     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            //     appId: "wx3ee4b2dc32844eb9", // 必填，公众号的唯一标识
            //     timestamp: "1546916519", // 必填，生成签名的时间戳
            //     nonceStr: "PVAHTmh59p", // 必填，生成签名的随机串
            //     signature: "982d29cd8820da366f6cc6e7990ba90dcdf032da",// 必填，签名，见附录1
            //     jsApiList: [
            //         "onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo"
            //     ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            // });


            // //处理验证失败的信息
            // wx.error(function (res) {
            //     console.log('验证失败返回的信息:',res);
            // });
            // //处理验证成功的信息
            // wx.ready(function () {
            // //alert(window.location.href.split('#')[0]);
            // //分享到朋友圈
            // wx.onMenuShareTimeline({
            //     title: _this.company_name, // 分享标题
            //     link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            //     imgUrl: _this.brand_logo, // 分享图标
            //     success: function (res) {
            //         // 用户确认分享后执行的回调函数
            //         console.log("分享到朋友圈成功返回的信息为:",res);
            //         _this.Toast({
            //             title:'提示',
            //             message:分享成功,
            //             position: 'middle',
            //             duration: 2000
            //         });
            //     },
            //     cancel: function (res) {
            //     // 用户取消分享后执行的回调函数
            //     console.log("取消分享到朋友圈返回的信息为:",res);
            //     }
            // });
            // //分享给朋友
            // wx.onMenuShareAppMessage({
            //     title: _this.company_name, // 分享标题
            //     desc: _this.brand_description, // 分享描述
            //     link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            //     imgUrl: _this.brand_logo, // 分享图标
            //     type: '', // 分享类型,music、video或link，不填默认为link
            //     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            //     success: function (res) {
            //     // 用户确认分享后执行的回调函数
            //     console.log("分享给朋友成功返回的信息为:",res);
            //     },
            //     cancel: function (res) {
            //     // 用户取消分享后执行的回调函数
            //     console.log("取消分享给朋友返回的信息为:",res);
            //     }
            // });
            // //分享到QQ
            // wx.onMenuShareQQ({
            //     title: _this.company_name, // 分享标题
            //     desc: _this.brand_description, // 分享描述
            //     link: window.location.href.split('#')[0], // 分享链接
            //     imgUrl: _this.brand_logo, // 分享图标
            //     success: function (res) {
            //     // 用户确认分享后执行的回调函数
            //     console.log("分享到QQ好友成功返回的信息为:",res);
            //     },
            //     cancel: function (res) {
            //     // 用户取消分享后执行的回调函数
            //     console.log("取消分享给QQ好友返回的信息为:",res);
            //     }
            // });

            // //分享到QQ空间
            // wx.onMenuShareQZone({
            //     title: _this.company_name, // 分享标题
            //     desc: _this.brand_description, // 分享描述
            //     link: window.location.href.split('#')[0], // 分享链接
            //     imgUrl: _this.brand_logo, // 分享图标
            //     success: function (res) {
            //     // 用户确认分享后执行的回调函数
            //     console.log("分享到QQ空间成功返回的信息为:",res);
            //     },
            //     cancel: function (res) {
            //     // 用户取消分享后执行的回调函数
            //     console.log("取消分享到QQ空间返回的信息为:",res);
            //     }
            // });
            // });
        }
    }

}
</script>

<style scoped lang='less'>
.detail_container{
    height: 100%;
    width: 100%;
    padding: .3rem .2rem;
    box-sizing: border-box;
    overflow: hidden;
    overflow-y: auto;
}

    /*加盟*/
    .mask{
        background-color: rgba(0,0,0,0.1);
        height: 100%;
        width: 100%;
        z-index: 99999;
    }
.popup{
    width: 70%;
    box-sizing: border-box;
    padding:20px;
    position: absolute;
}
.rule_title{
    font-size: .5rem;
    text-align: center;
    font-weight:600;
    /* border-bottom: 1px solid black; */
}
    /*点赞*/
    .votepopup{
        width: 70%;
        box-sizing: border-box;
        padding:20px; 
        background:none;
        :last-child{
            margin-top:20px;
        }
    }
    //分享
    .sharepop{
        background-color: rgba(0, 0, 0, 0);
        left: 67%;

    }
    .cont_card{
        background-color: #fff;
        border-radius: 10px;
        width:100%;
        .share{
            height: 1rem;
            width: 100%;
            text-align: right;
            line-height:1rem;
            font-size: .35rem;
            cursor: pointer;
            .beforBtn{
                float: left;
                font-weight: 600;
                font-size: .5rem;
                cursor: pointer;
                margin-left: .1rem;
            }
            .sharbtn{
                float: right;
                cursor:pointer;
                img{
                    width: 28%;
                    height: 55%;
                    float: right;
                    margin-right: 10px;
                    margin-top: 8px;
                    margin-left: 5px;
                }

            }
            
            
        }
        .title{
            height: 1rem;
            line-height: 1rem;
            width: 100%;
            text-align: center;
            background-color: #e5b064;
            color:#000;
            font-weight: 600;
            font-size: .4rem;
        }
        .logo{
            height: 3rem;
            width: 5rem;
            margin: 0 auto;
            box-sizing: border-box;
            margin-top: 5%;
            margin-bottom: 5%;
            img{
                height: 100%;
                width: 100%;
            }
        }
        .word{
            padding: 0 10%;
            color: #5c5c5c;
            font-size: .35rem;
            text-indent: .5rem;
            line-height: .5rem;
            letter-spacing: 1px;
            font-weight: 600;
            display: inline-block;
        }
        .btns{
            height: 2rem;
            width: 100%;
            padding: 0 1rem;
            box-sizing: border-box;
            line-height: 2rem;
            text-align: center;
            button{
                background-color: #e5b064;
                border-radius: 50px;
                color:#fff;
                height: 1rem;
                line-height: 1rem;
                border: 1px solid #e5b064;
                cursor: pointer;
                width: 40%;
                
            }
            :last-child{
                margin-left: 1rem;
            }
        }
    }
    

.form-item{
        background-color: #eee;
        color: #aaa;
        font-size: .3rem;
        border-radius: 10px;
        /* height: 1rem; */
        display: inline-block;
        width: 100%;
        line-height: 1rem;
        margin-top:10px;
        text-align: center;
    }
    .form-item span{
        float: left;
        display: inline-block;
        width: 18%;
        text-align: right;
    }
    .form-item input[type='text']{
        border: none;
        height: 1rem;
        color: #aaa;
        font-size: .3rem;
        background: none;
        width:77%;
        float: left;
    }
    .form-item textarea{
        border: none;
        color: #aaa;
        font-size: .3rem;
        background: none;
        width: 70%;
        height: 1.5rem;
        line-height: .5rem;
        margin-left: -.5rem;
        margin-top: 0.25rem;
    }
    .form-item:last-child{
        background:none;
    }
    .form-item button{
        background-color: #e5b064;
        border-radius: 10px;
        height: 1rem;
        line-height: 1rem;
        border: 1px solid #e5b064;
        cursor: pointer;
        width: 60%;
    }

</style>

