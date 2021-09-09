const http = require('./http')

/**
 * @description 以正则的方式过滤/api开头的请求路由
 * 
 * @returns 中间件需要返回一个方法
 */
module.exports=function(){
  return async function(ctx,next){
    const url = ctx.request.url
    const reg = /^\/api/
    if (reg.test(url)) {
      try {
        const data = await http(ctx)
        ctx.body = data
      } catch (err) {
        ctx.body = err
      }
    }
    await next()
  }
}