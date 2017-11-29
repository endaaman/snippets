const path = require('path')
const fs = require('fs-extra')
const yaml = require('js-yaml')
const config = require('../../config')


const MARKDONW_FILE_REG = /^20\d\d-((10|11|12)|0[1-9])-((30|31)|([1-2][0-9])|(0[1-9]))_.+\.md$/
const MEMOS_DIR = 'memos'
const MARKDOWN_DIR = path.join(config.FILES_DIR, MEMOS_DIR)

let cached = null
let dirChangedAt = null


async function getNames() {
  const allNames = await fs.readdir(MARKDOWN_DIR)
  return allNames.filter(name => {
    return MARKDONW_FILE_REG.test(name)
  })
}

async function readMarkdownFile(name) {
  const p = path.join(MARKDOWN_DIR, name)
  const text = await fs.readFile(p, 'utf-8')
  const stat = await fs.stat(p)

  const lines = text.split('\n')
  let count = 0
  const metaLines = []
  const contentLines = []
  for (const line of lines) {
    if (line === '---') {
      count += 1
      continue
    }
    if (count === 1) {
      metaLines.push(line)
      continue
    }
    contentLines.push(line)
  }

  return {
    name,
    content: contentLines.join('\n'),
    ...yaml.load(metaLines.join('\n')),
    changed_at: stat.ctime,
  }
}

async function recache() {
  const names = await getNames()
  const wg = []
  for (const name of names) {
    wg.push(readMarkdownFile(name))
  }
  cached = await Promise.all(wg)
  dirChangedAt = (await fs.stat(MARKDOWN_DIR)).mtime
}

async function checkIfChanged() {
  if (!dirChangedAt) {
    return true
  }
  const curChangedAt = (await fs.stat(MARKDOWN_DIR)).mtime
  return dirChangedAt.getTime() !== curChangedAt.getTime()
}

async function getMemos() {
  const isNeedRecache = await checkIfChanged()
  if (isNeedRecache) {
    console.log('update cache')
    await recache()
  } else {
    console.log('using cache')
  }
  return cached
}

module.exports = getMemos