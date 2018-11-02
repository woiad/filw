<template>
  <div class="icon-arrang-container" @click.stop="clearAll($event)">
    <right-menu v-if="menuShow" :page-x="dis_x" :page-y="dis_y" :compress-right="compressRight" ref="rightmenu"
    @on-open-file="openFile"></right-menu>
    <ul v-if="fileData.length > 0">
      <li v-for="(item, index) in fileData" :key="index" :class="{'active':item.check}" @click.stop="dataForeach(item, index, true)"
          @dblclick="openFile(item)" @contextmenu.prevent="contentMenuRight(item, index, $event)">
        <div class="bg_img">
          <img :src="item.src" v-if="item.type.split('/')[0] === 'image'" />
          <img v-else :src="type.indexOf(item.extand) > -1 ? '../../../static/image/' + item.extand + '.png' : '../../../static/image/txt.png'" />
        </div>
        <p @dblclick.stop="textdbClick(item, index)" :class="{'unactive': currentNameShow === index ? true : false}">{{item.name}}</p>
        <div class="rename" :class="{'active': currentNameShow === index ? true : false}">
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
  </div>
</template>

<script>
import rightMenu from '../contextmenu/rightmenu'
import {FILETYPE} from '../../util/type'
export default {
  name: 'iconArrang',
  data () {
    return {
      type: FILETYPE,
      count: 0,
      dis_x: 0,
      dis_y: 0,
      compressRight: false,
      oldName: '',
      ind: '',
      textHeight: 36
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
  methods: {
    contentMenuPos (ul, li, rightHand, offsetX, offsetY) {
      const rightMeunWid = this.$refs['rightmenu'].$el.clientWidth
      this.compressRight = false
      const allWid = ul.clientWidth
      if (rightHand) {
        this.dis_x = li.offsetLeft + offsetX
        this.dis_y = li.offsetTop + offsetY
      } else {
        this.dis_x = li.offsetLeft + li.clientWidth
        this.dis_y = li.offsetTop + 10
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
          if (e.path[0].tagName.toLowerCase() === 'img') {
            this.contentMenuPos(e.path[3], e.path[2], true, e.offsetX, e.offsetY)
          } else if (e.path[0].tagName.toLowerCase() === 'li') {
            this.contentMenuPos(e.path[1], e.path[0], true, e.offsetX, e.offsetY)
          } else if (e.path[0].tagName.toLowerCase() === 'p') {
            this.contentMenuPos(e.path[2], e.path[1], true, e.offsetX, e.offsetY)
          }
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
        this.$post('fileapi/operdir', {key: 'updatefile_r', dirname: item.path})
          .then(res => {
            if (res[0] === 'err') {
              this.$Message.error('err' + res[2])
            } else if (res[0] === 500) {
              this.$Message.error('err' + res[2])
            } else {
              this.$layer.open({
                type: 1,
                area: ['600px', '360px'],
                shadeClose: true,
                content: res
              })
            }
            console.log(res)
          })
          .catch(err => {
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
      if (this.oldName !== item.name) {
        this.$post('fileapi/operdir', {key: 'rename', content: JSON.stringify(obj)})
          .then(res => {
            if (res[0] === 500) {
              this.$Message.error('err' + res[2])
            } else if (res[0] === 200) {
              this.$Message.success('success' + res[2])
            }
          })
          .catch(err => {
            console.log(err)
          })
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
