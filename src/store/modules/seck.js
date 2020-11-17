// 引入接口
import {getSeckList} from '../../util/axios';

const state = {
    seckList:[]
}


const getters = {
    getSeckList(state){
        return state.seckList
    }
}


const mutations = {
    REQ_SECKLIST(state,payload){
        state.seckList = payload;
    }
}

const actions = {
    getSeckListAction({commit}){
        getSeckList()
        .then(res=>{
            // console.log(res);
            commit('REQ_SECKLIST',res.data.list)
        })
    }
}

// 导出模块
export default {
    state,
    getters,
    mutations,
    actions,
    namespaced:true
}