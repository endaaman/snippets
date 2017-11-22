const Router = require('koa-router')

const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello Koa'
})

router.get('/:id', async (ctx, next) => {
  ctx.body = `id is ${ctx.params.id}`
})

module.exports = router
