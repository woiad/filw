<template>
  <div id="app">
    <Main></Main>
  </div>
</template>

<script>
import Main from './components/main'
export default {
  name: 'App',
  components: {
    Main
  }
}
</script>

<style>
*{margin: 0;padding: 0;}
html, body{width: 100%;height: 100%;}
#app {
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>
