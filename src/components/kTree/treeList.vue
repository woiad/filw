<template>
  <div class="tree-list">
    <ul>
      <li v-for="(item, index) in filterList" :key="index"
          :class="{'active': activeName.indexOf(item.name) >= 0, 'user-select': userSelect}" @click.stop="leftItemClick(item, index)"
          @contextmenu.prevent="contextMenu($event, item)">
        <p><i class="fa fa-folder"></i>
          <input v-focus="focusStatus" @blur="inpComplete(item)"
          :class="{'rename': item.check && renameFunc}" @keyup.enter="$event.target.blur"
          v-model="inpCont" :placeholder="item.name"/>
          <span :class="{'rename': item.check && renameFunc}">{{item.name}}</span></p>
        <div class="btn" @click.stop="leftBtnClick($event, item)"><btn-right></btn-right></div>
        <!--<tree-list :list="item.cList"></tree-list>-->
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
      userSelect: false,
      inpCont: '',
      activeName: []
    }
  },
  props: {
    list: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    filterList () {
      console.log(1)
      let dirList = []
      for (let key in this.list) {
        let obj = {}
        obj['name'] = key
        obj['path'] = this.list[key][0]
        obj['type'] = this.list[key][1]
        obj['access'] = this.list[key][2]
        if (this.list[key][1] === 'dir') {
          dirList.push(obj)
        }
      }
      return dirList.sort(util.compare)
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
    leftBtnClick (e, item) {
      this.addActiveName(item)
      let arr = []
      arr[0] = e.clientY - 40
      arr[1] = e.clientX
      this.$store.commit('changeLeftMenuY', arr)
      this.$store.commit('changeLeftMenuShow', true)
    },
    leftItemClick (data) {
      this.addActiveName(data)
      const str = data.path
      this.init(str)
      this.$store.commit('changeLeftMenuShow', false)
    },
    contextMenu (e, item) {
      this.leftBtnClick(e, item)
      this.userSelect = true
    },
    inpComplete (item) {
      let obj = {}
      obj.from = item.path
      obj.to = this.inpCont
      console.log(this.inpCont)
      this.$post('/fileapi/operdir', {key: 'rename', content: JSON.stringify(obj)})
        .then(res => {
          if (res[0] === 200) {
            this.$Message.success('重名成功')
            this.$emit('initPath')
          } else if (res[0] === 500) {
            this.$Message.error(res[2])
          }
          this.inpCont = ''
        })
        .catch(err => {
          console.log(err)
        })
      this.$store.commit('changeFileName', false)
      this.$store.commit('changeRenameInpShow', false)
    },
    addActiveName (item) {
      this.activeName = []
      this.activeName.push(item.name)
      this.$store.commit('changeDownFile', this.activeName)
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
  .tree-list{width: 100%; padding: 10px 0;overflow: hidden;}
  .tree-list ul li{position: relative;width: 100%;height: 26px;margin-bottom: 4px;white-space: nowrap;padding-left: 10px;
  box-sizing: border-box;line-height: 26px;transition: all .2s;border: 1px solid transparent;}
  .tree-list ul li.active{background: #cce8ff;border: 1px solid #99d1ff;}
  .tree-list ul li.active p{color: #335;}
  .tree-list ul li.active .btn{display: block;}
  .tree-list ul li:hover{background: #e5f3ff;}
  .tree-list ul li p{height: 26px;line-height: 26px;cursor: pointer;color: #333;font-size: 14px;}
  .tree-list ul li p i{display: inline-block;vertical-align: middle;color: rgb(255, 227, 133);margin-right: 5px;cursor: pointer;font-size: 20px;
  line-height: 26px;}
  .tree-list ul li p input{display: none;width: 50%;height: 20px;padding: 0 5px;line-height: 20px;border: none;}
  .tree-list ul li p input.rename{display: inline-block;}
  .tree-list ul li p span{display: inline-block;}
  .tree-list ul li p span.rename {display: none;}
  .tree-list ul li .btn{display: none;}
  .tree-list ul li:hover .btn{display: block;}
  .user-select{user-select: none}
</style>
