const path = require('path')
const dayjs = require('dayjs')
const DIFF_DATA =require(`../config/${process.env.LANG}`)
const tool = require('../../src/assets/common/core/tool')

module.exports = {
  PARAMS_OBJ: (id) => {
    if (id.length) {
      let str = id.split('.')[0]
      let arr = str.split('_')
      let obj = {}
      obj.code = arr[0]
      obj.version = arr[1]
      obj.lang = arr[2]
      return obj
    } else {
      return {}
    }
  },
  PAGE_PATH: (page) => {
    return path.resolve(__dirname, '../../dist/views', page)
  },

  DEFAULT_LANG: () => {
    return process.env.LANG || 'zh'
  },

  UPDATE_TIME: () => {
    return dayjs().format('YYYY-MM-DD HH:mm:ss')
  },

  FILTER_SIZE: tool.FILTER_SIZE,

  IS_ACCESS: (req, res) => {
    return DIFF_DATA.AUTHORITY.some(v => {
      const reg = new RegExp(v.path)
      return reg.test(req.path) && v.access
    })
  },

  GET_COKIE: (req) => {
    return req.query.utoken || (req.cookies['gstarsso_ticket'])
  },

  SORT_STR: (str) => {
    try {
      return decodeURI(str, 'UTF-8')
      // return decodeURIComponent(str)
    } catch (error) {
      return ''
    }

  }
}