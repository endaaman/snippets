const { needMemosCacheUpdate } = require('../handlers/memo')

module.exports = async function(ctx, next) {
  await next()
  needMemosCacheUpdate()
}
