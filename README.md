### description
```
自动提取element-ui按需加载文件，告别手动维护按需加载
```

### install
```
yarn add -D extract-elementui-plugin
```

### how to use?

> webpack配置

```
const ExtractElementUIPlugin = require('extract-elementui-plugin')

plugins: [
  new ExtractElementUIPlugin({
    src: path.resolve(__dirname, 'src'),				// 指定提取目录，一般Vue.js项目指定src目录就行
    dist: path.resolve(__dirname, './src/init-ui.js')	// 指定生成文件位置，一般同入口文件main.js平级就行
  })
]
```

> main.js配置

```
import Vue from 'vue'
import './init-ui'		// 依赖生成的文件
// ...其他依赖

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```
