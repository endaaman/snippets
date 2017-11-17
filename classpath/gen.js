const path = require('path')
const fs = require('fs')
const glob = require('glob')
const { promisify } = require('util')

async function main() {
  const base_classpath = [
    process.env.HOME + '/Android/Sdk/platforms/android-22/android.jar',
    process.cwd() + '/libs/threetenbp-1.0.jar',
    // process.cwd() + '/src',
  ]
  let prev_name
  const classpath = (await promisify(glob)(process.env.HOME + '/.gradle/caches/modules-2/files-2.1/**/*.jar'))
    .reduce((r, cur_path) => {
      const splitted = path.basename(cur_path).split('-')
      const cur_name = splitted[0] + (splitted[splitted.length - 1] === 'sources.jar' ? '-s' : '')
      // console.log(cur_name)
      if (prev_name === cur_name) {
        r[r.length - 1] = cur_path
      } else {
        prev_name = cur_name
        r.push(cur_path)
      }
      return r
    }, [])
    .concat(base_classpath)
    .join(':')
  // await promisify(fs.writeFile)('.syntastic_javac_config', `let g:syntastic_java_javac_classpath = '${classpath}'`)
  // await promisify(fs.writeFile)('.vim/classpath.vim', `let $CLASSPATH = '${classpath}'`)
  await promisify(fs.writeFile)('.envrc', `export CLASSPATH='${classpath}'`)
  console.log('done')
}
main()
