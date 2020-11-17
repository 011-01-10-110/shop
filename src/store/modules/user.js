// 引入接口
import {
  getUserList,
  getUserCount
} from '../../util/axios';

const state = {
  userList: [],
  size: 2,
  page: 1,
  total: 0
}

const getters = {
  getUserList(state) {
    return state.userList
  },
  // 总条数
  getUserCount(state) {
    return state.total
  },
  // size
  getUSerSize(state){
    return state.size
  }
}

const mutations = {
  REQ_USERLIST(state, payload) {
    state.userList = payload;
  },
  REQ_COUNT(state, payload) {
    state.total = payload;
  },
  REQ_PAGE(state, payload) {
    state.page = payload
  }
}

const actions = {
  // 获取管理员列表
  getUserListAction(context) {
    // console.log(context);
    getUserList({
        size: context.state.size,
        page: context.state.page
      })
      .then(res => {
        if (res.data.code == 200) {
          // console.log(res);
          // 如果当前页没有值则减少page重新获取
          if(res.data.list == null && context.state.page > 1){
            context.dispatch('getUserPageAction', context.state.page - 1);
            return
          }
          context.commit('REQ_USERLIST', res.data.list)
        }
      })
      .catch(err => {
        console.log(err);
      })
  },
  // 改变总数
  getUserCountAction({
    commit
  }) {
    getUserCount()
      .then(res => {
        // console.log(res);
        if (res.data.code == 200) {
          commit('REQ_COUNT', res.data.list[0].total)
        }
      })
      .catch(err => {
        console.log(err);
      })
  },
  // 改变page
  getUserPageAction(context, payload) {
    context.commit('REQ_PAGE', payload);
    // 重新调取列表
    context.dispatch('getUserListAction')
  }
}

// 导出模块
export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
