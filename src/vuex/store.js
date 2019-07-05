import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    mutations:{
        userInfo(state,data){
            if(data.token){
				window.localStorage.setItem('token', data.token);
            }
            state.token = data.token;
        }

    }
    
})

export default store