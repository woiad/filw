import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    leftData: [],
    navMoreListShow: false,
    navRenameShow: true,
    leftMenuY: 0,
    leftMenuX: 0,
    leftMenuShow: false,
    leftActiveName: [],
    level: 0,
    unzipShow: false,
    unzipItem: [],
    fileOption: {
      whereCli: '', // 删除时判断是左边删除，还是右边
      copyType: '',
      type: [],
      rename: false,
      renameInpShow: false,
      currentPath: '/',
      filePath: ['/'],
      copyPath: [],
      buildFile: false, // 判断是否新建文件
      rightMenuShow: false,
      currentName: '' // 右侧重命名显示
    },
    rightShowData: [],
    advanArr: []
  },
  mutations: {
    changeLeftData (state, arrData) {
      state.leftData = arrData
    },
    changeMoreListShow (state, bol) {
      state.navMoreListShow = bol
    },
    changeRenameShow (state, bol) {
      state.navRenameShow = bol
    },
    changeLeftActiveName (state, name) {
      state.leftActiveName = []
      state.leftActiveName.push(name)
    },
    changeLevel (state, lev) {
      state.level = lev
    },
    changeWhereCli (state, dir) {
      state.fileOption.whereCli = dir
    },
    changeBuildFile (state, bol) {
      state.fileOption.buildFile = bol
    },
    changeLeftMenuY (state, arr) {
      state.leftMenuY = arr[0]
      state.leftMenuX = arr[1]
    },
    changeLeftMenuShow (state, bol) {
      state.leftMenuShow = bol
    },
    changeCopyType (state, type) { // 复制或粘贴
      state.fileOption.copyType = type
    },
    changeType (state, typeArr) { // 文件类型
      state.fileOption.type = typeArr
    },
    changeFileName (state, bol) {
      state.fileOption.rename = bol
    },
    changeRenameInpShow (state, bol) {
      state.fileOption.renameInpShow = bol
    },
    changeCurrentPath (state, path) {
      state.fileOption.currentPath = path
    },
    changeDownFile (state, arrData) {
      state.fileOption.filePath = arrData
    },
    changeCopyPath (state, arr) {
      state.fileOption.copyPath = arr
    },
    changeRightShowData (state, arr) {
      state.rightShowData = arr
    },
    changeAdvanArr (state, arr) {
      state.advanArr = arr
    },
    changeRightMenuShow (state, bol) {
      state.fileOption.rightMenuShow = bol
    },
    changeCurrentName (state, name) {
      state.fileOption.currentName = name
    },
    changeUnZipShow (state, bol) {
      state.unzipShow = bol
    },
    changeUnzipItem (state, arr) {
      state.unzipItem = arr
    }
  },
  actions: {},
  modules: {}
})
export default store
