import Vue from 'vue'
import App from './App'
import router from './router'


const app = new Vue(App)
router.onReady(() => {
  app.$mount('#app')
})
