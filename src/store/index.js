import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    navMoreListShow: false,
    navRenameShow: true,
    leftMenuY: 0,
    leftMenuX: 0,
    leftMenuShow: false,
    fileOption: {
      rename: false,
      renameInpShow: false,
      downFile: []
    }
  },
  mutations: {
    changeMoreListShow (state, bol) {
      state.navMoreListShow = bol
    },
    changeRenameShow (state, bol) {
      state.navRenameShow = bol
    },
    changeLeftMenuY (state, arr) {
      state.leftMenuY = arr[0]
      state.leftMenuX = arr[1]
    },
    changeLeftMenuShow (state, bol) {
      state.leftMenuShow = bol
    },
    changeFileName (state, bol) {
      state.fileOption.rename = bol
    },
    changeRenameInpShow (state, bol) {
      state.fileOption.renameInpShow = bol
    },
    changeDownFile (state, arrData) {
      state.fileOption.downFile = arrData
    }
  },
  actions: {},
  modules: {}
})
export default store
