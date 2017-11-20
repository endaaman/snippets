const Router = require('koa-router')

const router = new Router()

router.get('/', async (ctx, next) => {
  await new Promise((r) =>  {
    setTimeout(r, 5000)
  })
  ctx.body = 'Hello Koa'
})

router.get('/:id', async (ctx, next) => {
  await new Promise((r) =>  {
    setTimeout(r, 1000)
  })
  console.log(ctx.params.id)
  ctx.body = 'id'
})

module.exports = router
