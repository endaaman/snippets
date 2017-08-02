import Vue from 'vue'
import router from './router'

export default {
  router,
  metaInfo: {
    title: 'Default Title',
    titleTemplate: '%s - Company Name'
  },
  template: `
    <div id="app">
      <router-view class="view"></router-view>
    </div>
  `
}
