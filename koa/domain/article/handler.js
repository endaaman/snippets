const {
  upgradeCache,
  getCache,
} = require('./lib/cache')


async function getArticles() {
  await upgradeCache()
  return getCache()
}

async function getArticleBySlug(slug) {
  const articles = await getArticles()
  return articles.find((a) => a.slug === slug)
}

module.exports = {
  getArticles,
  getArticleBySlug,
}
