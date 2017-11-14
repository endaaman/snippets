import Module from 'module'
import path from 'path'
import fs from 'fs'
import Vue from 'vue'
import express from 'express'
import { createRenderer } from 'vue-server-renderer'
import convertPug from '../misc/convert-pug'

const originalRequire = Module.prototype.require;


Module.prototype.require = function(...args){
  if ('.jade' === path.extname(args[0])) {
    const dir = path.dirname(this.filename)
    return convertPug(fs.readFileSync(path.join(dir, args[0])).toString())
  }
  return originalRequire.apply(this, args);
};

const renderer = createRenderer()
const createRouter = require('./router').createRouter
const Root = require('./root').default

const server = express()
server.get('*', (req, res) => {
  const router = createRouter()
  router.push(req.url)
  const matchedComponents = router.getMatchedComponents()

  const root = new Vue(Root)
  const html = renderer.renderToString(root, function(e, html) {
    if (e) {
      console.log(e)
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})
server.listen(8080)
