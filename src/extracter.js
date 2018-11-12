const { resolve } = require('path')
const klawSync = require('klaw-sync')
const fs = require('fs')
const ejs = require('ejs')

module.exports = function (options = { src: './src', dist: './init-ui.js' }) {
  let { src, dist } = options

  let files = klawSync(src, {
    nodir: true,
    filter: ({ path, stats }) => {
      return stats.isDirectory() || path.endsWith('.vue')
    }
  }).map(item => item.path)
  // 读取文件内容
  let tags = extractTags(files)

  let uses = [...tags].sort()
  // 添加Loading、MessageBox、Notification、Message，及其指令
  let imports = uses.concat('Loading', 'MessageBox', 'Notification', 'Message').sort()

  renderFile(dist, imports, uses)
}

function renderFile (dist, imports, uses) {
  let template = resolve(__dirname, 'template.ejs')
  ejs.renderFile(template, { imports, uses }, (err, content) => {
    if (!err) {
      fs.writeFileSync(dist, content)
      console.log(`${dist} 生成完成...`)
    } else {
      console.log(err)
    }
  })
}

function extractTags (files) {
  let res = new Set()

  files.forEach(filePath => {
    let text = fs.readFileSync(filePath)
    text = text.toString()
    let elements = extractElements(text)
    elements.forEach((tag) => {
      if (!res.has(tag)) {
        res.add(tag)
      }
    })
  })
  return res
}

const extractElements = (() => {
  const regEl = /<(el(?:-[^\s>_]+)+)/g

  return (text) => {
    let el, res = new Set()
    while (el = regEl.exec(text)) {
      let tag = el[1]
      res.add(transformElement(tag))
    }
    return res
  }
})()

function transformElement (tag) {
  return tag.split('-')
    .slice(1)
    .map(item => `${item.slice(0, 1).toUpperCase()}${item.slice(1).toLowerCase()}`)
    .join('')
}
