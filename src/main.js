// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import iview from 'iview'
import 'iview/dist/styles/iview.css'
import store from './store/index'
import {fetch, post} from './util/http'
import ace from 'ace-builds'
import componentsInstall from './components/Install'

Vue.config.productionTip = false
Vue.use(iview)
Vue.use(ace)
Vue.use(componentsInstall)
Vue.prototype.$post = post
Vue.prototype.$fetch = fetch

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
