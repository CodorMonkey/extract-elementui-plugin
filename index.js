const extract = require('./src/extracter')

module.exports = class ExtractElementUIPlugin {
  constructor (options) {
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
