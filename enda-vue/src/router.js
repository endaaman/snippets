import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Home = { template: '<div>home</div>' }
const NotFound = { template: '<div>404</div>' }

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '*', component: NotFound }
  ],
})
