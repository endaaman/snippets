const Router = require('koa-router')
const Joi = require('joi')
const config = require('../config')
const { Article, getArticles, getArticleBySlug } = require('../domain/article')


function getValidator() {
  return {
    aliases    : Joi.array().items(Joi.string()),
    category   : Joi.string(),
    digest     : Joi.string(),
    priority   : Joi.number().min(0).integer(),
    tags       : Joi.array().items(Joi.string()),
    title      : Joi.string(),
    visiblity  : Joi.any().allow(Object.values(Article.Visiblity), null),
    date       : Joi.string().regex(config.DATE_REGEXP),
    created_at : Joi.date().allow(null),
    updated_at : Joi.date().allow(null),
  }
}

const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = await getArticles()
})

router.post('/', async (ctx, next) => {
  const req = ctx.request.body

  const article = new Article(req.slug, req.content)
  const articles = await getArticles()

  article.extend(req)
  article.validate(articles)

  if (article.getError()) {
    ctx.body = article.getError()
    ctx.status = 400
    return
  }

  try {
    await article.create()
  } catch (e) {
    ctx.throw(400, e)
    return
  }
  ctx.body = await getArticleBySlug(article.slug)
  ctx.status = 201
})

router.patch('/:slug', async (ctx, next) => {
  const req = ctx.request.body
  const slug = ctx.params.slug

  const article = await getArticleBySlug(slug)

  if (!article) {
    ctx.throw(404)
    return
  }

  article.extend(req)

  const articles = await getArticles()


  if (!article.validate()) {
    ctx.body = article.getError()
    ctx.status = 400
    return
  }


  try {
    await article.update(slug)
  } catch (e) {
    ctx.throw(400, e)
    return
  }

  ctx.body = await getArticleBySlug(article.slug)
  ctx.status = 201
})

module.exports = router
