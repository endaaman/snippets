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
  const base_sources = [
    process.env.HOME + '/Android/Sdk/platforms/android-22/android.jar',
    process.cwd() + '/libs/threetenbp-1.0.jar',
    // process.cwd() + '/src',
  ]
  console.log(base_classpath)
  const prev_name = {
    classpath: '',
    sources: '',
  }
  const option = (await promisify(glob)(process.env.HOME + '/.gradle/caches/modules-2/files-2.1/**/*.jar'))
    .reduce((r, cur_path) => {
      const cur_name = path.basename(cur_path).split('-')[0]
      const mode = cur_path.includes('-sources.jar')
        ? 'classpath'
        : 'sources'
      const target = r[mode]
      if (prev_name === cur_name) {
        r[r.length - 1] = cur_path
      } else {
        prev_name[mode] = cur_name
        r.push(cur_path)
      }
      return r
    }, {
      classpath: [],
      sources: [],
    })
  const classpath_str = option.classpaths.concat(base_classpath).join(':')
  const sources_str = option.classpaths.concat(base_sources).join(':')
  // await promisify(fs.writeFile)('.syntastic_javac_config', `let g:syntastic_java_javac_classpath = '${classpath}'`)
  // await promisify(fs.writeFile)('.vim/classpath.vim', `let $CLASSPATH = '${classpath}'`)
  await promisify(fs.writeFile)('.envrc', `export CLASSPATH=${classpath}`)
  console.log('done')
}
main()
