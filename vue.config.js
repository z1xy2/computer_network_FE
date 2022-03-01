module.exports = {
    devServer: {
      proxy:{
          '/api':{
              target:'http://127.0.0.1:8000',
              pathRewrite:{'^/api':''},
              ws:true,//默认也为true支持websocket
              changeOrigin:true//默认也为true，控制请求头信息，伪造同源
          }
      }
    }
  }