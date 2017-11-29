const Router = require('koa-router')
const Joi = require('joi')
const config = require('../config')
const { Article, getArticles } = require('../domain/article')


const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = await getArticles()
})

router.post('/', async (ctx, next) => {
  const req = ctx.request.body

  const result = Joi.validate(req, {
    slug       : Joi.string().required(),
    content    : Joi.string().required(),
    aliases    : Joi.array().items(Joi.string()),
    category   : Joi.string(),
    digest     : Joi.string(),
    priority   : Joi.number().min(0).integer(),
    tags       : Joi.array().items(Joi.string()),
    title      : Joi.string(),
    visiblity  : Joi.any().allow(Object.values(Article.Visiblity), null),
    updated_at : Joi.date(),
    created_at : Joi.date(),
  })

  if (result.error) {
    ctx.body = result.error
    ctx.status = 400
    return
  }

  const article = new Article(req)
  await article.save()
  // ctx.body = article
  ctx.body = article.toMarkdown()
  ctx.status = 201
})

module.exports = router
