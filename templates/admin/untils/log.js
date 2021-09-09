const log4js = require('log4js')
const path = require('path')
const logUoutPath = process.env.NODE_ENV === 'development' ? path.resolve(__dirname, '../../log') : '/var/log/gstarcad/newweb' 

log4js.configure({
  appenders: { 
    info: {
      type: 'file',
      filename: path.resolve(logUoutPath, 'info/info'),
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] - [%p] - %m'
      }
    },

    error: { 
      type: 'file',
      filename: path.resolve(logUoutPath, 'error/error'),
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] - [%p] - %m'
      }
    },

    debug: {
      type: 'file',
      filename: path.resolve(logUoutPath, 'debug/debug'),
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] - [%p] - %m'
      }
    }
  },

  categories: { 
    info: {
      appenders: ['info'],
      level: 'info'
    },

    debug: {
      appenders: ['debug'],
      level: 'debug'
    },

    default: {
      appenders: ['error'],
      level: 'error'
    }

  },
})

const error = log4js.getLogger('error')
const debug = log4js.getLogger('debug')
const info = log4js.getLogger('info')

const fn = {}
fn.error = function(val) {
  let str
  try {
    str = JSON.stringify(val)
  } catch (error) {
    str = val
  }
  str = val

  error.error(str)
}

fn.debug = function(val) {
  let str
  try {
    str = JSON.stringify(val)
  } catch (error) {
    str = val
  }
  debug.debug(str)
}

fn.info = function(val) {
  let str
  try {
    str = JSON.stringify(val)
  } catch (error) {
    str = val
  }
  info.info(str)
}

fn.ajax = function(type,data) {
  let obj = {}
  if (data.message) {
    obj.message = data.message
  }
  obj.status = data.status || ''
  obj.config = data.config || {}
  if (data.data && data.data.code && data.data.code !== 0) {
    obj.data = data.data || {}
  }
  
  let str
  try {
    str = JSON.stringify(obj)
  } catch (error) {
    str = data
  }
  fn[type](str)
}

fn.nomal = info

module.exports = fn