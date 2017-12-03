const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const koaJson = require('koa-json')
const koaBody = require('koa-bodyparser')
const serve = require('koa-static')
const cors = require('@koa/cors');

const config = require('./config')

const tokenByHeaderMiddleware = require('./middleware/token-by-header')
const tokenByCookieMiddleware = require('./middleware/token-by-cookie')
const authMiddleware = require('./middleware/auth')
const authStaticMiddleware = require('./middleware/auht-static')
const apiRouter = require('./endpoint')


const apiApp = new Koa()
apiApp.context.token = null
apiApp.context.authorized = false
apiApp
  .use(koaJson({pretty: false, param: 'pretty'}))
  .use(cors({
    origin: ['http://localhost:3000'],
    allowMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'If-Modified-Since'],
  }))
  .use(koaBody())
  .use(tokenByHeaderMiddleware)
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods())
  .listen(3001)

const staticApp = new Koa()
staticApp.context.token = null
staticApp.context.authorized = false
staticApp
  .use(tokenByCookieMiddleware)
  .use(authMiddleware)
  .use(authStaticMiddleware)
  .use(serve(config.SHARED_DIR))
  .listen(3002)
