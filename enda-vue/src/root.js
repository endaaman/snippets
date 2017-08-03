import Vue from 'vue'
import router from './router'
import store from './store'
import template from './root.jade'

export default {
  router,
  store,
  metaInfo: {
    title: 'Default Title',
    titleTemplate: '%s - Company Name'
  },
  render: template
}
