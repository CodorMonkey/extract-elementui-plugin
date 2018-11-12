const extract = require('./src/extracter')

module.exports = class ExtractElementUIPlugin {
  /**
   * 构造器
   * @param options 参数：{
   *   src: 指定提取目录，必填
   *   dist: 指定生成文件位置，必填
   * }
   */
  constructor (options) {
    if (!options.src) throw new Error('src必须填写')
    if (!options.dist) throw new Error('dist必须填写')

    this.options = options
  }

  apply (compiler) {
    if (!isDevelopMode(compiler.options.mode)) {
      extract(this.options)
    }

    compiler.hooks.watchRun.tapAsync('ExtractElementUIPlugin', (compiler, callback) => {
      let mtime = compiler.watchFileSystem.watcher.mtimes[this.options.dist]
      if (!mtime) {
        extract(this.options)
      }
      callback()
    })
  }
}

function isDevelopMode (mode) {
  return mode === 'development'
}
