module.exports = async function(ctx, next) {
  await next()
  ctx.memoService.needUpdate()
}
