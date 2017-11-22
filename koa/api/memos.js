const Router = require('koa-router')
const config = require('../config')


const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = await ctx.memoService.getMemos()
})

module.exports = router
