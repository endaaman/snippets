const Router = require('koa-router')


const articlesRouter = require('./articles')
const filesRouter = require('./files')
const sessionRouter = require('./session')


const router = new Router()

router.use('/articles', articlesRouter.routes(), articlesRouter.allowedMethods())
router.use('/files', filesRouter.routes(), filesRouter.allowedMethods())
router.use('/sessions', sessionRouter.routes(), sessionRouter.allowedMethods())

module.exports = router
