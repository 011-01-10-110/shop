// 引入接口
import {getCateList} from '../../util/axios'

const state = {
  cateList: [],
}

const mutations = {
  // 存菜单列表
    REQ_MENULIST(state,payload){
        state.cateList = payload;
    }
}

const getters = {
  // 获取菜单列表
  getCateList(state) {
    return state.cateList;
  }
}

const actions = {
  // 调用接口 => mutations => state存值
  getCateListAction({commit}) {
    // 使用接口
    getCateList({istree:true})
      .then(res => {
        if (res.data.code === 200) {
          // console.log('响应', res);
          commit('REQ_MENULIST', res.data.list)
        }
      })
      .catch(err => {
        console.log('错误响应', err);
      })
  }
}
// 导出模块
export default {
  state,
  mutations,
  getters,
  actions,
  //   命名空间
  namespaced: true
}
