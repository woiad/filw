<template>
  <div class="container" @click.stop="changeInp">
    <div class="header" id="header">
      <Header></Header>
    </div>
    <div class="content">
      <Split v-model="split">
        <div slot="left" class="split-left" ref="splitLeft" id="splitLeft">
          <k-tree :list="treeData" @initPath="init" ref="tree"></k-tree>
          <context-menu v-if="leftMenu" :left-context-show="true"
          :page-x="leftMenuPageX" :page-y="leftMenuPageY" id="contentMenu"></context-menu>
        </div>
        <div slot="right" class="split-right">
          <div class="split-right-top" id="rightTop">
            <div class="top-content">
              <div class="history">
                <button :disabled="Filepath.length > 2 ? false : 'disabled'" class="btn-default"
                :class="{'back-btn': Filepath.length > 2 ? true : false}" @click.stop="backPath">
                  <i class="fa fa-angle-left"></i>
                </button>
                <button :disabled="advanPath.length > 0 ? false : true" class="btn-default"
                :class="{'advance-btn': advanPath.length > 0 ? true : false}" @click.stop="advancePath">
                  <i class="fa fa-angle-right"></i>
                </button>
              </div>
              <div class="top-middle" :style="{'width': split > 0.4 ? '80%' : '50%'}">
                <button class="btn-default home-btn"><i class="fa fa-home" style="color: #999;"></i></button>
                <div class="path" ref="pathWrap">
                  <ul ref="path">
                    <li v-for="(item, index) in Filepath" :key="index">
                      <a href="javascript:;" style="z-index: 3">
                        <span class="path-name">{{item}}</span>
                      </a>
                    </li>
                  </ul>
                  <!--<div class="path-input" v-show="inpStatus">-->
                    <!--<input type="text" id="path_inp" autofocus="autofocus" />-->
                  <!--</div>-->
                </div>
                <button class="btn-default back-btn" v-if="split > 0.6 ? false : true" @click.stop="backPath">
                  <i></i>
                </button>
              </div>
              <transition name="split-right">
                <div class="top-right" v-if="split > 0.38 ? false : true">
                  <input type="text" @input="searchHandle" v-model.trim="searchText" />
                  <button class="btn-default search-btn">
                    <i class="fa fa-search" aria-hidden="true"></i>
                  </button>
                </div>
              </transition>
            </div>
          </div>
          <div class="split-right-nav" :style="{width: split > 0.66 ? '428px' : '100%'}" id="rightNav">
            <div class="nav-left">
              <div class="btn-wrap">
                <button class="btn-default new-btn" @click.stop="newDir('dir')">
                  <i class="fa fa-folder" aria-hidden="true" style="color: #ffe385;"></i>
                  新建文件夹
                </button>
                <button class="btn-default drap-btn" @click="buildFildShow = !buildFildShow">
                  <i class="fa fa-angle-down" ara-hidden="true"></i>
                </button>
                <transition name="slide">
                  <div class="dropMenu" v-if="buildFildShow">
                    <ul>
                      <li @click.stop="newDir('txt')">
                        <i class="icon txt-icon"></i>
                        <a href="javascript:;">txt文件</a>
                      </li>
                      <li @click.stop="newDir('doc')">
                        <i class="icon doc-icon"></i>
                        <a href="javascript:;">Word docx 文件</a>
                      </li>
                      <li @click.stop="newDir('xls')">
                        <i class="icon xls-icon"></i>
                        <a href="javascript:;">Excel xls 文件</a>
                      </li>
                      <li @click.stop="newDir('ppt')">
                        <i class="icon ppt-icon"></i>
                        <a href="javascript:;">PowerPoint pptx 文件</a>
                      </li>
                    </ul>
                  </div>
                </transition>
              </div>
              <div class="btn-wrap" style="margin-left: 10px;">
                <button class="btn-default up-btn" style="width: 60px;" @click="upShow = true">
                  <i class="fa fa-upload" aria-hidden="true" style="font-size: 16px;color: #3291e5;"></i>
                  上传
                </button>
                <!--<button class="btn-default drap-btn" @click="fildUpShow = !fildUpShow">-->
                  <!--<i class="fa fa-angle-down"></i>-->
                <!--</button>-->
                <!--<transition name="slide">-->
                  <!--<div class="dropMenu" style="left: 57px;" v-if="fildUpShow">-->
                    <!--<ul>-->
                      <!--<li>-->
                        <!--<i class="fa fa-upload" style="color: rgb(50, 145, 229);margin-right: 5px;"></i>-->
                        <!--<a>文件</a>-->
                      <!--</li>-->
                      <!--<li>-->
                        <!--<i class="fa fa-upload" style="color: rgb(50, 145, 229);margin-right: 5px;"></i>-->
                        <!--<a>文件夹</a>-->
                      <!--</li>-->
                    <!--</ul>-->
                  <!--</div>-->
                <!--</transition>-->
              </div>
            </div>
            <div class="nav-content">
              <ul v-if="listShow">
                <li>
                  <button class="btn-default" @click.stop="downFile">
                    <menu-icon :pos-x="-16" :pos-y="-48" :mg="4"></menu-icon>下载
                  </button>
                </li>
                <li>
                  <button class="btn-default" @click.stop="optionHandler('delete')">
                    <menu-icon  :pos-y="-80" :mg="4"></menu-icon>删除
                  </button>
                </li>
                <li v-if="renameShow" @click.stop="renameHandle">
                  <button class="btn-default">
                    <menu-icon  :pos-y="-64" :mg="4"></menu-icon>重命名
                  </button>
                </li>
                <li>
                  <button class="btn-default" @click.stop="optionHandler('copy')">
                    <menu-icon  :pos-y="-96" :mg="4"></menu-icon>复制
                  </button>
                </li>
                <li>
                  <button class="btn-default" @click.stop="optionHandler('shear')">
                    <menu-icon  :pos-x="-16" :pos-y="-80" :mg="4"></menu-icon>剪切
                  </button>
                </li>
                <li>
                  <button class="btn-default" style="width: 100px;">
                    <menu-icon  :pos-x="-16" :pos-y="-32" :mg="4"></menu-icon>创建压缩包
                  </button>
                  <dl>
                    <dd v-for="(item, index) in compressType" :key="index" @click.stop="compressClick(index)">
                      <a href="javascript:;">
                        <menu-icon :pos-x="-16" :pos-y="-32"></menu-icon>
                        {{item}}文件夹
                      </a>
                    </dd>
                  </dl>
                </li>
              </ul>
            </div>
            <div class="nav-right">
              <!--<div class="amp">-->
                <!--<i class="fa fa-search-plus" aria-hidden="true"></i>-->
              <!--</div>-->
              <ul>
                <li>
                  <button title="图标排列" class="icon-sort" :class="{'active': iconArrangShow}"
                          @click.stop="iconArrangClick">
                    <i></i>
                  </button>
                </li>
                <li>
                  <button title="列表排列" class="list-sort" :class="{'active': listArrangShow}"
                          @click.stop="listArrangClick">
                    <i></i>
                  </button>
                </li>
                <li>
                  <button title="分栏模式" class="subfiled-sort" :class="{'active': subArrangShow}"
                          @click.stop="subArrangClick">
                    <i></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div class="split-right-content">
            <icon-arrang v-if="iconArrangShow" @open="dbopenfile" ref="iconArrang"></icon-arrang>
            <list-arrang v-if="listArrangShow" @open="dbopenfile"></list-arrang>
            <sub-arrang v-if="subArrangShow"></sub-arrang>
          </div>
        </div>
      </Split>
    </div>
    <transition name="slideUp">
      <div class="footer" v-if="unzipPathShow">
        <p style="font-size: 14px;">请选择解压路径：</p>
        <p class="unzpi-path">{{this.$store.state.fileOption.currentPath}}</p>
        <button class="comfirm" @click.stop="comfirmPath">确定</button>
        <button class="cancel" @click.stop="cancelPath">取消</button>
      </div>
    </transition>
    <div v-if="upShow">
      <upload @close-up="upShow = false"></upload>
    </div>
  </div>
</template>

<script>
import Header from './header/Header'
import kTree from './kTree/treeList'
import iconArrang from './iconArrang/iconArrang'
import listArrang from './listArrang/listArrang'
import subArrang from './subArrang/subArrang'
import menuIcon from './baseVue/menuicon/menuIcon'
import contextMenu from './contextmenu/rightmenu'
import util from '../util/index'
import upload from './upload/upload'

export default {
  name: 'index',
  created () {
    this.init()
  },
  data () {
    return {
      compressType: ['TAR', 'TAR.GZ', 'TAR.BZ2', 'ZIP'],
      treeData: [],
      searchText: '',
      inpStatus: false,
      buildFildShow: false,
      fildUpShow: false,
      iconArrangShow: true,
      listArrangShow: false,
      subArrangShow: false,
      split: 0.15,
      upShow: false,
      searchData: [],
      timeId: ''
    }
  },
  methods: {
    queryData () {
      let path = ''
      if (this.$store.state.fileOption.currentPath === '/') {
        path = '/'
      } else {
        path = this.$store.state.fileOption.currentPath + '/'
      }
      this.$post('/fileapi/operdir', {key: 'show_dir', dir: path})
        .then(res => {
          this.searchData = []
          for (let i in res.file) {
            let obj = {}
            obj.name = i
            obj.check = false
            obj.path = res.file[i][0]
            if (res.file[i][1] === 'dir') {
              obj.extand = res.file[i][1]
            } else {
              let arr = obj.name.split('.')
              obj.extand = arr[arr.length - 1]
            }
            obj.type = res.file[i][1]
            obj.access = res.file[i][2]
            this.searchData.push(obj)
          }
        })
        .catch(err => {
          this.$Message.error('err' + err)
        })
    },
    searchHandle () {
      clearTimeout(this.timeId)
      let reg = RegExp(this.searchText + '.*', 'i')
      let arr = []
      this.timeId = setTimeout(this.queryData(), 300)
      if (this.searchData.length > 0) {
        if (this.searchText !== '') {
          this.searchData.map(item => {
            if (reg.test(item.name)) {
              arr.push(item)
            }
          })
          this.$store.commit('changeRightShowData', arr)
        } else {
          this.$store.commit('changeRightShowData', this.searchData)
        }
      }
    },
    changeInp () {
      if (this.inpStatus) {
        this.inpStatus = !this.inpStatus
      }
      this.$store.commit('changeLeftMenuShow', false)
    },
    newDir (fileType) {
      let obj = util.newFileNumber(fileType)
      if (fileType) {
        this.buildFildShow = false
        obj.type = 'file'
        obj.extand = fileType
      } else {
        obj.type = 'dir'
        obj.extand = 'dir'
      }
      obj.check = true
      this.$store.state.rightShowData.unshift(obj)
      this.$store.commit('changeCurrentName', 0)
      this.$store.commit('changeBuildFile', true)
    },
    downFile () {
      let downArr = this.$store.state.rightShowData
      downArr.forEach(item => {
        if (item.check) {
          this.$fetch('fileapi/downfile', {filename: item.path})
            .then(res => {
              if (res[0] === 500) {
                this.$Message.error('err' + res[2])
              } else {
                let blob = new Blob([res])
                if (window.navigator.msSaveOrOpenBlob) {
                  // 兼容IE10
                  navigator.msSaveBlob(blob, item.name)
                } else {
                  //  chrome/firefox
                  let aTag = document.createElement('a')
                  aTag.download = item.name
                  aTag.href = URL.createObjectURL(blob) // 创建一个url对象，该对象的url指向bolb对象或file对象
                  aTag.click()
                  URL.revokeObjectURL(aTag.href) // 释放url对象，否则页面关闭后自动释放
                }
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    renameHandle () {
      this.$store.state.rightShowData.forEach((item, index) => {
        if (item.check) {
          this.$store.commit('changeRenameShow', true)
          this.$store.commit('changeCurrentName', index)
        }
      })
    },
    optionHandler (option) { // 删除,复制，剪切
      let optionArr = this.dataForEach()
      let pathArr = []
      let typeArr = []
      for (let i = 0; i < optionArr.length; i++) {
        pathArr.push(optionArr[i].path)
        typeArr.push(optionArr[i].type)
      }
      if (optionArr.length <= 1) {
        this.$store.commit('changeType', optionArr[0].type)
      } else {
        this.$store.commit('changeType', typeArr)
      }
      if (option === 'delete') {
        this.$Modal.confirm({
          title: '删除确认',
          content: `<p>${optionArr[0].name}</p><p style="margin: 5px 0;">...<span style="background: #f0ad4e;color: #fff;padding: 5px; border-radius: 5px;">${pathArr.length}项内容</span></p><p>确定删除选中内容吗？</p>`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.$post('fileapi/operdir', {key: 'delfile', content: JSON.stringify(pathArr)})
              .then(res => {
                if (res[0] === 500) {
                  this.$Message.error('err' + res[2])
                } else if (res[0] === 200) {
                  this.$Message.success('success' + res[2])
                  for (let i = 0; i < pathArr.length; i++) {
                    util.delFile(this.$store.state.leftData, pathArr[i], 'del')
                  }
                  this.$refs['tree'].getFile(this.$store.state.fileOption.currentPath + '/')
                }
              })
              .catch(err => {
                this.$message.error('err' + err)
                console.log(err)
              })
          }
        })
      } else if (option === 'copy') {
        this.$store.commit('changeCopyType', 'copy')
        if (pathArr.length > 0) {
          this.$Message.success('复制成功,剪贴板已被覆盖')
          this.$store.commit('changeCopyPath', pathArr)
        }
      } else if (option === 'shear') {
        this.$store.commit('changeCopyType', 'shear')
        if (pathArr.length > 0) {
          this.$Message.success('剪贴成功,剪贴板已被覆盖')
          this.$store.commit('changeCopyPath', pathArr)
        }
      }
    },
    iconArrangClick () {
      this.iconArrangShow = true
      this.listArrangShow = false
      this.subArrangShow = false
    },
    listArrangClick () {
      this.iconArrangShow = false
      this.listArrangShow = true
      this.subArrangShow = false
    },
    subArrangClick () {
      this.iconArrangShow = false
      this.listArrangShow = false
      this.subArrangShow = true
    },
    backPath () { // 后退
      if (this.$store.state.fileOption.currentPath.length > 0) {
        let arr = this.$store.state.fileOption.currentPath.split('/')
        let newPath = ''
        let advanArr = this.$store.state.advanArr
        advanArr.unshift(arr.join('/'))
        this.$store.commit('changeAdvanArr', advanArr)
        arr.splice(arr.length - 1)
        newPath = arr.join('/')
        this.$store.commit('changeCurrentPath', newPath)
        this.$refs['tree'].getFile(newPath + '/')
      }
    },
    advancePath () { // 前进
      if (this.$store.state.advanArr.length > 0) {
        let arr = this.$store.state.advanArr
        this.$store.commit('changeCurrentPath', arr[0])
        this.$refs['tree'].getFile(arr[0] + '/')
        arr.splice(0, 1)
        this.$store.commit('changeAdvanArr', arr)
      }
    },
    comfirmPath () {
      let filename = this.$store.state.unzipItem
      this.$post('fileapi/operdir', {key: 'unzip', filename: JSON.stringify(filename), toname: this.$store.state.fileOption.currentPath})
        .then(res => {
          if (res[0] === 500) {
            this.$Message.error('err' + res[2])
          } else if (res[0] === 200) {
            this.$Message.success(res[2])
          }
        })
        .catch(err => {
          this.$Message.error('err' + err)
          console.log(err)
        })
      this.$store.commit('changeUnzipItem', [])
      this.$store.commit('changeUnZipShow', false)
    },
    cancelPath () {
      this.$store.commit('changeUnzipItem', [])
      this.$store.commit('changeUnZipShow', false)
    },
    compressClick (index) {
      let compressItem = this.dataForEach()
      let filename = []
      for (let i = 0; i < compressItem.length; i++) {
        filename.push(compressItem[i].path)
      }
      this.$post('/fileapi/operdir', {key: 'zip', type: index + 1, filename: JSON.stringify(filename), zipname: compressItem[0].name})
        .then(res => {
          if (res[0] === 500) {
            this.$Message.error('err' + res[2])
          } else if (res[0] === 200) {
            this.$Message.success(res[2])
          }
        })
        .catch(err => {
          this.$Message.error(err)
        })
    },
    init () { // 初始化获取左边目录数据
      this.$post('/fileapi/operdir', {key: 'list_dir', dir: '/'})
        .then(response => {
          util.initArr()
          this.treeData = util.recursion(response.listdir)
          this.$store.commit('changeLeftData', this.treeData)
        })
        .catch(err => {
          console.log(err)
        })
    },
    dbopenfile (path) { // 右边文件双击打开文件
      this.$refs['tree'].getFile(path + '/')
      this.$store.commit('changeCurrentPath', path)
      this.$store.commit('changeDownFile', path)
    },
    dataForEach () {
      let arr = []
      this.$store.state.rightShowData.forEach(item => {
        if (item.check) {
          arr.push(item)
        }
      })
      return arr
    },
    changeLeft () {
      let allWidth = 0
      for (let i = 0; i < this.$refs['path'].childNodes.length; i++) {
        allWidth += parseInt(this.$refs['path'].childNodes[i].clientWidth)
      }
      if (allWidth > this.$refs['pathWrap'].clientWidth) {
        this.$refs['path'].style.marginLeft = this.$refs['pathWrap'].clientWidth - allWidth - 20 + 'px'
      } else {
        this.$refs['path'].style.marginLeft = '0px'
      }
    }
  },
  computed: {
    listShow () {
      return this.$store.state.navMoreListShow
    },
    renameShow () {
      return this.$store.state.navRenameShow
    },
    leftMenuPageY () {
      return this.$store.state.leftMenuY
    },
    leftMenuPageX () {
      return this.$store.state.leftMenuX
    },
    leftMenu () {
      return this.$store.state.leftMenuShow
    },
    Filepath () { // 获取当前文件路径
      let arr = []
      if (this.$store.state.fileOption.currentPath !== '/') {
        arr = this.$store.state.fileOption.currentPath.split('/')
        arr.splice(1, 0, '/')
      } else {
        arr = ['', '/']
      }
      this.$nextTick(() => {
        this.changeLeft()
      })
      return arr
    },
    advanPath () {
      return this.$store.state.advanArr
    },
    unzipPathShow () {
      return this.$store.state.unzipShow
    }
  },
  components: {
    Header,
    kTree,
    iconArrang,
    listArrang,
    subArrang,
    menuIcon,
    contextMenu,
    upload
  }
}
</script>

<style>
  @import '../assets/css/basic.css';
  @import '../assets/font-awesome-4.7.0/css/font-awesome.css';
  .container{width: 100%;height: 100%;overflow: hidden;}
  .container .content{width: 100%;height: calc(100% - 40px);}
  .split-left{width: 100%;height: 100%;}
  .split-right{width: 100%;height: 100%;box-sizing: border-box;overflow: hidden}
  .split-right .split-right-top{width: 100%;height: 49px;background: #f8f8f8 url('../assets/image/bg.gif') 0px -2px repeat-x;border-bottom: 1px solid #ddd;}
  .split-right .split-right-top .top-content{width: 100%;height: 49px;padding-top: 12px;box-sizing: border-box;padding-left: 10px;white-space: nowrap;}
  .split-right .split-right-top .top-content  button.btn-default{background: url("../assets/image/button_bg.png") 0 0px repeat-x;outline: none;
    display: inline-block;vertical-align: top;border: 1px solid transparent;}
  .split-right .split-right-top .top-content  button i{color: #999;font-size: 16px;}
  .split-right .split-right-top .top-content .history{display: inline-block;vertical-align: top;}
  .split-right .split-right-top .top-content .history button{width: 35px;height: 28px;text-align: center;line-height: 27px;color: #666;
    opacity: .5;border-radius: 4px;border-color: #eee;}
  .split-right .split-right-top .top-content .history button.back-btn{opacity: 1}
  .split-right .split-right-top .top-content .history button.advance-btn{opacity: 1;cursor: pointer;}
  .split-right .split-right-top .top-content .history button.advance-btn:hover{background-color: #e4f8ff;border-color: #aedaff;}
  .split-right .split-right-top .top-content .top-middle{display: inline-block;width: 50%;}
  .split-right .split-right-top .top-content .top-middle .home-btn{width: 38px;height: 28px;border-color: #ddd;cursor: pointer;font-size: 16px;}
  .split-right .split-right-top .top-content .top-middle .path{display: inline-block;width: 80%;height: 28px;overflow: hidden;cursor: text;
  border: 1px solid #ddd;box-shadow: #e6e6e6 0px 0px 20px inset;background: #f8f8f8 url("../assets/image/bg.gif") 0px -2px repeat-x;}
  .split-right .split-right-top .top-content .top-middle .path ul{position: relative;}
  .split-right .split-right-top .top-content .top-middle .path ul li{display: inline-block;height: 28px;vertical-align: top;}
  .split-right .split-right-top .top-content .top-middle .path ul li a{position: relative;display: inline-block;padding: 0 15px 0 15px;height: 28px;
    background: url('../assets/image/path.bg.png') no-repeat;background-position: 100% -1px;cursor: pointer;font-size: 12px;color: #666;line-height: 28px;}
  .split-right .split-right-top .top-content .top-middle .path ul li:first-child a{margin-left: 0;z-index: 3;}
  .split-right .split-right-top .top-content .top-middle .path-input{width: 100%;height: 28px;}
  .split-right .split-right-top .top-content .top-middle .path-input input{width: 100%;height: 26px;border: none;background: transparent;padding: 0 10px;line-height: 26px;
    color: #444;font-size: 12px}
  .split-right .split-right-top .top-content  .back-btn{display: inline-block;width: 32px;height: 28px;cursor: pointer;background: url('../assets/image/button_bg.png') 0 0 repeat-x;
  border-color: #ddd;}
  .split-right .split-right-top .top-content  .back-btn:hover{background-color: #e4f8ff;border-color: #aedaff;}
  .split-right .split-right-top .top-content .top-middle .back-btn i{display: inline-block;width: 16px;height: 16px;background-image: url('../assets/image/menu_icon.png');background-repeat: no-repeat;
  background-position: 0px -496px;}
  .split-right .split-right-top .top-content .top-right{float: right;margin-right: 40px;}
  .split-right .split-right-top .top-content .top-right input{display: inline-block;vertical-align: top;border: 1px solid #ddd;height: 28px;
  padding: 0 10px;color: #888;text-shadow: 1px 1px 3px #ccc;background: #f8f8f8 url("../assets/image/bg.gif") 0px -2px repeat-x;box-shadow: #e6e6e6 0px 0px 20px inset;}
  .split-right .split-right-top .top-content .top-right input:focus{box-shadow: #ccc 0px 0px 20px inset;}
  .split-right .split-right-top .top-content .top-right .search-btn{display: inline-block;width: 38px;height: 28px;box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: border .2s;border-color: #ddd;margin-left: -4px;cursor: pointer;border-left: none;}
  .split-right .split-right-top .top-content .top-right .search-btn:hover{box-shadow: 0 1px 10px rgba(0,0,0,0.2);border-color: #aaa;}
  .split-right .split-right-nav{width: 100%;height: 35px;line-height: 35px;border-bottom: 1px solid #ddd;background: #fefefe;padding: 0 10px;}
  .split-right .split-right-nav .btn-wrap{position: relative;display: inline-block;vertical-align: top;}
  .split-right .split-right-nav .btn-default{width: 95px;height: 24px;font-size: 12px;background: #fff;color: #666;border: 1px solid #ddd;
    cursor: pointer;text-shadow: 0 1px 0 #fff;line-height: 24px;}
  .split-right .split-right-nav .nav-left{float: left;}
  .split-right .split-right-nav .btn-default:hover{border-color: #aedaff;background-color: #e4f8ff}
  .split-right .split-right-nav .btn-default i{font-size: 16px;color: #999;}
  .split-right .split-right-nav .drap-btn{width: 30px;margin-left: -3px;border-left: none;}
  .split-right .split-right-nav .btn-wrap .dropMenu{position: absolute;min-width: 180px;top: 29px;left: 93px;box-shadow: 4px 5px 10px rgba(0,0,0,0.2);
  border: 1px solid rgba(0, 0, 0, .1);background: #fff;border-radius: 3px;z-index: 5;}
  .split-right .split-right-nav .btn-wrap .dropMenu ul{width: 100%;padding: 8px 0;}
  .split-right .split-right-nav .btn-wrap .dropMenu li{width: 100%;height: 25px;line-height: 25px;padding: 0 15px;box-sizing: border-box;cursor: pointer}
  .split-right .split-right-nav .btn-wrap .dropMenu li a{color: #333;font-size: 12px;}
  .split-right .split-right-nav .btn-wrap .dropMenu li i.icon{display: inline-block; width: 16px;height: 16px;margin-right: 8px;vertical-align: middle;
  background-repeat: no-repeat;background-image: url('../assets/image/icon.png');}
  .split-right .split-right-nav .btn-wrap .dropMenu li .txt-icon{background-position: -97px -16px;}
  .split-right .split-right-nav .btn-wrap .dropMenu li .doc-icon{background-position: -81px -560px;}
  .split-right .split-right-nav .btn-wrap .dropMenu li .xls-icon{background-position: -81px -48px;}
  .split-right .split-right-nav .btn-wrap .dropMenu li .ppt-icon{background-position: -81px -288px;}
  .split-right .split-right-nav .btn-wrap .dropMenu li:hover{background: #ddd;}
  .slide-enter-active, .slide-leave-active{transform: translateY(0);transition: all .3s linear;opacity: 1}
  .slide-enter, .slide-leave-to{transform: translateY(-20px);opacity: 0;}
  .split-right .split-right-nav .nav-content{float: left;margin-left: 20px;}
  .split-right .split-right-nav .nav-content ul li{float: left;position: relative;}
  .split-right .split-right-nav .nav-content ul li button{width: 60px;cursor: pointer;border-right: none;}
  .split-right .split-right-nav .nav-content ul li:last-child button{border-right: 1px solid #ddd;}
  .split-right .split-right-nav .nav-content ul li:last-child:hover dl{display: block;}
  .split-right .split-right-nav .nav-content ul li dl{display: none;position: absolute;width: 120px;top: 27px;background: #ffffff;border: 1px solid rgba(0, 0, 0, 0.1);z-index: 20;
    box-shadow: 4px 5px 10px rgba(0, 0, 0, 0.2);}
  .split-right .split-right-nav .nav-content ul li dl dd{height: 25px;line-height: 25px;}
  .split-right .split-right-nav .nav-content ul li dl dd a{color: #222; padding: 5px;}
  .split-right .split-right-nav .nav-content ul li dl dd:hover{background: #e1e1e1;}
  .split-right .split-right-nav .nav-right{float: right;width: 150px;margin-right: 20px;}
  .split-right .split-right-nav .nav-right .amp{float: left;width: 25px;height: 25px;margin: 5px 5px 5px 0;font-size: 14px;text-align: center;line-height: 25px;color: #888;
  cursor: pointer;}
  .split-right .split-right-nav .nav-right .amp:hover{background: #f6f6f6;border-radius: 3px;}
  .split-right .split-right-nav .nav-right li{float: left;width: 34px;height: 24px;margin: 5px 0;}
  .split-right .split-right-nav .nav-right li button{width: 34px;height: 22px;padding:  3px 7px;border: 1px solid #ddd;cursor: pointer;text-align: center;
  line-height: 22px;}
  .split-right .split-right-nav .nav-right li:nth-child(2) button{border-right: none;border-left: none;}
  .split-right .split-right-nav .nav-right li i{display: inline-block;background-image: url('../assets/image/menu_icon.png');width: 16px;height: 16px;}
  .split-right .split-right-nav .nav-right li button.icon-sort i{background-position:0 -561px;}
   button.icon-sort.active, button.list-sort.active, button.subfiled-sort.active{background: #e4f8ff;border-color: #93cfff;}
  .split-right .split-right-nav .nav-right li button.list-sort i{background-position: 16px -625px}
  .split-right .split-right-nav .nav-right li button.subfiled-sort i{background-position: 16px -562px}
  .split-right .split-right-nav .nav-right li:hover button{background: #e4f8ff;border-color: #93cfff;}
  .split-right .split-right-content{width: 100%;height: calc(100% - 84px);}
  .slplit-right-enter-active, .split-right-leave-active{transition: all .2s linear;transform: translate(0);opacity: 1;}
  .split-right-enter, .split-right-leave-to{transform: translateX(20px);opacity: 0;}
  .footer{width: 100%;position: fixed;bottom: 0;padding: 15px;background: #F8F8F8;border-top: 1px solid #eee; text-align: center;z-index: 100}
  .footer p.unzpi-path{display: inline-block;width: 555px;padding: 0px 10px;height: 27px;border: 1px solid rgba(100,100,100,0.3);
  background: rgba(255, 255, 255, 0.3);vertical-align: top;text-align: left;line-height: 27px;}
  .footer button{display: inline-block;padding: 0 18px;height: 25px;margin-left: 15px;line-height: 25px;border: 1px solid #ccc;background: #eee;color: #222; cursor: pointer;}
  .footer .comfirm{border-color: #96c7ff; box-shadow: 0 0 2px #96c7ff;}
  .footer button:hover{background: #fbfbfb;}
  .slideUp-enter-active, .slideUP-leave-active{transition: all .2s linear; transform: translate(0px); opacity: 1;}
  .slideUp-enter, .slideUp-leave-to{transform: translateY(45px);opacity: 0;}
</style>
