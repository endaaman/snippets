import Vue from 'vue'
import template from './index.jade'


// data を {{ hoge }} で参照していないと不正なレンダリング関数が生成される

export default {
  // render(...args) {
  //   console.log(this)
  //   const c = template.bind(this)(...args)
  //   return c
  // },
  ...template,
  data() {
    return {
      count: 3
    }
  },
}
