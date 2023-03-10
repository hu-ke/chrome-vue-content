const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'content',
  publicPath: './',
  filenameHashing: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        minChunks: 1,
      }
    }
  }
})
