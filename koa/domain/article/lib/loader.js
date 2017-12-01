const path = require('path')
const fs = require('fs-extra')
const fecha = require('fecha')
const yaml = require('js-yaml')
const Joi = require('joi')
const config = require('../../../config')
const { Article } = require('../model')


const MARKDONW_FILE_REG = /^.+\.md$/

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

  return meta
}

async function loadArticleFile(filename) {
  const filepath = path.join(config.ARTICLES_DIR, filename)

  const stat = await fs.stat(filepath)
  const name = trimExtension(filename)

  const wholeText = await fs.readFile(filepath, 'utf-8')
  const {
    metaText,
    contentText,
  } = splitArticleText(wholeText)

  let { meta, warning } = parseMetaText(metaText)

  const article = new Article(name, contentText)
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

  return { article: warning ? testArticle : article, warning, filename }
}


async function loadArticleFiles() {
  const filenames = (await fs.readdir(config.ARTICLES_DIR))
    .filter(name =>  MARKDONW_FILE_REG.test(name) )

  const wg = []
  for (const filename of filenames) {
    wg.push(loadArticleFile(filename))
  }
  return await Promise.all(wg)
}

module.exports = {
  loadArticleFiles
}
