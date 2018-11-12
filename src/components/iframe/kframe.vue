<template>
  <div class="iframe-container">
    <div class="load" v-if="loadShow">
      <img src="../../../static/image/loading-0.gif">
    </div>
    <div class="iframe-wrapper" ref="popUp" v-else>
      <div class="iframe-top">
        <p>{{title}}</p>
        <div class="max" @click="handkleMax">
          <i class="fa fa-square-o" aria-hidden="true"></i>
        </div>
        <div class="close" @click="close">
          <i class="fa fa-close" aria-hidden="true"></i>
        </div>
      </div>
      <div class="content">
        <ace v-model="value" :file-type="type"></ace>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'kframe',
  data () {
    return {
      max: false
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    loadShow: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.$emit('changeValue', this.value)
  },
  methods: {
    close () {
      this.$emit('close')
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
  }
}
</script>

<style scoped>
  .iframe-container{position: fixed;top: 0; left: 0;bottom: 0; right: 0;z-index: 1000;
background: rgba(0, 0, 0, .3)}
  .iframe-wrapper{position: relative;width: 600px;height: 600px;left: 50%;margin-left: -300px;top: 50%;
  margin-top: -300px;background: #ffffff;box-shadow: 0px 0px 20px rgba(0, 0, 0, .3);}
  .iframe-wrapper .iframe-top{position: relative;width: 100%;height: 42px;line-height: 42px;border-bottom: 1px solid #eee;
  font-size: 14px;color: #333;border-radius: 2px 2px 0 0;background: #f8f8f8;}
  .iframe-wrapper .iframe-top p{padding-left: 10px;}
  .iframe-wrapper .iframe-top .max, .iframe-wrapper .iframe-top .close{position: absolute;width: 40px; height: 30px;
  line-height: 30px; text-align: center;color: #222;cursor: pointer;}
  .iframe-wrapper .iframe-top .close{right: 0;top: 0;}
  .iframe-wrapper .iframe-top .close:hover{background: red;color: #fff;}
  .iframe-wrapper .iframe-top .max{right: 40px;top: 0;}
  .iframe-wrapper .iframe-top .max:hover{background: #ddd;}
  .load{position: absolute;top: 50%;width: 32px;height: 32px;margin-top: -16px;
  left: 50%;margin-left: -16px;}
</style>
