const path = require('path')
const bcrypt = require('bcrypt')
const crypto = require('crypto')


const FILES_DIR = process.env.ENDAAMAN_FILES_DIR || path.join(process.cwd(), FILES_DIR_NAME)
const ARTICLES_DIR_NAME = 'articles'
const ARTICLES_DIR = path.join(FILES_DIR, ARTICLES_DIR_NAME)

const PASSWORD_HASH = process.env.ENDAAMAN_PASSWORD || bcrypt.hashSync('hogehoge', bcrypt.genSaltSync(10))
const SECRET_KEY_BASE = process.env.SECRET_KEY_BASE || crypto.randomBytes(48).toString('hex')

module.exports = {
  FILES_DIR,
  ARTICLES_DIR_NAME,
  ARTICLES_DIR: path.join(FILES_DIR, ARTICLES_DIR_NAME),
  PASSWORD_HASH,
  SECRET_KEY_BASE
}
