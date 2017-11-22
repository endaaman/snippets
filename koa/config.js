const path = require('path')
const bcrypt = require('bcrypt')
const crypto = require('crypto')


module.exports = {
  FILES_DIR: process.env.ENDAAMAN_FILES_DIR || path.join(process.cwd(), 'files'),
  PASSWORD_HASH: process.env.ENDAAMAN_PASSWORD || bcrypt.hashSync('hogehoge', bcrypt.genSaltSync(10)),
  SECRET_KEY_BASE: process.env.SECRET_KEY_BASE || crypto.randomBytes(48).toString('hex'),
}
