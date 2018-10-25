<template>
  <div class="icon-arrang-container" @click.stop="clearAll($event)">
    <right-menu v-if="menuShow" :page-x="dis_x" :page-y="dis_y" :compress-right="compressRight" ref="rightmenu"></right-menu>
    <ul>
      <li v-for="(item, index) in fileData" :key="index" :class="{'active':item.check}" @click="dataForeach(item, index)">
        <div class="bg_img">
          <img :src="item.src" v-if="item.type.split('/')[0] === 'image'" />
          <img v-else :src="'../../../static/image/' + item.type + '.png'" />
        </div>
        <p>{{item.name}}</p>
        <div class="hover-show">
          <i class="chose fa fa-check-circle" aria-hidden="true" @click.stop="iconCircleShow(item)" :class="{'active': item.check}"></i>
          <button class="more" @click.stop="ContextmenuShow(item, index, $event)">
            <i class="fa fa-caret-down" aria-hidden="true"></i>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import rightMenu from '../contextmenu/rightmenu'
export default {
  name: 'iconArrang',
  data () {
    return {
      count: 0,
      menuShow: false,
      dis_x: 0,
      dis_y: 0,
      compressRight: false,
      fileData: [
        {name: '其他', type: 'folder', check: false},
        {name: 'webp', type: 'folder', check: false},
        {name: 'image', type: 'folder', check: false},
        {name: 'triangles-colorful-green-colors-low-poly-dkw-keven-kkkkkk.png', type: 'image/png', check: false, src: '../../../static/image/test01.png'},
        {name: '其他', type: 'folder', check: false},
        {name: 'webp', type: 'folder', check: false},
        {name: 'jpeg', type: 'folder', check: false},
        {name: 'xx', type: 'doc', check: false},
        {name: '数据分析', type: 'xlsx', check: false},
        {name: '酷炫ppt', type: 'ppt', check: false},
        {name: 'xx', type: 'doc', check: false},
        {name: '数据分析', type: 'xlsx', check: false},
        {name: '酷炫', type: 'ppt', check: false}
      ]
    }
  },
  methods: {
    ContextmenuShow (item, index, e) {
      this.menuShow = true
      this.$nextTick(() => {
        const rightMeunWid = this.$refs['rightmenu'].$el.clientWidth
        if (e.path[0].tagName.toLowerCase() === 'i') {
          const allWidth = e.path[4].clientWidth
          this.dis_x = e.path[3].offsetLeft + e.path[3].clientWidth
          this.dis_y = e.path[3].offsetTop + 10
          this.compressRight = false
          if (this.dis_x + rightMeunWid + 100 > allWidth) {
            this.compressRight = true
            this.dis_x = this.dis_x - (e.path[3].clientWidth * 2)
          }
        } else if (e.path[0].tagName.toLowerCase() === 'button') {
          this.compressRight = false
          const allWid = e.path[3].clientWidth
          this.dis_x = e.path[2].offsetLeft + e.path[2].clientWidth
          this.dis_y = e.path[2].offsetTop + 10
          if (this.dis_x + rightMeunWid + 100 > allWid) {
            this.compressRight = true
            this.dis_x = this.dis_x - (e.path[3].clientWidth * 2)
          }
        }
      })
      this.dataForeach(item, index)
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
      if (e.target.tagName.toLowerCase() === 'ul') {
        this.menuShow = false
        this.dataForeach(0, -1)
        this.$store.commit('changeMoreListShow', false)
        this.count = 0
      }
    },
    dataForeach (data, ind) {
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
  components: {
    rightMenu
  }
}
</script>

<style scoped>
  .icon-arrang-container{width: 100%;height: 100%;padding: 10px 20px 0 10px;box-sizing: border-box;}
  .icon-arrang-container ul{display: flex;width: 100%;height: 100%;overflow: hidden;flex-wrap: wrap;flex-direction: row;}
  .icon-arrang-container ul li{position: relative;width: 78px;margin: 10px 10px 0 10px;max-height: 128px;padding: 10px;align-self: end;
  box-sizing: content-box;cursor: pointer;}
  .icon-arrang-container ul li .bg_img{display: flex;width: 71px;height: 70px;justify-content: center;align-items: center;}
  .icon-arrang-container ul li .bg_img img{display: block;max-width: 100%;}
  .icon-arrang-container ul li p{display: -webkit-box;display: -moz-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;
    -moz-box-orient: vertical;-moz-box-clamp: 3;overflow: hidden;font-size: 12px;color: #335;text-align: center;word-break: break-all;}
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
</style>
