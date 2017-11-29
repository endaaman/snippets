const path = require('path')
const fs = require('fs-extra')
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
      meta: null,
    }
  }

  let meta = null
  try {
    meta = yaml.safeLoad(metaText)
  } catch (e) {
    return {
      warning: e,
      meta: null,
    }
  }

  if (!meta instanceof Object) {
    return {
      warning: 'meta data is not object',
      meta: null,
    }
  }

  const result = Joi.validate(meta, Joi.object({
    aliases: Joi.array().items(Joi.string()),
    category: Joi.string(),
    digest: Joi.string(),
    priority: Joi.number().min(0).integer(),
    tags: Joi.array().items(Joi.string()),
    title: Joi.string(),
    visiblity: Joi.string().allow(Object.values(Article.Visiblity)),
    updated_at: Joi.date(),
    created_at: Joi.date(),
  }))

  if (result.error) {
    return {
      warning: result.error,
      meta: null,
    }
  }
  return {
    warning: null,
    meta: result.value,
  }
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

  const { meta, warning } = parseMetaText(metaText)

  const defaultData =  {
    aliases: [],
    category: null,
    digest: '',
    tags: [],
    title: name,
    visiblity: meta ? Article.Visiblity.PUBLIC : Article.Visiblity.PRIVATE,
    updated_at: stat.ctime,
    created_at: stat.birthtime,
  }
  const article = new Article({
    ...defaultData,
    ...(meta || {}),
    slug: name,
    content: contentText,
  })

  return { article, warning, filename }
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
