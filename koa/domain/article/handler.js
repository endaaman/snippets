const {
  upgradeCache,
  getCache,
} = require('./lib/cache')


async function getArticles() {
  await upgradeCache()
  return getCache()
}

module.exports = { getArticles }
