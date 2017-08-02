import template from './index.pug'

console.log('')
console.log('pug:')
console.log(template)
console.log('')

export default {
  render: template
  // template: '<p>home page</p>',
  // render(h) {
  //   return template.bind(this)(h)
  // }
}
