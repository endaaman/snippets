const path = require('path')
const fs = require('fs-extra')
const yaml = require('js-yaml')
const config = require('../config')


const MARKDONW_FILE_REG = /^20\d\d-((10|11|12)|0[1-9])-((30|31)|([1-2][0-9])|(0[1-9]))_.+\.md$/
const MEMOS_DIR = 'memos'

let isUpdateNeeded = true
let cached = null

function parseMarkdown(text) {
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
    content: contentLines.join('\n'),
    meta: yaml.load(metaLines.join('\n')),
  }
}

async function updateCache() {
  const mdDir = path.join(config.FILES_DIR, MEMOS_DIR)

  const allNames = await fs.readdir(mdDir)
  const names = allNames.filter(name => MARKDONW_FILE_REG.test(name))

  const wg = []
  for (const name of names) {
    wg.push(
      fs.readFile(path.join(mdDir, name), 'utf-8')
      .then((text) => parseMarkdown(text) )
    )
  }
  cached = await Promise.all(wg)
  isUpdateNeeded = false
}

function needMemosCacheUpdate() {
  isUpdateNeeded = true
}

async function getMemos() {
  if (isUpdateNeeded) {
    await updateCache()
  } else {
    console.log('using cache')
  }

  return cached
}

module.exports = { getMemos, needMemosCacheUpdate }
