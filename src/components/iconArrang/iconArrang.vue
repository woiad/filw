<template>
  <div class="icon-arrang-container" @click.stop="clearAll($event)">
    <right-menu v-if="menuShow" :page-x="dis_x" :page-y="dis_y" :compress-right="compressRight" ref="rightmenu"
    @on-open-file="openFile"></right-menu>
    <ul v-if="fileData.length > 0">
      <li v-for="(item, index) in fileData" :key="index" :class="{'active':item.check}" @click.stop="dataForeach(item, index, true)"
          @dblclick="openFile(item)" @contextmenu.prevent="contentMenuRight(item, index, $event)" :ref="item.check ? 'active' : '' " :id="item.check ? 'liActive' : ''">
        <div class="bg_img">
          <img :src="item.src" v-if="item.type.split('/')[0] === 'image'" />
          <img v-else :src="type.indexOf(item.extand) > -1 ? '../../../static/image/' + item.extand + '.png' : '../../../static/image/txt.png'" />
        </div>
        <p @dblclick.stop="textdbClick(item, index)" :class="{'unactive': (currentNameShow === index && item.check) ? true : false}"
           title="双击名称重命名">{{item.name}}</p>
        <div class="rename" :class="{'active': (currentNameShow === index && item.check) ? true : false}">
          <textarea v-focus="item.check" @blur.prevent="confirmName(item)" v-model="item.name"
          @focus="textFocus($event, item)" :style="{'height': currentNameShow === index ? textHeight + 'px' : '36px'}"></textarea>
        </div>
        <div class="hover-show">
          <i class="chose fa fa-check-circle" aria-hidden="true" @click.stop="iconCircleShow(item)" :class="{'active': item.check}"></i>
          <button class="more" @click.stop="ContextmenuShow(item, index, $event)">
            <i class="fa fa-caret-down" aria-hidden="true"></i>
          </button>
        </div>
      </li>
    </ul>
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
import rightMenu from '../contextmenu/rightmenu'
import {FILETYPE} from '../../util/type'
import util from '../../util/index'
export default {
  name: 'iconArrang',
  data () {
    return {
      frameShow: false,
      fileTitle: '',
      fileType: '',
      response: '',
      type: FILETYPE,
      count: 0,
      dis_x: 0,
      dis_y: 0,
      compressRight: false,
      oldName: '',
      ind: '',
      textHeight: 36,
      loadShow: true,
      dataChg: false,
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
    currentNameShow () {
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
  methods: {
    contentMenuPos (ul, li, rightHand, offsetX, offsetY) {
      const rightMeunWid = this.$refs['rightmenu'].$el.clientWidth
      const rightMenuHeight = this.$refs['rightmenu'].$el.clientHeight
      this.compressRight = false
      const allWid = ul.clientWidth
      let allHig = 0
      if (ul.clientHeight > ul.parentElement.clientHeight) {
        allHig = ul.clientHeight
      } else {
        allHig = ul.parentElement.clientHeight
      }
      if (rightHand) {
        this.dis_x = li.offsetLeft + offsetX
        this.dis_y = li.offsetTop + offsetY
      } else {
        this.dis_x = li.offsetLeft + li.clientWidth
        this.dis_y = li.offsetTop + 10
      }
      if (rightMenuHeight + li.offsetTop > allHig) {
        this.dis_y = allHig - rightMenuHeight
      }
      if (this.dis_x + rightMeunWid + 100 > allWid) {
        this.compressRight = true
        this.dis_x = this.dis_x - (li.clientWidth * 2)
      }
    },
    ContextmenuShow (item, index, e) {
      this.$store.commit('changeDownFile', item.path)
      this.$store.commit('changeRightMenuShow', !this.menuShow)
      if (this.menuShow) {
        this.$nextTick(() => {
          if (e.path[0].tagName.toLowerCase() === 'i') {
            this.contentMenuPos(e.path[4], e.path[3])
          } else if (e.path[0].tagName.toLowerCase() === 'button') {
            this.contentMenuPos(e.path[3], e.path[2])
          }
        })
        this.dataForeach(item, index, false)
      }
    },
    contentMenuRight (item, index, e) {
      this.$store.commit('changeRightMenuShow', true)
      this.$store.commit('changeDownFile', item.path)
      if (this.menuShow) {
        this.$nextTick(() => {
          console.log(this.$refs.active)
          this.contentMenuPos(this.$refs.active[0].parentElement, this.$refs.active[0], true, e.offsetX, e.offsetY)
        })
        this.dataForeach(item, index, false)
      }
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
      if (e.target.tagName.toLowerCase() === 'ul' || e.target.tagName.toLowerCase() === 'div') {
        this.$store.commit('changeRightMenuShow', false)
        this.dataForeach(0, -1, false)
        this.$store.commit('changeMoreListShow', false)
        this.count = 0
        this.$store.commit('changeCurrentName', '')
      }
    },
    openFile (item) {
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
    textdbClick (item, index) {
      this.textHeight = 36
      this.$store.commit('changeCurrentName', index)
      this.dataForeach(item, index, true)
    },
    textFocus (e, item) {
      this.oldName = item.name
      const evt = e || window.event
      this.textHeight = evt.path[0].scrollHeight
    },
    confirmName (item) {
      let obj = {}
      obj.from = item.path
      obj.to = item.name
      if (this.oldName !== item.name && !this.$store.state.fileOption.buildFile) {
        this.$post('fileapi/operdir', {key: 'rename', content: JSON.stringify(obj)})
          .then(res => {
            if (res[0] === 500) {
              this.$Message.error('err' + res[2])
            } else if (res[0] === 200) {
              debugger
              this.$Message.success('success' + res[2])
              item.path = util.pathModifer(item.name, item.path)
              // if (this.$store.state.fileOption.currentPath === this.$store.state.fileOption.filePath) {
              //   this.$store.commit('changeCurrentPath', item.path)
              // }
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
    dataForeach (data, ind, bol) {
      if (bol) {
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
  components: {
    rightMenu
  }
}
</script>

<style scoped>
  @import url('../common/css/frame.css');
  .icon-arrang-container{width: 100%;height: 100%;padding: 10px 20px 0 10px;box-sizing: border-box;}
  .icon-arrang-container ul{display: flex;width: 100%;flex-wrap: wrap;flex-direction: row;}
  .icon-arrang-container ul li{position: relative;width: 78px;margin: 10px 10px 0 10px;max-height: 128px;padding: 5px;align-self: end;
  box-sizing: content-box;cursor: pointer;}
  .icon-arrang-container ul li .bg_img{display: flex;width: 71px;height: 70px;justify-content: center;align-items: center;}
  .icon-arrang-container ul li .bg_img img{display: block;max-width: 100%;}
  .icon-arrang-container ul li p{display: -webkit-box;display: -moz-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;
    -moz-box-orient: vertical;-moz-box-clamp: 3;overflow: hidden;font-size: 12px;color: #335;text-align: center;word-break: break-all;
  cursor: text;}
  .icon-arrang-container ul li .hover-show{display: none;}
  .icon-arrang-container ul li:hover{background:#e5f3ff;}
  .icon-arrang-container ul li:hover .hover-show{display: block}
  .icon-arrang-container ul li.active{background: #e5f3ff;}
  .icon-arrang-container ul li.active .hover-show{display: block;}
  .icon-arrang-container ul li .hover-show .chose{position: absolute;display: block;top: 4px;left: 8px;width: 12px;height: 12px;cursor: pointer;
  color: rgba(0, 0, 0, 0.05);font-size: 16px;}
  .icon-arrang-container ul li .hover-show .chose:hover{color: rgba(0, 0, 0, 0.2)}
  .icon-arrang-container ul li .hover-show i.active{color: #3b8cff;}
  .icon-arrang-container ul li .hover-show i.active:hover{color: #3b8cff;}
  .icon-arrang-container ul li .hover-show button.more{display: block;position: absolute;top: 5px;right: 8px;width: 14px;height: 14px;
  border: 1px solid #ddd;text-align: center;background: #fff;cursor: pointer;line-height: 14px;}
  .icon-arrang-container ul li .hover-show button.more i{font-size: 12px;color: #999;}
  .icon-arrang-container ul li .hover-show button.more:hover{border-color: #3399ff;}
  .icon-arrang-container ul li .hover-show button.more i:hover{color: #3399ff;}
  .icon-arrang-container .null{width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;color: #aaa;text-align: center;}
  .icon-arrang-container p.unactive{display: none;}
  .icon-arrang-container .rename{width: 88px;position: absolute;left: 0;display: none;}
  .icon-arrang-container .rename.active{display: block}
  .icon-arrang-container .rename textarea{width: 88px;text-align: center;}
</style>
