import Vue from 'vue'
import Root from './root'
import router from './router'


const root = new Vue(Root)
router.onReady(() => {
  root.$mount('#root')
})
