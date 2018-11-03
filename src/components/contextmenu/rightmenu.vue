<template>
  <transition name="slideDown">
    <div class="context-menu" :style="{'top': pageY + 'px', 'left': pageX + 'px'}">
      <ul>
        <li v-if="!leftContextShow" @click.stop="openDir">
          <a href="javascript:;"><menu-icon :pos-x="-17" :pos-y="-16"></menu-icon>打开</a>
        </li>
        <li @click="downFile">
          <a href="javascript:;"><menu-icon :pos-x="-16" :pos-y="-48"></menu-icon>下载</a>
        </li>
        <li class="divider"></li>
        <li @click="copyClickhandle">
          <a href="javascript:;"><menu-icon :pos-y="-96"></menu-icon>复制</a>
        </li>
        <li @click="shear">
          <a href="javascript:;"><menu-icon :pos-x="-16" :pos-y="-80"></menu-icon>剪切</a>
        </li>
        <li v-if="leftContextShow" @click="paste">
          <a href="javascript:;"><menu-icon :pos-x="-16" :pos-y="-64"></menu-icon>粘贴</a>
        </li>
        <li @click="renameClickHandle">
          <a href="javascript:;"><menu-icon :pos-y="-64"></menu-icon>重命名</a>
        </li>
        <li @click="delet">
          <a href="javascript:;"><menu-icon :pos-y="-80"></menu-icon>删除</a>
        </li>
        <li class="creat-compress" v-if="!leftContextShow">
          <a href="javascript:;"><menu-icon :pos-x="-16" :pos-y="-32"></menu-icon>创建压缩包</a>
          <i class="fa fa-angle-right"></i>
          <dl :class="{right: compressRight}">
            <dd v-for="(item, index) in compressType" :key="index" @click="compressClick(index)">
              <a href="javascript:;">
                <menu-icon :pos-x="-16" :pos-y="-32"></menu-icon>
                {{item}}文件夹
              </a>
            </dd>
          </dl>
        </li>
        <li class="divider"></li>
        <li v-if="leftContextShow" @click="newFileClick">
          <a href="javascript:;"><menu-icon :pos-y="-16"></menu-icon>新建文件夹</a>
        </li>
        <li>
          <a href="javascript:;"><i class="fa fa-info-circle" aria-hidden="true"></i>属性</a>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import menuIcon from '../baseVue/menuicon/menuIcon'
import util from '../../util/index'
export default {
  name: 'rightmenu',
  data () {
    return {
      compressType: ['TAR', 'TAR.GZ', 'TAR,BZ2', 'ZIP']
    }
  },
  props: {
    pageX: {
      default: 0,
      type: Number
    },
    pageY: {
      default: 0,
      type: Number
    },
    compressRight: {
      default: false,
      type: Boolean
    },
    leftContextShow: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    openDir () {
      let item = util.rightDataFea(this.$store.state.rightShowData)
      this.$emit('on-open-file', item[1])
    },
    downFile () {
      this.$store.commit('changeRightMenuShow', false)
      let downPath = ''
      if (this.$store.state.leftMenuShow) {
        downPath = this.$store.state.fileOption.filePath
      } else {
        downPath = util.rightDataFea(this.$store.state.rightShowData)[1].path
      }
      this.$fetch('/fileapi/downfile', {filename: downPath}, 'arraybuffer')
        .then(res => {
          if (res[0] === 500) {
            this.$Message.error('err' + res[2])
          } else {
            let blob = new Blob([res])
            if (window.navigator.msSaveOrOpenBlob) {
              // 兼容IE10
              navigator.msSaveBlob(blob, util.rightDataFea(this.$store.state.rightShowData)[1].name)
            } else {
              //  chrome/firefox
              let aTag = document.createElement('a')
              aTag.download = util.rightDataFea(this.$store.state.rightShowData)[1].name
              aTag.href = URL.createObjectURL(blob) // 创建一个url对象，该对象的url指向bolb对象或file对象
              aTag.click()
              URL.revokeObjectURL(aTag.href) // 释放url对象，否则页面关闭后自动释放
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    copy () {
      this.$store.commit('changeRightMenuShow', false)
      let copyPath = []
      if (this.$store.state.leftMenuShow) {
        copyPath.push(this.$store.state.fileOption.filePath)
      } else {
        let item = util.rightDataFea(this.$store.state.rightShowData)[1]
        let arr = item.path.split('/')
        if (arr[arr.length - 1] !== item.name) {
          arr[arr.length - 1] = item.name
          item.path = arr.join('/')
        }
        copyPath.push(item.path)
      }
      if (copyPath.length !== 0) {
        this.$Message.success('复制成功,剪贴板已被覆盖')
        this.$store.commit('changeCopyPath', copyPath)
      } else {
        this.$Message.error('复制失败')
      }
    },
    copyClickhandle () {
      this.$store.commit('changeCopyType', 'copy')
      this.copy()
      if (this.$store.state.leftMenuShow) {
        this.$store.commit('changeType', 'dir')
      } else {
        console.log(util.rightDataFea(this.$store.state.rightShowData)[1].type)
        this.$store.commit('changeType', util.rightDataFea(this.$store.state.rightShowData)[1].type)
      }
    },
    paste () {
      let pastePath = this.$store.state.fileOption.copyPath
      let obj = {}
      if (pastePath.length <= 0) {
        this.$Message.error('粘贴失败，当前剪贴板为空')
      } else if (this.$store.state.fileOption.copyType === 'copy') {
        obj.from = pastePath
        obj.to = this.$store.state.fileOption.filePath
        this.$post('/fileapi/operdir', {key: 'cp', content: JSON.stringify(obj)})
          .then(res => {
            if (res[0] === 500) {
              this.$Message.error('err' + res[2])
            } else if (res[0] === 200) {
              this.$Message.success('粘贴成功')
              if (this.$store.state.fileOption.type === 'dir') {
                let item = util.copy(this.$store.state.leftData, this.$store.state.fileOption.copyPath[0])
                util.delFile(this.$store.state.leftData, this.$store.state.fileOption.filePath, 'addFile', item)
              } else if (this.$store.state.fileOption.type.length > 1) {
                for (let i = 0; i < this.$store.state.fileOption.type.length; i++) {
                  if (this.$store.state.fileOption.type[i] === 'dir') {
                    let item = util.copy(this.$store.state.leftData, this.$store.state.fileOption.copyPath[i])
                    util.delFile(this.$store.state.leftData, this.$store.state.fileOption.filePath, 'addFile', item)
                  }
                }
              }
              this.judgeUpdata()
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else if (this.$store.state.fileOption.copyType === 'shear') {
        obj.from = pastePath
        obj.to = this.$store.state.fileOption.filePath
        this.$post('/fileapi/operdir', {key: 'move', content: JSON.stringify(obj)})
          .then(res => {
            if (res[0] === 500) {
              this.$Message.error('err' + res[2])
            } else if (res[0] === 200) {
              this.$Message.success('剪贴成功')
              if (this.$store.state.fileOption.type === 'dir') {
                let item = util.copy(this.$store.state.leftData, this.$store.state.fileOption.copyPath[0])
                util.delFile(this.$store.state.leftData, this.$store.state.fileOption.copyPath[0], 'del')
                util.delFile(this.$store.state.leftData, this.$store.state.fileOption.filePath, 'addFile', item)
              } else if (this.$store.state.fileOption.type.length > 1) {
                for (let i = 0; i < this.$store.state.fileOption.type.length; i++) {
                  if (this.$store.state.fileOption.type[i] === 'dir') {
                    let item = util.copy(this.$store.state.leftData, this.$store.state.fileOption.copyPath[i])
                    util.delFile(this.$store.state.leftData, this.$store.state.fileOption.copyPath[i], 'del')
                    util.delFile(this.$store.state.leftData, this.$store.state.fileOption.filePath, 'addFile', item)
                  }
                }
              }
              this.judgeUpdata()
            }
          })
          .catch(err => {
            this.$Message.error('err' + err)
          })
      }
    },
    shear () {
      this.$store.commit('changeCopyType', 'shear')
      this.copy()
      if (this.$store.state.leftMenuShow) {
        this.$store.commit('changeType', 'dir')
      } else {
        this.$store.commit('changeType', util.rightDataFea(this.$store.state.rightShowData)[1].type)
      }
    },
    delet () {
      if (this.$store.state.leftMenuShow) {
        this.$store.commit('changeWhereCli', 'left')
      } else if (this.$store.state.fileOption.rightMenuShow) {
        this.$store.commit('changeWhereCli', 'right')
      }
      this.$store.commit('changeRightMenuShow', false)
      this.$Modal.confirm({
        title: '删除确认',
        content: `<p>${this.$store.state.fileOption.filePath}</p><p>确定删除选中内容吗？</p>`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          let delPath = this.$store.state.fileOption.filePath
          let delArr = []
          delArr.push(delPath)
          this.$post('/fileapi/operdir', {key: 'delfile', content: JSON.stringify(delArr)})
            .then(res => {
              if (res[0] === 500) {
                this.$Message.error('err' + res[2])
              } else if (res[0] === 200) {
                this.$Message.success('删除成功')
                util.delDirName(this.$store.state.fileOption.filePath)
                util.delFile(this.$store.state.leftData, this.$store.state.fileOption.filePath, 'del')
                if (this.$store.state.fileOption.whereCli === 'right') {
                  this.getFile(this.$store.state.fileOption.currentPath + '/')
                }
              }
            })
        }
      })
    },
    renameClickHandle () {
      if (this.$store.state.leftMenuShow) {
        this.$store.commit('changeFileName', true)
        this.$store.commit('changeRenameInpShow', true)
      } else if (this.$store.state.fileOption.rightMenuShow) {
        let item = util.rightDataFea(this.$store.state.rightShowData)
        this.$store.commit('changeCurrentName', item[0])
        this.$store.commit('changeRightMenuShow', false)
      }
    },
    newFileClick () {
      if (this.$store.state.leftMenuShow) {
        let obj = util.newFileNumber()
        let level = this.$store.state.level + 1
        obj.expand = false
        obj.check = true
        obj.childrens = []
        obj.type = 'dir'
        util.recNewData(this.$store.state.leftData, this.$store.state.fileOption.filePath, obj)
        this.$store.commit('changeLeftActiveName', obj.name)
        this.$store.commit('changeLevel', level)
      }
      this.$store.commit('changeFileName', true)
      this.$store.commit('changeRenameInpShow', true)
      this.$store.commit('changeBuildFile', true)
    },
    getFile (path) { // 刷新右边数据
      this.$post('/fileapi/operdir', {key: 'show_dir', dir: path})
        .then(res => {
          let arr = []
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
            arr.push(obj)
          }
          this.$store.commit('changeRightShowData', arr)
        })
        .catch(err => {
          this.$Message.error('err' + err)
        })
    },
    judgeUpdata () { // 判断是否在当前目录下进行粘贴
      if (this.$store.state.fileOption.filePath === this.$store.state.fileOption.currentPath) {
        this.getFile(this.$store.state.fileOption.currentPath + '/')
      } else if (this.$store.state.fileOption.copyType === 'shear') {
        this.getFile(this.$store.state.fileOption.currentPath + '/')
      }
    },
    compressClick (index) { // 压缩
      let arr = []
      let file = this.rightDataFea()[1]
      arr[0] = this.$store.state.fileOption.currentPath
      arr[1] = file.path
      this.$store.commit('changeRightMenuShow', false)
      this.$post('fileapi/operdir', {key: 'zip', type: index + 1, filename: JSON.stringify(arr), zipname: file.name})
        .then(res => {
          if (res[0] === 500) {
            this.$Message.error('err' + res[2])
          } else if (res[0] === 200) {
            this.$Message.success('success' + res[2])
          }
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  components: {
    menuIcon
  }
}
</script>

<style scoped>
  .context-menu{position: absolute;width: 190px;padding: 8px 0;box-shadow: 4px 5px 10px rgba(0, 0, 0, 0.2);
  border-radius: 3px;border: 1px solid rgba(0, 0, 0, 0.1);z-index: 99999;background: #ffffff;}
  .context-menu ul{width: 100%;}
  .context-menu ul li{position: relative;width: 100%;height: 25px;line-height: 25px;white-space: nowrap; padding: 0 15px 0 20px;
  color: #222;}
  .context-menu ul li.divider{height: 2px;margin: 2px 0 4px 0;border-bottom: 1px solid #eee;line-height: 0}
  .context-menu ul li:hover{background: #e1e1e1;color: #444}
  .context-menu ul li.creat-compress:hover dl{display: block;}
  .context-menu ul li.divider:hover{background: none;}
  .context-menu ul li a{display: inline-block;width: 100%;height: 25px;line-height: 25px;color: #222;font-size: 14px;}
  .context-menu ul li a i{display: inline-block;width: 16px;height: 16px;margin-right: 10px;background-image: url('../../assets/image/menu_icon.png');
  background-size: auto;background-repeat: no-repeat;vertical-align: middle;box-sizing: content-box;}
  .context-menu ul li a i.fa{background: none;color: #6db9f5}
  .context-menu ul li dl{position: absolute;display: none;top: 0px;right: -192px;width: 190px;padding: 8px 0;border: 1px solid rgba(0, 0, 0, 0.1);
    background: #ffff;box-shadow: 4px 5px 10px rgba(0, 0, 0, 0.2);}
  .context-menu ul li dl.right{left: -192px;}
  .context-menu ul li dl dd:hover{background: #e1e1e1;}
  .context-menu ul li dl dd{height: 25px;line-height: 25px;padding: 0 15px 0 20px;}
  .context-menu ul li dl dd i.zip-compress, .context-menu ul li dl dd i.tar-compress, .context-menu ul li dl dd i.gzip-compress{background-position: -16px -32px;}
  .slideDown-enter-active, .slideDown-leave-active{
    transition: all .5s;
    opacity: 1;
    transform: translateY(0px);
  }
  .slideDown-enter, .slideDown-leave-to{
    transform: translateY(-15px);
    opacity: 0;
  }
</style>
