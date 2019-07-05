<template>
    <div class="join-contern">
        <div class="btns">
            <button @click="applyjoin(1)">申请加盟</button>
            <button @click="applyjoin(2)">申请招商</button>
        </div>

        <mt-popup v-model="popupVisible" class="popup" :closeOnClickModal="false">
            <i class="iconfont icon-close" style="position:absolute;top: 3%;right: 4%;cursor:pointer" @click="popupVisible = false"></i>
            <div class = "rule_title">
                {{title}}  
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
                        <button type="button" @click="submitJoin">{{submitBtn}}</button>
                    </div>

                </form>
            </div>
        </mt-popup>
        
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
export default {
    data(){
        return{
            token:'',
            //规则弹窗
            popupVisible:false,
            title:'',
            submitBtn:'',
            phone:'',
            contact_name:'',
            remark:'',
        }
    },
    mounted(){
        this.token = window.localStorage.getItem('token');
    },
    methods:{
        gotoView (event) {
            let This = event.currentTarget;
            setTimeout(() => {
                This.scrollIntoView({
                    block: 'end',
                    behavior: 'smooth'
                });
            }, 500);
        },
        applyjoin(num){
            let that = this;
            that.contact_name = '';
            that.phone = '';
            that.remark = '';
            if(num==1){
                that.title = "加盟通道";
                that.submitBtn = "申请加盟"
            }else if(num==2){
                that.title = "招商通道";
                that.submitBtn = "申请招商"
            }
            that.popupVisible = true;

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
                    that.popupVisible = false;
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
            
        }
    }

}
</script>

<style scoped>
    .join-contern{
        width: 100%;
        height: 100%;
        margin: 0;
        background:url('./../assets/images/joinbg.jpg') no-repeat top center /100% 100%;
    }
    .btns{
        position: absolute;
        bottom:10%;
        height: 2rem;
        width: 100%;
        padding: 0 1rem;
        box-sizing: border-box;
        line-height: 2rem;
        text-align: center;
    }
    .btns button{
        background-color: #e5b064;
        border-radius: 10px;
        height: 1.1rem;
        line-height: 1.1rem;
        border: 1px solid #e5b064;
        cursor: pointer;
        width: 40%;
    }
    .btns button:last-child{
        margin-left: 1rem;
    }
    .popup{
        width: 70%;
        box-sizing: border-box;
        padding:20px; 
    }
    .rule_title{
        font-size: .5rem;
        text-align: center;
        color: #000;
        font-weight: 600;
        /* border-bottom: 1px solid black; */
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
        /* line-height: 1rem; */
        border: 1px solid #e5b064;
        cursor: pointer;
        width: 60%;
    }
</style>

