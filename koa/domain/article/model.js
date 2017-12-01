const path = require('path')
const fs = require('fs-extra')
const util = require('util')
const fecha = require('fecha')
const Joi = require('joi')
const yaml = require('js-yaml')

const config = require('../../config')

const Visiblity = {
  PUBLIC: 'public',
  HIDDEN: 'hidden',
  SECRET: 'secret',
  PRIVATE: 'private',
}

const META_DELIMITTER = '---'

const META_FIELDS = [
  {
    key: 'aliases',
    fill: (v) => v && v.length,
  }, {
    key: 'category',
    fill: (v) => v,
  }, {
    key: 'digest',
    fill: (v) => v,
  }, {
    key: 'priority',
    fill: (v) => !!v,
  }, {
    key: 'tags',
    fill: (v) => v && v.length,
  }, {
    key: 'title',
    fill: (v) => v,
  }, {
    key: 'visiblity',
    fill: (v) => !!v && v !== Visiblity.PUBLIC,
  }, {
    key: 'date',
    fill: (v, o) => {
      if (!v) return false
      const compared = o.updated_at || new Date()
      return fecha.format(compared, 'YYYY-MM-DD') !== v
    }
  },
]

const FIELD_ERROR = Symbol()

function getFilepath(slug) {
  return path.join(config.ARTICLES_DIR, slug + '.md')
}

class Article {
  static get Visiblity() {
    return Visiblity
  }

  static get META_DELIMITTER() {
    return META_DELIMITTER
  }

  constructor(name, content) {
    this.slug = name
    this.content = content

    this.aliases = []
    this.category = null
    this.digest = ''
    this.tags = []
    this.title = name
    this.visiblity = Article.Visiblity.PUBLIC

    const d = new Date()
    this.created_at = d
    this.updated_at = d
    this.date = fecha.format(d, 'YYYY-MM-DD')
  }

  extend(obj) {
    util._extend(this, obj)
    return this
  }

  copy(obj) {
    const a = new Article()
    a.extend(this)
    return a
  }

  validate() {
    const result = Joi.validate(this, Joi.object({
      slug: Joi.string(),
      content: Joi.string(),
      aliases: Joi.array().items(Joi.string()),
      category: Joi.string().allow(null),
      digest: Joi.string().allow(''),
      priority: Joi.number().min(0).integer(),
      tags: Joi.array().items(Joi.string()),
      title: Joi.string(),
      visiblity: Joi.string().allow(Object.values(Article.Visiblity)),
      date : Joi.date(),
      created_at : Joi.date(),
      updated_at : Joi.date(),
    }))


    if (result.error) {
      this[FIELD_ERROR] = result.error
      return false
    } else {
      this[FIELD_ERROR] = null
      return true
    }
  }

  getError() {
    return this[FIELD_ERROR]
  }

  toMarkdown() {
    let hasMetaField = false
    const meta = {}
    for (const field of META_FIELDS) {
      if (field.fill(this[field.key], this)) {
        meta[field.key] = this[field.key]
        hasMetaField = true
      }
    }
    if (!hasMetaField) {
      return this.content
    }

    const metaText = yaml.safeDump(meta, { 'sortKeys': true })
    return `${META_DELIMITTER}\n${metaText}${META_DELIMITTER}\n${this.content}`
  }

  async create() {
    const filepath = getFilepath(this.slug)
    if (fs.existsSync(filepath)) {
      throw new Error(`slug: \`${this.slug}\` is duplicated`)
      return
    }
    await fs.writeFile(filepath, this.toMarkdown())
  }

  async update(oldSlug) {
    if (!oldSlug) {
      throw new Error('`oldSlug` param is needed for Article.update(oldSlug)')
      return
    }

    const filepath = getFilepath(this.slug)
    if (this.slug !== oldSlug) {
      if (fs.existsSync(filepath)) {
        throw new Error(`slug: \`${this.slug}\` is duplicated`)
        return
      }
    }

    await fs.writeFile(filepath, this.toMarkdown())

    if (this.slug != oldSlug) {
      await fs.unlink(getFilepath(oldSlug))
    }
  }
}

module.exports = {
  Article
}
