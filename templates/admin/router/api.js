'use strict'
/**
 * 尝试的一个接口转发demo
 */
const Router = require('koa-router')
const http = require('../untils/http')
const BASE_URL = '/project-html'
const router = new Router({
  prefix: `${BASE_URL}/api`
})

router
  // .post('/api/file/getInfo', api.getSampleDrawingList)
  .post('/', async (ctx) => {
    try {
      const data = await http(ctx)
      ctx.body = data
    } catch (err) {
      ctx.body = err
    }
  })


module.exports = router