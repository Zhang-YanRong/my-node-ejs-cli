'use strict'
const path = require('path')
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const createError = require('create-error')
const cors = require('./admin/untils/cors')
// {replaceI18n}
const log4js = require('log4js')

const page = require('./admin/router/page')
const logger = require('./admin/untils/log')
const { errorPage } = require('./admin/controller/web_page') 
const http = require('./admin/untils/http')
const api = require('./admin/untils/middleware_api')
const portfinder = require('portfinder')

const {
  resolve
} = require('path')
const { rejects } = require('assert')

const app = new express()

/* 设置gzip */
app.use(compression())

/* 记录所用方式与时间 */
// app.use(convert(logger()))

// 解析 application/json
app.use(bodyParser.json()) 

// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())
app.use(cookieParser())

/* 设置跨域 */
app.use(cors)

// {replaceSetI18n}

/* 设置渲染引擎 */
app.set('views', path.join(__dirname, 'dist/views'))
app.set('view engine', 'ejs')
app.set('view cache', process.env.TYPE === 'build')

/* 静态文件夹 */
app.use(express.static(__dirname + '/dist/')) 

app.use(log4js.connectLogger(logger.nomal, { level: 'auto' }))

app.use(['/'], page)

/* 默认接口 */
app.use(function(req, res, next) {
  console.log(req.url)
  next(createError(404))
})

/* 404 */
app.use(function(err, req, res, next){
  errorPage(err, req, res, next)
})

let port = process.env.PORT
if (port) {
  app.listen(port)
  console.log('run', `http://local.51ake.com:${port}`)
 
} else {
  port = new Promise((resolve, rejects) => {
    portfinder.getPort({ port: 80, stopPort: 9999 }, function(err, port) {
      if (port){
        console.log('run', `http://local.51ake.com:${port}`)
        resolve(port)
      } else {
        rejects(9527)
      }
    })
  })
  
  port.then(res => {
    app.listen(res)
  }, err => {
    console.log(err, 'err')
  })
}