import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/home'
import NotFound from './views/404'

export function createRouter() {
  const r = new Router({
    mode: 'history',
    base: __dirname,
    routes: [
      { path: '/', component: Home },
      { path: '*', component: NotFound }
    ],
  })
  console.log(r)
  return r
}
