const pug = require('pug')
const compiler = require('vue-template-compiler')


module.exports = function(content) {
  if (this.cacheable) {
    this.cacheable()
  }
  const html = pug.compile(content , {})()
  const result = compiler.compile(html)
  // return 'module.exports = function(){' + result.render + '}'
  return '' + result
}

module.exports.seperable = true
