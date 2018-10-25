<template>
  <transition name="slideDown">
    <div class="context-menu" :style="{'top': pageY + 'px', 'left': pageX + 'px'}">
      <ul>
        <li v-if="!leftContextShow">
          <a href="javascript:;"><menu-icon :pos-x="-17" :pos-y="-16"></menu-icon>打开</a>
        </li>
        <li @click="downFile">
          <a href="javascript:;"><menu-icon :pos-x="-16" :pos-y="-48"></menu-icon>下载</a>
        </li>
        <li class="divider"></li>
        <li>
          <a href="javascript:;"><menu-icon :pos-y="-96"></menu-icon>复制</a>
        </li>
        <li>
          <a href="javascript:;"><menu-icon :pos-x="-16" :pos-y="-80"></menu-icon>剪切</a>
        </li>
        <li v-if="leftContextShow">
          <a href="javascript:;"><menu-icon :pos-x="-16" :pos-y="-64"></menu-icon>粘贴</a>
        </li>
        <li @click="renameClickHandle">
          <a href="javascript:;"><menu-icon :pos-y="-64"></menu-icon>重命名</a>
        </li>
        <li>
          <a href="javascript:;"><menu-icon :pos-y="-80"></menu-icon>删除</a>
        </li>
        <li class="creat-compress" v-if="!leftContextShow">
          <a href="javascript:;"><menu-icon :pos-x="-16" :pos-y="-32"></menu-icon>创建压缩包</a>
          <i class="fa fa-angle-right"></i>
          <dl :class="{right: compressRight}">
            <dd><a href="javascript:;"><menu-icon :pos-x="-16" :pos-y="-32"></menu-icon>ZIP文件夹</a></dd>
            <dd><a href="javascript:;"><menu-icon :pos-x="-16" :pos-y="-32"></menu-icon>TAR文件夹</a></dd>
            <dd><a href="javascript:;"><menu-icon :pos-x="-16" :pos-y="-32"></menu-icon>GZIP文件夹</a></dd>
          </dl>
        </li>
        <li class="divider"></li>
        <li v-if="leftContextShow">
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
export default {
  name: 'rightmenu',
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
    downFile () {
      let downArr = this.$store.state.fileOption.downFile
      downArr.forEach((item) => {
        this.$post('/fileapi/')
      })
    },
    renameClickHandle () {
      this.$store.commit('changeFileName', true)
      this.$store.commit('changeRenameInpShow', true)
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
