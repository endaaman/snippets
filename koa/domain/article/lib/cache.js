const path = require('path')
const fs = require('fs-extra')
const config = require('../../../config')
const { loadArticleFiles } = require('./loader')

let CACHE_DATA = null
let CACHE_REVISION = null

const WARNING_FILE_NAME = '.warning.json'

async function isCacheUpgradeNeeded(data, changedAt) {
  if (!CACHE_REVISION) {
    return true
  }
  const currentRevision = (await fs.stat(config.ARTICLES_DIR)).mtime
  return currentRevision > CACHE_REVISION
}

async function upgradeCache() {
  if (!await isCacheUpgradeNeeded()) {
    console.log('using cache')
    return
  }
  console.log('update cache')

  const results = await loadArticleFiles()

  const articles = []
  const warnings = []
  results.forEach((result) => {
    if (result.warning) {
      warnings.push({
        filename: result.filename,
        warning: result.warning,
      })
    }
    articles.push(result.article)
  })

  CACHE_DATA = articles
  CACHE_REVISION = (await fs.stat(config.ARTICLES_DIR)).mtime.getTime()

  const warningFilePath = path.join(config.ARTICLES_DIR, WARNING_FILE_NAME)

  if (warnings.length > 0) {
    console.warn(`warning in [${warnings.map((e) => e.filename).join(", ")}]`)
    await fs.writeFile(warningFilePath, JSON.stringify(warnings,null, 2))
  } else {
    console.warn('no warnings')
    await fs.writeFile(warningFilePath, 'no warning')
  }
}

function getCache(data, changedAt) {
  return CACHE_DATA
}

module.exports = {
  upgradeCache,
  getCache,
}
