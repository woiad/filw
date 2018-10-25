<template>
  <div class="icon" :style="{'width': wid + 'px', 'height': hig + 'px', marginRight: mg + 'px'}">
    <i :style="{'width': wid + 'px', 'height': hig + 'px', 'backgroundPositionX': posX + 'px',
    'backgroundPositionY': posY + 'px'}"></i>
  </div>
</template>

<script>
export default {
  name: 'menuIcon',
  props: {
    wid: {
      type: Number,
      default: 16
    },
    hig: {
      type: Number,
      default: 16
    },
    posX: {
      type: Number,
      default: 0
    },
    posY: {
      type: Number,
      default: 0
    },
    mg: {
      type: Number,
      default: 10
    }
  }
}
</script>

<style scoped>
  .icon{display: inline-block;vertical-align: sub;margin-right: 4px;}
  .icon i{display: inline-block;background-image: url('../../../assets/image/menu_icon.png');background-size: auto;
  background-repeat: no-repeat}
</style>
