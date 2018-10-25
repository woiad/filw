<template>
  <button class="more">
    <i class="fa fa-caret-down" aria-hidden="true"></i>
  </button>
</template>

<script>
export default {
  name: 'btn'
}
</script>

<style scoped>
  button.more{display: block;position: absolute;top: 5px;right: 8px;width: 14px;height: 14px;
    border: 1px solid #ddd;text-align: center;background: #fff;cursor: pointer;line-height: 14px;}
  button.more i{font-size: 12px;color: #999;}
  button.more:hover{border-color: #3399ff;}
  button.more i:hover{color: #3399ff;}
</style>
