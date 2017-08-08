import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import 'milligram/dist/milligram.min.css'
import 'element-ui/lib/theme-default/index.css'

import { createStore } from './store'
import { createRouter } from './router'
import Root from './root'
import './styles/index.css'



Vue.use(Vuex)
Vue.use(Router)
Vue.use(ElementUI)

const router = createRouter()
const store = createStore({})

const root = new Vue({...Root, ...{ router, store }})
router.onReady(() => {
  root.$mount('#root')
})
