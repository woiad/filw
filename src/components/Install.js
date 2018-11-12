import ACE from './ace/ace'

export default {
  install: function (Vue, options) {
    Vue.component('ace', ACE)
  }
}
