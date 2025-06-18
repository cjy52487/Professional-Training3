const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    host: '0.0.0.0',
    port: 8080, // 常用端口，避免使用 443
    https: false // 不使用 HTTPS
  }
})
