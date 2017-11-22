const Router = require('koa-router')
const config = require('../config')
const { getMemos } = require('../handlers/memo')


const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = await getMemos()
})

module.exports = router
