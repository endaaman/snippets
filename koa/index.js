const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const koaJson = require('koa-json')
const koaBody = require('koa-bodyparser')

const authMiddleware = require('./middleware/auth.js')

const articlesRouter = require('./endpoint/articles')
const filesRouter = require('./endpoint/files')
const sessionRouter = require('./endpoint/session')


const app = new Koa()
const router = new Router()

app.context.authorized = false

router.use('/articles', articlesRouter.routes(), articlesRouter.allowedMethods())
router.use('/files', filesRouter.routes(), filesRouter.allowedMethods())
router.use('/sessions', sessionRouter.routes(), sessionRouter.allowedMethods())

app
  .use(koaJson({pretty: false, param: 'pretty'}))
  .use(koaBody())
  .use(authMiddleware)
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000)
