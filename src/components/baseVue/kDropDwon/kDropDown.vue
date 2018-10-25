<template>
  <transition name="fade">
    <div class="dropDown-menu">
      <ul>
        <li>
          <a href="javascript:;"><i class="fa fa-user"></i> 个人中心</a>
        </li>
        <li>
          <a href="javascript:;"><i class="fa fa-sign-out"></i> 退出登陆</a>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'kDropDown'
}
</script>

<style scoped>
  @import '../../../assets/font-awesome-4.7.0/css/font-awesome.css';
  .dropDown-menu{position: absolute;top: 40px;right: 7px;z-index: 100;min-width: 162px;padding: 5px 0;font-size: 14px;
    margin: 2px 0;list-style: none;background: #fff;border: 1px solid rgba(0, 0, 0, .05);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);max-height: 400px;transition: all .2s linear;}
  .dropDown-menu:after{position: absolute;top: -20px;right: 25px;  content: '';width: 0;height: 0;border: 10px solid #fff;
  border-left-color: transparent;border-top-color: transparent;border-right-color: transparent}
  .dropDown-menu li{list-style: none;}
  .dropDown-menu li:last-child{border-top: 1px solid #eee;}
  .dropDown-menu li a{display: block;height: 35px;padding: 0 1.7em;color: #666;text-decoration: none;line-height: 35px;}
  .dropDown-menu li a i{display: inline-block; width: 18px;}
  .dropDown-menu li:hover{background: #eee;}
  .fade-enter-active, .fade-leave-active{transform: scale(1);}
  .fade-enter, .fade-leave-to{transform: scale(.8);}
</style>
