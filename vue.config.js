const port = process.env.port || process.env.npm_config_port || 9528 // dev port
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  // assetsDir: 'wap',
  // indexPath: 'wap.html',
  lintOnSave: process.env.NODE_ENV === 'development',
  // webpack-dev-server 相关配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  devServer: {
    host: 'bbswap.zhulong.com',
    port: port,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: `http://testnbbs.zhulong.com`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  }
}
