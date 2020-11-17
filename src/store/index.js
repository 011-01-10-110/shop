import Vue from 'vue';
import Vuex from 'vuex'

// 拆分的模块
import menu from './modules/menu';
import role from './modules/role';
import user from './modules/user';
import cate from './modules/cate';
import specs from './modules/specs';
import goods from './modules/goods';
import member from './modules/member';
import banner from './modules/banner';
import seck from './modules/seck';

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    userInfo: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : null
  },
  getters: {
    getuserInfo(state) {
      return state.userInfo
    }
  },
  mutations: {
    CHANGE_USER(state, payload) {
      state.userInfo = payload
    }
  },
  actions: {
    changeUserInfo({
      commit
    }, payload) {
      if (payload) {
        sessionStorage.setItem('userInfo',JSON.stringify(payload))
        commit('CHANGE_USER', payload)
      } else {
        sessionStorage.removeItem('userInfo')
      }
    }
  },
  modules: {
    menu,
    role,
    user,
    cate,
    specs,
    goods,
    member,
    banner,
    seck
  }
})
