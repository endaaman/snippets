const pug = require('pug')
const compiler = require('vue-template-compiler')

module.exports = function(src) {
  const html = pug.compile(src , {})()
  const result = compiler.ssrCompile(html)
  return new Function(result.render)
}
