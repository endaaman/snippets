import Module  from 'module'
import express  from 'express'


const originalRequire = Module.prototype.require

Module.prototype.require = function(...args) {
  console.log(args)
  return originalRequire.apply(this, args)
}

require('./app.js')

const server = express()

server.get('*', (req, res) => {
  const context = { url: req.url }
  const { app, router } = createApp()

  router.onReady().then(app => {
    renderer.renderToString(app, (err, html) => {
      if (err) {
        if (err.code === 404) {
          res.status(404).end('Page not found')
        } else {
          res.status(500).end('Internal Server Error')
        }
      } else {
        res.end(html)
      }
    })
  })
})

server.listen(8080)
