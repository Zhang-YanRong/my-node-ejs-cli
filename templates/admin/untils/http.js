'use strict'
const axios = require('axios')
const loger = require('./log')
const qs = require('qs')
const API = require(`../../config/${process.env.TYPE}_${process.env.LANG}`)

function reqGetStreamData (params, cookie = ''){
  let { method = 'get', url = '', data = {} } = params
  return new Promise((resolve,reject)=>{
    // const body = params.request.body ? params.request.body : {}
    const getConfig = {
      method: 'get',
      url: `${API.SERVER_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      params: data
    }
    const postConfig = {
      method: 'post',
      url: `${API.SERVER_URL}${url}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(data),
    }
    console.log(postConfig)
    axios(method === 'get' ? getConfig : postConfig).then(data => {
      loger.ajax('info', data)
      resolve(data)
    }, err => {
      loger.ajax('error', err)
      reject(err)

    }).catch(err => {
      loger.ajax('error', err)
      reject(err)
    })
  })
}

module.exports = reqGetStreamData