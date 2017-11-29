const util = require('util')
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
  'aliases',
  'category',
  'digest',
  'priority',
  'tags',
  'title',
  'visiblity',
]

class Article {
  static get Visiblity() {
    return Visiblity
  }

  static get META_DELIMITTER() {
    return META_DELIMITTER
  }

  constructor(obj) {
    util._extend(this, obj)
  }

  toMarkdown() {
    let hasMetaField = false
    const meta = {}
    for (const field of META_FIELDS) {
      if (this[field]) {
        meta[field] = this[field]
        hasMetaField = true
      }
    }
    if (!hasMetaField) {
      return this.content
    }

    const metaText = yaml.safeDump(meta, { 'sortKeys': true})
    return `${META_DELIMITTER}\n${metaText}${META_DELIMITTER}\n\n${this.content}`
  }

  async save() {
  }
}

module.exports = {
  Article
}
