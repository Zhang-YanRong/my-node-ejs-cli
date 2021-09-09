module.exports= async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')//自定义中间件，设置跨域需要的响应头。
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE') //设置请求方法
  res.header('Access-Control-Allow-Headers', 'X-Access-Token, Content-Type') //设置请求头
  if (req.method == 'OPTIONS') {
    res.status('200').json({ state: 'ok' })
  } else {
    next()
  }
}