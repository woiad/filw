// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import iview from 'iview'
import 'iview/dist/styles/iview.css'
import store from './store/index'
import {fetch, post} from './util/http'
import 'jquery'
import '../static/css/layer.css'
import layer from '../static/js/layer'

Vue.config.productionTip = false
Vue.use(iview)
Vue.prototype.$post = post
Vue.prototype.$fetch = fetch
Vue.prototype.$layer = layer

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
