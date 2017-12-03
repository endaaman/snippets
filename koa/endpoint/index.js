const Router = require('koa-router')


const articlesRouter = require('./articles')
const filesRouter = require('./files')
const sessionsRouter = require('./sessions')


const router = new Router()

router.use('/articles', articlesRouter.routes(), articlesRouter.allowedMethods())
router.use('/files', filesRouter.routes(), filesRouter.allowedMethods())
router.use('/sessions', sessionsRouter.routes(), sessionsRouter.allowedMethods())

router.get('/', (ctx) => {
  ctx.body = {
    message: 'Hi, this is endaaman\' api server'
  }
})

module.exports = router
