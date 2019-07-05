import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import { Toast } from 'mint-ui'

import index from '@/page/index'
import home from '@/components/home'
import brand from '@/components/home/brand'
import ten_brand from '@/components/home/ten_brand'
import popular_brand from '@/components/home/popular_brand'
import branddetail from '@/components/home/branddetail'


import join from '@/components/join'
import news from '@/components/news'

Vue.use(Router)

const router =  new Router({
  routes: [
      {
        path: '/',
        redirect:'/ten_brand'
      },
      {
        path:'/index',
        name:index,
        component:index,
        meta:{
            noAuth:false,
        },
        children:[
            {
                path: '/home',
                name: 'home',
                component: home,
                meta:{
                    indexnum:1,
                    noAuth:false,
                },
                children:[
                    {
                        path: '/brand',
                        name: 'brand',
                        component: brand,
                        meta:{
                            indexnum:1,
                            noAuth:false,
                        },
                        children:[
                            {
                                path: '/ten_brand',
                                name: 'ten_brand',
                                component: ten_brand,
                                meta:{
                                    indexnum:1,
                                    indexN:'ten_brands',
                                    noAuth:false,
                                },
                            },
                            {
                                path: '/popular_brand',
                                name: 'popular_brand',
                                component: popular_brand,
                                meta:{
                                    indexnum:1,
                                    indexN:'popularity_brand',
                                    noAuth:false,
                                },
                            },
                            {
                                path: '/ten_brand/:typeId',
                                name: 'ten_brand',
                                component: ten_brand,
                                meta:{
                                    indexnum:1,
                                    indexN:'ten_brands',
                                    noAuth:false,
                                },
                            },
                            {
                                path: '/popular_brand/:typeId',
                                name: 'popular_brand',
                                component: popular_brand,
                                meta:{
                                    indexnum:1,
                                    indexN:'popularity_brand',
                                    noAuth:false,
                                },
                            },

                        ]
                    },
                    {
                        path: '/branddetail/:id',
                        name: 'branddetail',
                        component: branddetail,
                        meta:{
                            indexnum:1,
                            noAuth:false,
                        },
                    },
                    
                    
                ]
            },
            {
                path: '/join',
                name: 'join',
                component: join,
                meta:{
                    indexnum:2,
                    noAuth:false,
                }
            },
            {
                path: '/news',
                name: 'news',
                component: news,
                meta:{
                    indexnum:3,
                    noAuth:false,
                }
            },

      ]
      }
    
  ]
});

const GetQueryString = name=>{
    var url = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var newUrl = window.location.search.substr(1).match(url);
    if (newUrl != null) {
    return unescape(newUrl[2]);
    } else {
    return '';
    }
};
router.beforeEach(async (to, from, next) => {
    let isWeiXin = () => { return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1 };
    if(isWeiXin()){
        let token = window.localStorage.getItem('token'); //是否登录
        if(!token){
            const code = GetQueryString('code')// 截取url上的code ,可能没有,则返回''空字符串
            if(code){
                let params={
                    code:code
                }
                await axios.get('http://hsapi.zhuniu.com/api/frontend/heat_search/login',{
                    params
                }).then(response=>{if(response.data.msg_code===100000){
                        //that.$store.commit('userInfo', response.data.response);
                        window.localStorage.setItem('token',response.data.response.token)
                        //window.localStorage.setItem('config',JSON.stringify(response.data.response.config));
                        window.localStorage.setItem('debug',response.data.response.config.debug);
                        window.localStorage.setItem('appId',response.data.response.config.appId);
                        window.localStorage.setItem('timestamp',response.data.response.config.timestamp);
                        window.localStorage.setItem('nonceStr',response.data.response.config.nonceStr);
                        window.localStorage.setItem('signature',response.data.response.config.signature);
                        window.localStorage.setItem('jsApiList',JSON.stringify(response.data.response.config.jsApiList));
                        //next('/ten_brand');
                        window.location.href='http://hsf.zhuniu.com/#/ten_brand'
                    }else{
                        Toast({
                            message:response.data.message,
                            position: 'middle',
                            duration: 2000
                        });
                    }
                }).catch(error=>{
                    Toast({
                        title:'警告',
                        message:error,
                        position: 'middle',
                        duration: 2000
                    });
                })
            }else{
                let redirectUrl = window.location.href
                redirectUrl = encodeURIComponent("http://hsf.zhuniu.com")
                const appid='wx3ee4b2dc32844eb9'
                window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`
            }
        }else{
            next();
        }
    }else{
        return Toast('请在微信中打开');
    }
    
  })

  export default router
