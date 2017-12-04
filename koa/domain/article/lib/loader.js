const path = require('path')
const fs = require('fs-extra')
const fecha = require('fecha')
const yaml = require('js-yaml')
const Joi = require('joi')
const config = require('../../../config')
const { Article } = require('../model')


const MARKDONW_FILE_REG = /^.+\.md$/

const J = path.join.bind(path)

function trimExtension(s) {
  const i = s.lastIndexOf('.')
  return i < 0 ? s : s.substr(0, i)
}


function splitArticleText(wholeText) {
  const lines = wholeText.split('\n')
  let count = 0
  const metaLines = []
  const contentLines = []
  for (const line of lines) {
    if (line === Article.META_DELIMITTER) {
      count += 1
      continue
    }
    if (count === 1) {
      metaLines.push(line)
      continue
    }
    contentLines.push(line)
  }
  const metaText = metaLines.join('\n')
  const contentText = contentLines.join('\n')
  return {
    metaText,
    contentText,
  }
}


function parseMetaText(metaText) {
  if (!metaText) {
    return {
      warning: null,
      meta: {},
    }
  }

  let meta = null
  try {
    meta = yaml.safeLoad(metaText)
  } catch (e) {
    return {
      warning: e,
      meta: {},
    }
  }

  if (!meta instanceof Object) {
    return {
      warning: 'meta data is not object',
      meta: {},
    }
  }

  return {
    warning: null,
    meta,
  }
}

async function loadArticleFile(relative) {
  const filepath = J(config.ARTICLES_DIR, relative)

  const stat = await fs.stat(filepath)

  const splitted = relative.split('/')

  const slug = trimExtension(relative)
  const wholeText = await fs.readFile(filepath, 'utf-8')
  const {
    metaText,
    contentText,
  } = splitArticleText(wholeText)

  let { meta, warning } = parseMetaText(metaText)

  const article = new Article(slug, contentText)
  article.extend({
    date: fecha.format(stat.mtime, 'YYYY-MM-DD'),
    created_at: stat.birthtime,
    updated_at: stat.mtime,
  })

  const testArticle = article.copy().extend(meta)
  if (!warning) {
    testArticle.validate()
    warning = testArticle.getError()
  }

  return { article: (warning ? article : testArticle), warning, relative }
}

async function loadArticleFiles() {
  const BASE = config.ARTICLES_DIR
  if (!fs.existsSync(BASE)) {
    await fs.mkdir(BASE)
    return []
  }

  const baseFilenames = await fs.readdir(BASE)

  const categortSlugs = (await Promise.all(baseFilenames.map(slug => {
    return fs.stat(path.join(BASE, slug)).then((stat) => ({stat, slug}))
  })))
    .filter((v) => v.stat.isDirectory())
    .map((v) => v.slug)

  const wg = []
  baseFilenames
    .filter(name => MARKDONW_FILE_REG.test(name))
    .forEach((v) => {
      wg.push(loadArticleFile(v, null))
    })

  for (const categorySlug of categortSlugs) {
    (await fs.readdir(J(BASE, categorySlug)))
      .filter(name => MARKDONW_FILE_REG.test(name))
      .forEach((name) => {
        wg.push(loadArticleFile(J(categorySlug, name)))
      })
  }
  return await Promise.all(wg)
}

module.exports = {
  loadArticleFiles
}
