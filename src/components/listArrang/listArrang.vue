<template>
  <div class="list-arrang-container" @click="clearAll($event)" :class="{'no-select': noSelect}">
    <right-menu v-if="menuShow" :page-x="dis_x" :page-y="dis_y" :compress-right="compressRight"
                @on-open-file="openFile" ref="rightMenu"></right-menu>
    <div class="descript" id="descript">
      <div style="width: 100%" class="split-wrapper">
        <Split v-model="split_name">
          <div slot="left" class="name">
            <p>名称</p>
          </div>
          <div slot="right" id="right_type">
            <Split v-model="split_type" @on-moving="panelTypeDrag">
              <div slot="left" class="type">
                <p>类型</p>
              </div>
              <div slot="right" id="right_size">
                <Split v-model="split_size" @on-moving="panelSizeDrag">
                  <div slot="left" class="size" @click="size_icon_up = !size_icon_up">
                    <p>大小 <i class="fa" :class="[size_icon_up ? 'fa-chevron-up' : 'fa-chevron-down']"></i></p>
                  </div>
                  <div slot="right" class="time" @click="time_icon_up = !time_icon_up">
                    <p>修改时间 <i class="fa" :class="[time_icon_up ? 'fa-chevron-up' : 'fa-chevron-down']"></i></p>
                  </div>
                </Split>
              </div>
            </Split>
          </div>
        </Split>
      </div>
    </div>
    <div class="list-content" ref="listContent" v-if="fileData.length > 0">
      <div class="list" v-for="(item, index) in fileData" :key="index" @click.stop="dataForeach(index, true)"
      :class="{'active': item.check}" @contextmenu.prevent="contentMenuRight(item, index, $event)" :ref="item.check ? 'active' : ''"
           @dblclick.stop.prevent="openFile(item)" @keyup.enter="$event.target.blur">
        <div class="list-item-name" :style="{'width': split_name * 100 + '%'}">
          <i class="name-icon" :style="{'background-image': type.indexOf(item.extand) > -1 ? 'url(../../static/image/' + item.extand + '.png)' : 'url(../../static/image/txt.png)'}"></i>
          <p :class="{'unactive': (renameName === index && item.check) ? true : false}" @dblclick.stop.prevent="textDdClick(index)"
          title="双击名称重命名">{{item.name}}</p>
          <input v-model="item.name" class="rename" v-focus="item.check" :class="{'active': (renameName === index && item.check) ? true : false}"
                 @blur.prevent="confirmName(item)" @focus="inpFocus(item.name)"/>
        </div>
        <div class="list-item-type" :style="{'width': type_width + 'px' || 'calc(19% - 3.5px)' }">
          <p>{{item.extand === 'dir' ? '文件夹':item.extand +  '文件'}}</p>
        </div>
        <div class="list-item-size" :style="{'width': size_width + 'px' || '14%'}">
          <p v-if="item.size">{{item.size}}M</p>
        </div>
        <div class="list-item-time">
          <p v-if="item.time">{{item.time}}</p>
        </div>
        <div class="hover-show">
          <i class="chose fa fa-check-circle" aria-hidden="true" :class="{'active': item.check}"
             @click.stop="iconCircleShow(item)"></i>
          <button class="more" @click.stop="ContextmenuShow(item, index, $event)">
            <i class="fa fa-caret-down" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="null" v-else>
      <div>
        <img src="../../../static/image/null.png"/>
        <p>文件夹为空!</p>
      </div>
    </div>
    <div class="iframe-container" v-if="frameShow">
      <div class="load" v-if="loadShow">
        <img src="../../../static/image/loading-0.gif">
      </div>
      <div class="iframe-wrapper" ref="popUp" v-else>
        <div class="iframe-top">
          <p>{{fileTitle}}</p>
          <div class="max" @click="handkleMax">
            <i class="fa fa-square-o" aria-hidden="true"></i>
          </div>
          <div class="close" @click="close">
            <i class="fa fa-close" aria-hidden="true"></i>
          </div>
        </div>
        <div class="content">
          <ace v-model="response" :file-type="fileType" :path="dirPath" @save-complete="dataChg = !dataChg"></ace>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../util/index'
import rightMenu from '../contextmenu/rightmenu'
import {FILETYPE} from '../../util/type'
export default {
  name: 'listArrang',
  data () {
    return {
      oldName: '',
      type: FILETYPE,
      size_icon_up: true,
      time_icon_up: true,
      split_name: 0.25,
      split_type: 0.25,
      split_size: 0.25,
      type_width: '',
      size_width: '',
      noSelect: false,
      count: '', // 计算选中个数
      dis_x: 0,
      dis_y: 0,
      compressRight: true,
      loadShow: false,
      frameShow: false,
      dataChg: false, // 判断打开的文件是否更改
      fileType: '',
      fileTitle: '',
      response: '',
      dirPath: ''
    }
  },
  computed: {
    fileData () {
      return this.$store.state.rightShowData
    },
    menuShow () {
      return this.$store.state.fileOption.rightMenuShow
    },
    renameName () {
      return this.$store.state.fileOption.currentName
    }
  },
  watch: {
    response () {
      if (this.response !== '') {
        this.dataChg = true
      } else {
        this.dataChg = false
      }
    }
  },
  directives: {
    focus: {
      update: function (el, {value}) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  methods: {
    contextMenuPos (liWidth, pageX, pageY, rightBol) {
      this.$nextTick(() => {
        const rightMenuWidth = this.$refs.rightMenu.$el.clientWidth
        const rightMenuHeight = this.$refs.rightMenu.$el.clientHeight
        let allHig = ''
        if (this.$refs.listContent.clientHeight > this.$refs.listContent.parentElement.clientHeight) {
          allHig = this.$refs.listContent.clientHeight
        } else {
          allHig = this.$refs.listContent.parentElement.clientHeight
        }
        if (rightBol) {
          const leftWid = util.getId('splitLeft').clientWidth
          if (rightMenuWidth + (pageX - leftWid) > liWidth) {
            this.compressRight = true
            this.dis_x = liWidth - rightMenuWidth - 15
          } else {
            this.compressRight = false
            this.dis_x = pageX - leftWid
          }
          if (rightMenuHeight + pageY > allHig) {
            this.dis_y = allHig - rightMenuHeight
          } else {
            this.dis_y = pageY
          }
        } else {
          this.dis_x = liWidth - rightMenuWidth - pageX
          if (pageY + rightMenuHeight > allHig) {
            this.dis_y = allHig - rightMenuHeight
          } else {
            this.dis_y = pageY
          }
        }
      })
    },
    panelTypeDrag () {
      this.type_width = util.getId('right_type').clientWidth * this.split_type
    },
    panelSizeDrag () {
      this.size_width = util.getId('right_size').clientWidth * this.split_size
    },
    dataForeach (ind, bol) {
      if (bol) {
        this.noSelect = false
        this.$store.commit('changeRightMenuShow', false)
      }
      this.count = 1
      this.fileData.forEach((item, index) => {
        if (ind === index) {
          item.check = true
          this.$store.commit('changeMoreListShow', true)
          this.$store.commit('changeRenameShow', true)
        } else {
          item.check = false
        }
      })
    },
    iconCircleShow (item) {
      item.check = !item.check
      if (item.check) {
        this.count++
      } else {
        this.count--
      }
      if (this.count > 1) {
        this.$store.commit('changeRenameShow', false)
      } else {
        this.$store.commit('changeRenameShow', true)
      }
      for (let i = 0; i < this.fileData.length; i++) {
        if (this.fileData[i].check) {
          this.$store.commit('changeMoreListShow', true)
          break
        } else {
          this.$store.commit('changeMoreListShow', false)
        }
      }
    },
    clearAll (e) {
      let evt = e || window.event
      if (evt.target.className === 'list-arrang-container') {
        this.$store.commit('changeRightMenuShow', false)
        this.dataForeach(-1, false)
        this.$store.commit('changeMoreListShow', false)
        this.count = 0
        this.$store.commit('changeCurrentName', '')
      }
    },
    ContextmenuShow (item, index, e) { // 点击右侧举行按钮， 弹出菜单
      this.$store.commit('changeDownFile', item.path)
      this.$store.commit('changeRightMenuShow', !this.menuShow)
      this.dataForeach(index)
      if (this.menuShow) {
        let evt = e || window.event
        if (evt.target.tagName.toLowerCase() === 'button') {
          this.contextMenuPos(evt.path[2].clientWidth, 30, evt.path[2].offsetTop)
        } else if (evt.target.tagName.toLowerCase() === 'i') {
          this.contextMenuPos(evt.path[3].clientWidth, 30, evt.path[3].offsetTop)
        }
      }
    },
    contentMenuRight (item, index, e) { // 点击右键弹出菜单
      this.$store.commit('changeRightMenuShow', true)
      this.$store.commit('changeDownFile', item.path)
      this.dataForeach(index, false)
      this.noSelect = true
      this.compressRight = true
      let evt = e || event
      this.$nextTick(() => {
        console.log(this.$refs.active)
        this.contextMenuPos(this.$refs.listContent.clientWidth, evt.screenX, this.$refs.active[0].offsetTop, true)
      })
    },
    openFile (item) {
      this.noSelect = true
      this.$store.commit('changeRightMenuShow', false)
      if (item.type !== 'dir') {
        this.frameShow = true
        this.loadShow = true
        this.$post('fileapi/operdir', {key: 'updatefile_r', dirname: item.path})
          .then(res => {
            if (res[0] === 'err') {
              setTimeout(() => {
                this.loadShow = false
                this.frameShow = false
              }, 200)
              this.$Message.error('err' + res[2])
            } else if (res[0] === 500) {
              setTimeout(() => {
                this.loadShow = false
                this.frameShow = false
              }, 200)
              this.$Message.error('err' + res[2])
            } else {
              setTimeout(() => {
                this.loadShow = false
              }, 500)
              let arr = item.path.split('.')
              let titleArr = item.path.split('/')
              this.fileType = arr[arr.length - 1]
              this.fileTitle = titleArr[titleArr.length - 1]
              this.response = res
              this.dirPath = item.path
            }
          })
          .catch(err => {
            setTimeout(() => {
              this.loadShow = false
              this.frameShow = false
            }, 200)
            console.log(err)
          })
      } else {
        this.$emit('open', item.path)
      }
    },
    close () {
      if (this.dataChg) {
        this.$Modal.confirm({
          title: '关闭确认',
          content: '<p>有文件未保存，确认关闭窗口？</p>',
          onOk: () => {
            this.frameShow = false
            this.dataChg = false
            this.response = ''
          }
        })
      } else {
        this.frameShow = false
      }
    },
    handkleMax () {
      if (!this.max) {
        this.$refs['popUp'].style.width = '100%'
        this.$refs['popUp'].style.height = '100%'
        this.$refs['popUp'].style.top = 0
        this.$refs['popUp'].style.margin = 0
        this.$refs['popUp'].style.left = 0
        this.max = true
      } else {
        this.$refs['popUp'].style.width = '600px'
        this.$refs['popUp'].style.height = '600px'
        this.$refs['popUp'].style.top = '50%'
        this.$refs['popUp'].style.marginLeft = '-300px'
        this.$refs['popUp'].style.marginTop = '-300px'
        this.$refs['popUp'].style.left = '50%'
        this.max = false
      }
    },
    textDdClick (ind) {
      this.$store.commit('changeCurrentName', ind)
      this.dataForeach(ind, true)
    },
    inpFocus (name) {
      this.oldName = name
    },
    confirmName (item) {
      this.$store.commit('changeCurrentName', '')
      let obj = {}
      obj.from = item.path
      obj.to = item.name
      if (this.oldName !== item.name && !this.$store.state.fileOption.buildFile) {
        this.$post('fileapi/operdir', {key: 'rename', content: JSON.stringify(obj)})
          .then(res => {
            if (res[0] === 500) {
              this.$Message.error('err' + res[2])
            } else if (res[0] === 200) {
              this.$Message.success('success' + res[2])
              item.path = util.pathModifer(item.name, item.path)
              if (this.$store.state.fileOption.currentPath === this.$store.state.fileOption.filePath) {
                this.$store.commit('changeCurrentPath', item.path)
              }
              this.$store.commit('changeDownFile', item.path)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
      if (this.$store.state.fileOption.buildFile) {
        if (this.$store.state.fileOption.currentPath === '/') {
          item.path = '/' + item.name
        } else {
          item.path = this.$store.state.fileOption.currentPath + '/' + item.name
        }
        if (this.oldName !== item.name) { // 当新建文件不使用默认名字时，删除默认名字
          util.delDirName(this.$store.state.fileOption.filePath)
        }
        this.$post('fileapi/operdir', {key: 'create', dirname: item.path, filetype: item.type})
          .then(res => {
            if (res[0] === 500) {
              this.$Message.error('err' + res[2])
              this.$store.state.rightShowData.splice(0, 1)
            } else if (res[0] === 200) {
              this.$Message.success('success' + res[2])
              util.delFile(this.$store.state.leftData, this.$store.state.fileOption.currentPath, 'addFile', item)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
  components: {
    rightMenu
  }
}
</script>

<style>
  @import url('../common/css/frame.css');
  .list-arrang-container{width: 100%;overflow-y: scroll;height: 100%;position: relative}
  .no-select{user-select: none;}
  .list-arrang-container .descript{height: 25px;background: #fff;border-bottom: 1px solid #e3e3e3;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);}
  .list-arrang-container .descript .split-wrapper{width: 100%;height: 25px;overflow: hidden;}
  .split-wrapper .name, .split-wrapper .size, .split-wrapper .type, .split-wrapper .time{
    padding-left: 15px;box-sizing: border-box;cursor: pointer;border-right: 1px solid #eee;
  }
  .split-wrapper .ivu-split-trigger-bar-con.vertical{opacity: 0;height: 25px;}
  .split-wrapper .ivu-split-trigger-vertical{width: 1px;border-left: none;border-right: none;
    border-bottom: 1px solid #e3e3e3;background: #fff;box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);}
  .split-wrapper .name p, .split-wrapper .size p, .split-wrapper .type p, .split-wrapper .time p{
    height: 25px;line-height: 25px;font-size: 14px;color: #448;overflow: hidden;white-space: nowrap;
    text-overflow: ellipsis;
  }
  .split-wrapper .size p i, .split-wrapper .time p i{float: right;display: block;margin: 6px 6px 0 0;}
  .split-wrapper .name:hover, .split-wrapper .size:hover, .split-wrapper .type:hover, .split-wrapper .time:hover{
    background: #e5f3ff;
  }
  .list-arrang-container .list-content{width: 100%;padding: 5px 0 0 0px;}
  .list-arrang-container .list-content .list{display: flex;height: 28px;width: 100%;font-size: 12px;line-height: 28px;color: #335;position: relative;cursor: pointer;}
  .list-arrang-container .list-content .list:nth-child(2n){background: #fffbf1;}
  .list-arrang-container .list-content .list.active{background: #e5f3ff;transition: all .2s;}
  .list-arrang-container .list-content .list:hover{background: #e5f3ff;transition: all .2s;}
  .list .list-item-name, .list .list-item-type, .list .list-item-size, .list .list-item-time{padding-left: 10px;box-sizing: border-box;}
  .list-arrang-container .list-content .list .list-item-name{width: calc(25% - 0.5px);}
  .list-arrang-container .list-content .list .list-item-name i{float: left;width: 20px;height: 20px;margin-top: 4px;background-image: url('../../assets/image/menu_icon.png');
  background-size: 100%;vertical-align: top;}
  .list-arrang-container .list-content .list .list-item-type{width: calc(19% - 3.5px);}
  .list-arrang-container .list-content .list .list-item-size{width: 14%;}
  .list .list-item-name p, .list .list-item-type p, .list .list-item-size p, .list .list-item-time p{overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
  .list .list-item-name p.unactive{display: none}
  .list .list-item-name p{display: block;cursor: text;}
  .list .hover-show{display: none;}
  .list:hover .hover-show{display: block}
  .list-arrang-container .list-content .list.active .hover-show{display: block;}
  .list .hover-show .chose{position: absolute;display: block;top: 4px;right: 38px;width: 12px;height: 12px;cursor: pointer;
    color: rgba(0, 0, 0, 0.05);font-size: 16px;}
  .list .hover-show .chose:hover{color: rgba(0, 0, 0, 0.2)}
  .list .hover-show i.chose.active{color: #3b8cff;}
  .list .hover-show button.more{display: block;position: absolute;top: 5px;right: 8px;width: 14px;height: 14px;
    border: 1px solid #ddd;text-align: center;background: #fff;cursor: pointer;line-height: 14px;}
  .list .hover-show button.more i{font-size: 12px;color: #999;}
  .list .hover-show button.more:hover{border-color: #3399ff;}
  .list .hover-show button.more i:hover{color: #3399ff;}
  input.rename{display: none;height: 26px;padding:0 5px;background: #fff;border: none;}
  input.active{display: block;}
  .null{width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;color: #aaa;text-align: center;}
</style>
