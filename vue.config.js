const path = require('path')
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 哪些文件会自动引入，使用绝对路径
      patterns: [
        path.join(__dirname, './src/assets/styles/mixins.less'),
        path.join(__dirname, './src/assets/styles/variables.less')
      ]
    }
  },
  chainWebpack: config => {
    // 10kb下的图片打包成base64的格式
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10000 }))
    // 这个是给webpack-dev-server开启可IP和域名访问权限。
    config.devServer.disableHostCheck(true)
  },
  // 这个是设置外部扩展，模块为qc变量名为QC，导入qc将不做打包。
  // 通过script标签引入了QC，这个包，所以要排除这个包进行打包
  // 如果不排除，node_modules里面是没有QC这个包的，就会报错的
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  }
}
