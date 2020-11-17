// 引入接口
import {getBannerList} from '../../util/axios'

const state = {
  bannerList: [],
}

const mutations = {
  // 存菜单列表
    REQ_BANNERLIST(state,payload){
        state.bannerList = payload;
    }
}

const getters = {
  // 获取菜单列表
  getBannerList(state) {
    return state.bannerList;
  }
}

const actions = {
  // 调用接口 => mutations => state存值
  getBannerListAction({commit}) {
    // 使用接口
    getBannerList({istree:true})
      .then(res => {
        if (res.data.code === 200) {
          // console.log('响应', res);
          commit('REQ_BANNERLIST', res.data.list)
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
