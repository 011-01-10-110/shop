// 引入接口
import {getRoleList} from '../../util/axios';

const state = {
    roleList:[]
}


const getters = {
    getRoleList(state){
        return state.roleList
    }
}


const mutations = {
    REQ_ROLELIST(state,payload){
        state.roleList = payload;
    }
}

const actions = {
    getRoleListAction({commit}){
        getRoleList()
        .then(res=>{
            // console.log(res);
            commit('REQ_ROLELIST',res.data.list)
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