const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'content',
  publicPath: './',
  filenameHashing: false,
  configureWebpack: {
    optimization: {
      // minimize: false, // 不要压缩，便于定位问题
      splitChunks: {
        minChunks: 1,
      }
    }
  }
})
