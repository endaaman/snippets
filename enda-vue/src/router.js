import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/home'

Vue.use(Router)

const NotFound = { template: '<div>404</div>' }

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '*', component: NotFound }
  ],
})
