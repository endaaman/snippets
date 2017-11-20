const Koa = require('koa')
const Router = require('koa-router')
const memoRouter = require('./api/memo')


const app = new Koa()
const router = new Router()


router.use('/api/memos', memoRouter.routes(), memoRouter.allowedMethods())

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000)
