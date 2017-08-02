import Module from 'module'
import path from 'path'
import fs from 'fs'
import Vue from 'vue'
import express from 'express'
import { createRenderer } from 'vue-server-renderer'
import pug2vue from '../misc/pug2vue'

const originalRequire = Module.prototype.require;


Module.prototype.require = function(...args){
  if ('.pug' === path.extname(args[0])) {
    const dir = path.dirname(this.filename)
    return pug2vue(fs.readFileSync(path.join(dir, args[0])).toString())
  }
  return originalRequire.apply(this, args);
};

const renderer = createRenderer()
const router = require('./router').default
const App = require('./App').default

router.push('/')
const matchedComponents = router.getMatchedComponents()

const app = new Vue(App)
const html = renderer.renderToString(app, function(e, html) {
  if (e) {
    console.log(e)
    return
  }
  console.log(html)
})

// const server = express()
// server.get('*', (req, res) => {
//   const context = { url: req.url }
//   const app = new Vue(App)
//   router.onReady().then(() => {
//     renderer.renderToString(app, (err, html) => {
//       if (err) {
//         if (err.code === 404) {
//           res.status(404).end('Page not found')
//         } else {
//           res.status(500).end('Internal Server Error')
//         }
//       } else {
//         res.end(html)
//       }
//     })
//   })
// })
// server.listen(8080)
