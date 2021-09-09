'use strict'
const http = require('../../untils/http')
const lang = process.env.LANG || 'zh'

const api = {
  /**
   * @description 首页接口
   * 
   */
  async getHomeData () {
    try {
      // const res = await http({
      //   method: 'post',
      //   url: '/view/home',
      //   data: {
      //     requset: 'canshu'
      //   }
      // })
      // return  res.data

      const res = await mockApi()
      return res
    } catch (error) {
      return error
    }
  }

}

const mockApi = () => {
  return new Promise(resolve => {
    const data = {
      code: 0,
      data: {
        msg: 'hello node-ejs'
      }
    }
    resolve(data)
  })
}

module.exports = api