<template>
  <div class="tree-container">
    <ul>
      <li v-for="(item, index) in list" :key="index" :class="{'user-select': userSelect}">
        <p @mouseover="mouseIn(item.name)" @mouseout="mouseLeave" :class="{'active': activeName.indexOf(item.name) > -1 && hierarch === item.level}"
           @click.stop="leftItemClick(item)" @contextmenu.prevent="contextMenu($event, item)">
          <i class="space" :style="{width: item.level * 5 + 'px'}"></i>
          <i class="fa down" :class="[item.expand ? 'fa-angle-down' : 'fa-angle-right']"
             @click.stop="expandCat(item)" v-if="item.childrens.length > 0"></i>
          <i v-else style="width: 7px;display: inline-block;"></i>
          <i class="fa fa-folder"></i>
          <input :class="{'rename': activeName.indexOf(item.name) > -1 && renameFunc}" v-focus="focusStatus"
          @keyup.enter="$event.target.blur" @blur="inpComplete(item)" :placeholder="item.name"
          v-model="inpCont">
          <span :class="{'rename': activeName.indexOf(item.name) > -1 && renameFunc}">{{item.name}}</span>
          <a class="btn" v-if="hoverName.indexOf(item.name) > -1 || (activeName.indexOf(item.name) > -1 && hierarch === item.level) "
             @click.stop="leftBtnClick($event, item)"><btn-right></btn-right></a>
        </p>
        <tree-list :list="item.childrens" v-if="item.expand"></tree-list>
      </li>
    </ul>
  </div>
</template>

<script>
import btnRight from '../baseVue/btnRight/btn'
import util from '../../util/index'
export default {
  name: 'treeList',
  data () {
    return {
      hoverName: [],
      openChild: [],
      userSelect: false,
      inpCont: '',
      level: 0
    }
  },
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  created () {
    if (this.$store.state.leftActiveName.length === 0) {
      this.getFile('/')
    }
  },
  computed: {
    activeName () {
      return this.$store.state.leftActiveName
    },
    hierarch () {
      return this.$store.state.level
    },
    renameFunc () {
      return this.$store.state.fileOption.rename
    },
    focusStatus () {
      return this.$store.state.fileOption.renameInpShow
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
    expandCat (item) {
      item.expand = !item.expand
    },
    mouseIn (key) {
      this.hoverName = []
      this.hoverName.push(key)
    },
    mouseLeave () {
      this.hoverName.splice(0, 1)
    },
    leftBtnClick (e, item) {
      this.addActiveName(item)
      let arr = []
      let allHig = util.getId('splitLeft').clientHeight
      console.log(allHig)
      arr[0] = e.clientY - 40
      arr[1] = e.clientX
      this.$store.commit('changeLeftMenuShow', true)
      this.$nextTick(() => {
        let allHig = util.getId('splitLeft').clientHeight
        let contentMenuHeight = util.getId('contentMenu').clientHeight
        if (e.clientY + contentMenuHeight > allHig) {
          arr[0] = allHig - contentMenuHeight
        }
        this.$store.commit('changeLeftMenuY', arr)
      })
    },
    leftItemClick (item) {
      this.userSelect = false
      this.$store.commit('changeCurrentPath', item.path)
      this.addActiveName(item)
      this.$store.commit('changeLeftMenuShow', false)
      this.$store.commit('changeLevel', item.level)
      this.getFile(item.path + '/')
    },
    contextMenu (e, item) {
      this.leftBtnClick(e, item)
      this.userSelect = true
      this.$store.commit('changeLevel', item.level)
    },
    inpComplete (item) {
      let obj = {}
      obj.from = item.path
      obj.to = this.inpCont
      if (this.$store.state.fileOption.buildFile) { // 判断是否是新建文件夹
        if (this.inpCont !== '') {
          util.delDirName(this.$store.state.fileOption.filePath)
          item.name = this.inpCont
          this.$store.commit('changeLeftActiveName', this.inpCont)
        }
        let pathArr = item.path.split('/')
        pathArr[0].split()
        pathArr[pathArr.length - 1] = item.name
        item.path = pathArr.join('/')
        this.inpCont = ''
        this.$post('fileapi/operdir', {key: 'create', dirname: pathArr.join('/'), filetype: 'dir'})
          .then(res => {
            if (res[0] === 200) {
              this.$Message.success('新建成功')
            } else if (res[0] === 500) {
              this.$Message.error('err' + res[2])
              util.delFile(this.$store.state.leftData, this.$store.state.fileOption.filePath, 'error')
            }
            this.$store.commit('changeBuildFile', false)
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$post('/fileapi/operdir', {key: 'rename', content: JSON.stringify(obj)})
          .then(res => {
            if (res[0] === 200) {
              this.$Message.success('重名成功')
              this.$emit('initPath')
              item.name = this.inpCont
              item.path = util.pathModifer(item.name, item.path)
              if (this.$store.state.fileOption.currentPath === this.$store.state.fileOption.filePath) {
                this.$store.commit('changeCurrentPath', item.path)
              }
              this.$store.commit('changeDownFile', item.path)
            } else if (res[0] === 500) {
              this.$Message.error(res[2])
            }
            this.inpCont = ''
          })
          .catch(err => {
            console.log(err)
          })
      }
      this.$store.commit('changeFileName', false)
      this.$store.commit('changeRenameInpShow', false)
    },
    addActiveName (item) {
      this.$store.commit('changeLeftActiveName', item.name)
      this.$store.commit('changeDownFile', item.path)
    },
    getFile (path) {
      this.$store.commit('changeMoreListShow', false)
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
    init (str) {
      this.$post('/fileapi/operdir', {key: str})
        .then(res => {
          if (res[0] === 500) {
            this.$Message.error('打开失败：' + res[2])
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  components: {
    btnRight
  }
}
</script>

<style scoped>
  .tree-container{width: 100%;overflow: hidden;position: relative;}
   ul{width: 100%;}
   ul li{position: relative;width: 100%;margin-bottom: 4px;z-index: 3;
  box-sizing: border-box;line-height: 26px;}
   ul li p.active{background: #cce8ff;border: 1px solid #99d1ff;color: #335;}
   ul li p.active .btn{display: block;}
   ul li p{width: 100%;height: 26px;line-height: 26px;cursor: pointer;color: #333;font-size: 14px;white-space: nowrap;
   overflow: hidden;text-overflow: ellipsis;transition: all .2s;border: 1px solid transparent;}
   ul li p i{display: inline-block;vertical-align: middle;color: rgb(255, 227, 133);margin-right: 5px;cursor: pointer;font-size: 20px;
  line-height: 26px;}
  ul li p:hover{background: #e5f3ff;}
  ul li p i.space{display: inline-block;}
  ul li p i.down{width: 13px;margin-right: 0;color: #333;transition: all .2s;font-size: 18px;}
  ul li p i.fa-angle-down{color: #76bdf7}
   ul li p i.down:hover{color: #76bdf7}
   ul li p input{display: none;width: 50%;height: 20px;padding: 0 5px;line-height: 20px;border: none;}
   ul li p input.rename{display: inline-block;}
   ul li p span{display: inline-block;}
   ul li p span.rename {display: none;}
   ul li p span.space{width: 10px;}
  .user-select{user-select: none}
</style>
