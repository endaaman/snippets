const path = require('path')
const Koa = require('koa')
const koaJson = require('koa-json')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const authMiddleware = require('./middlewares/auth.js')
const memoRouter = require('./api/memo')
const sessionRouter = require('./api/session')


const app = new Koa()
const router = new Router()

// app.context.authorized = false

router.use('/memos', memoRouter.routes(), memoRouter.allowedMethods())
router.use('/sessions', sessionRouter.routes(), sessionRouter.allowedMethods())

app
  .use(koaJson({pretty: false, param: 'pretty'}))
  .use(bodyParser())
  .use(authMiddleware)
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000)
