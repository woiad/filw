<template>
  <div class="header-container">
    <div class="content">
      <div class="top-left">
        <p>锐讯网络科技</p>
        <div class="nav">
          <ul>
            <li>
              <i class="fa fa-server"></i>
              <a href="javascript:;">文件管理</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="top-right">
        <div class="user" @click="clickHandler" :class="{'active': show}">
          <i class="fa fa-user"></i>
          <a href="javascript:;" style="color: #666;text-decoration: none;">用户管理</a>
          <i class="fa fa-angle-down"></i>
        </div>
        <k-drop-down v-if="show"></k-drop-down>
      </div>
    </div>
  </div>
</template>

<script>
import kDropDown from '../baseVue/kDropDwon/kDropDown'
export default {
  name: 'Header',
  data () {
    return {
      show: false
    }
  },
  methods: {
    clickHandler () {
      this.show = !this.show
    }
  },
  components: {kDropDown}
}
</script>

<style scoped>
  @import '../../assets/font-awesome-4.7.0/css/font-awesome.css';
  .header-container{width: 100%;height: 100%;font-size: 14px;color: #666;}
  .header-container .content{width: 100%;height: 40px;border-bottom: 1px solid #eee;line-height: 40px;}
  .header-container .content .top-left{float: left;width: 70%;height: 40px;line-height: 40px;}
  .header-container .content .top-left p{float: left;display: inline-block;width: 202px;text-align: center;}
  .header-container .content .top-left .nav{display: inline-block;height: 40px;}
  .header-container .content .top-left .nav li{width: 100px;height: 39px;padding: 0 10px;line-height: 38px;list-style: none;
  text-align: center;border: 1px solid #eeeeee;background: #eee;border-left: 1px solid #eee;border-right: 1px solid #eee;}
  .header-container .content .top-left .nav li a{color: #666;text-decoration: none}
  .header-container .content .top-right{float: right; margin-right: 0px;}
  .header-container .content .top-right .user{padding: 0 10px;border-left: 1px solid #eee;cursor: pointer;transition: all .2s}
  .header-container .content .top-right .user:hover{background: #eee;}
  .header-container .content .top-right .user.active{background: #eee;}
</style>
