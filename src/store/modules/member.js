// 引入接口
import {getMemberList} from '../../util/axios';

const state = {
    memberList:[]
}


const getters = {
    getMemberList(state){
        return state.memberList
    }
}


const mutations = {
    REQ_MEMBERLIST(state,payload){
        state.memberList = payload;
    }
}

const actions = {
    getMemberListAction({commit}){
        getMemberList()
        .then(res=>{
            // console.log(res);
            commit('REQ_MEMBERLIST',res.data.list)
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