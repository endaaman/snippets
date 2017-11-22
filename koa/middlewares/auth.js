const jwt = require('jsonwebtoken')
const util = require('util')
const config = require('../config')

const jwtVerify = util.promisify(jwt.verify)

module.exports = async (ctx, next) => {
  const authStyle = 'Bearer'

  if (!ctx.request.header.authorization) {
    await next()
    return
  }

  const parts = ctx.request.header.authorization.split(' ')
  const validTokenStyle = parts.length === 2 && parts[0] === authStyle
  if (!validTokenStyle) {
    await next()
    return
  }
  const token = parts[1]
  try {
    const decoded = await jwtVerify(token, config.SECRET_KEY_BASE)
  }
  catch (e) {
    // console.log(e)
    ctx.body = e
    await next()
    return
  }

  ctx.authorized = true
  await next()
}
