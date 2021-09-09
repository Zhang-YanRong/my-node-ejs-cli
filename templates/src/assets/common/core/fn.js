var url,tool,timeNumber

var REG = {
  mail: /^([a-zA-Z0-9]+[_]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
  phone: /^1\d{10}$/
}

$.ProjectCore.fn = {
  /**
     * 扩展 jQuery 实例方法
     */
  extendJQuery () {
    $.fn.extend({
      setToken (val){
        localStorage.setItem('ctoken', val)
      },

      getToken (){
        return localStorage.getItem('ctoken') || ''
      }
    })

    $.url = url
    $.REG = REG
    $.tool = tool
  },

  /**
   * 数据请求封装
   * @param {string} type 请求方式
   * @param {*} api 接口地址 可以是string 如：'/api/list'; 也可以是对象{name: all(不采用url拼接) || null(不传name), value: '接口地址'}
   * @param {*} data 请求参数
   * @param {*} processData 是否进行json处理
   * @param {object} header 自定义请求头
   * @returns {object} $.Deffered 实例
   */
  ajax (type, api, data = {}, config = { processData: true } ) {
    const { fn } = $.ProjectCore
    const _type = (type==null || type=='' || typeof(type)=='undefined') ? 'GET' : type
    let _data = (data==null || data=='' || typeof(data)=='undefined') ? { 'date': new Date().getTime() } : data
    let _api = (data==null || data=='' || typeof(data)=='undefined') ? '/' : api
    let baseUrl
    const apiType = typeof(_api)
    const URL_TYPE = Object.keys(url)
    
    if (apiType === 'string') {
      baseUrl = `${url.SERVER_URL}${_api}`
    } else if (apiType === 'object') {
      if (_api.type && _api.type === 'all'){
        baseUrl = _api.value
      } else if (_api.type && URL_TYPE.includes(_api.type)) {
        baseUrl = `${url[_api.type]}${api}`
      }
    }
    const dfd = $.Deferred()
    const OPTIONS = {
      url: baseUrl,
      type: _type,
      data: _data,
      datatype: 'json',
      processData: config.processData,
      // xhrFields: {
      // withCredentials: true
      // },
      crossDomain: true,
      success: function(data, status, xhr){
        dfd.resolve(data)
      },
      error: function(err){
        dfd.reject(err)
      },
      timeout: 30 * 60 * 1000
    }

    if (config.header) {
      OPTIONS.headers = config.header
    }

    $.ajax(OPTIONS)

    return dfd.promise()
  },

  /**
  * 简单信息提示
  * @param {string} message 提示信息
  * @param {object} options 弹出层配置
  */
  tip (message, type = 'info') {
    let time = 3000
    let str = ''
    
    if (timeNumber) {
      clearInterval(timeNumber)
    }

    if (type === 'success') {
      str = `
        <div class=" msg-box-success">
          <p class="msg-box-content">
            <span class="msg-icon iconfont icon-chenggong"></span><span>${message}</span>
          </p>
        </div>
      `
    } else if (type === 'error') {
      str = `
        <div class=" msg-box-error">
          <p class="msg-box-content">
            <span class="msg-icon iconfont icon-guanbi"></span><span>${message}</span>
          </p>
        </div>
      `
    } else {
      str = `
        <div class=" msg-box-info">
          <p class="msg-box-content">
            <span class="msg-icon iconfont icon-info"></span><span>${message}</span>
          </p>
        </div>
      `
    }
    if ($('.msg-box').length){
      $('.msg-box').html(str)
    } else {
      let parent= '<div class="msg-box"></div>'

      $('body').append(parent)
      $('.msg-box').html(str)
    }

    $('.msg-box').fadeIn('slow')
  
    timeNumber = setInterval(function() {
      if ($('.msg-box').length){
        $('.msg-box').fadeOut('slow')
      }

      clearInterval(timeNumber)
    }, time)
  },

  /**
  * 本地存储
  * @param {string} name key
  * @param {string} value value
  */
  localSet (name, value) {
    localStorage.setItem(name, value)
  },

  /**
     * 获取本地存储
     * @param {string} name key
     */
  localGet (name) {
    const value = localStorage.getItem(name)

    return value
  },

  /**
  * 本地存储
  * @param {string} name key
  * @param {string} value value
  */
  cookieSet (name, value) {
    $.cookie(name, value)
  },
  
  /**
  * 获取本地存储
  * @param {string} name key
  */
  cookieGet (name) {
    return $.cookie(name)
  },

  /**
   * 获取路由参数
   * @param {string} name 
   */
  getQueryParams (name) {
    var requestString = location.search
    var reg = new RegExp('(?:\\?|&)' + name + '=(.*?)(?:&|$)')
    if (reg.test(requestString)) {
      return decodeURIComponent(RegExp.$1)
    } else {
      return ''
    }
  },

  /**
   * clientType
   */
  getClientType (){
    let clientType = this.cookieGet('df_windows_type') || this.getQueryParams('clientType') 
    let clientVersion =  this.cookieGet('df_windows_version') || this.getQueryParams('clientVersion') || '1.0.0'
    let utoken = this.getQueryParams('utoken')
    const domain = document.domain.split('.').slice(-2).join('.')

    if (utoken) {
      this.cookieSet('gstarsso_ticket', `${utoken};expires=0;domain=${domain};path=/`)
    }
    
    if (clientType === 'DF_Windows') {
      clientVersion = this.cookieGet('df_windows_version') || this.getQueryParams('clientVersion') || '4.5.0'
      this.cookieSet('df_windows_type', `${clientType};expires=0;domain=${domain};path=/`)
      this.cookieSet('df_windows_version', `${clientVersion};expires=0;domain=${domain};path=/`)
      return {
        clientType,
        clientVersion
      }
    } else {
      this.cookieSet('df_windows_type', `;expires=0;domain=${domain};path=/`)
      this.cookieSet('df_windows_version', `;expires=0;domain=${domain};path=/`)
    }

    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      return {
        clientType: 'Web_H5',
        clientVersion
      }
    } else {
      return {
        clientType: 'Web_PC',
        clientVersion
      }
    }
  },

  /**
   * cookie过期操作 
   */
  isCookieOut (code = '980002', layer, loading) {
    if (code == '980002') {
      if (layer && loading) layer.close(loading)
      const domain = document.domain.split('.').slice(-2).join('.')
      const userLogin = $('.userLogin').val()
      
      this.cookieSet('gstarsso_ticket', `;expires=0;domain=${domain};path=/`)
      window.location.href = userLogin
    }
  },

  /**
   * 服务端验证token过期，前端清除token
   */
  deleteToken () {
    const isLogin = $('#isLogin').val()

    if (isLogin === 'false') {
      console.log(isLogin, '清除token')
      const domain = document.domain.split('.').slice(-2).join('.')
      this.cookieSet('gstarsso_ticket', `;expires=0;domain=${domain};path=/`)
    }
  }
}

/**
 * @description 对象参数用&拼接
 * @param {*} param 
 * @param {*} key 
 */
function parseParam (param, key){
  var paramStr=''
  const keysArr = Object.keys(param)

  keysArr.forEach(v =>{
    paramStr += `${v}=${param[v]}&`
  })
  
  return paramStr.substring(0,paramStr.length - 1)
}

// 离开页面清一下定时器
window.onbeforeunload=function(){     
  if (timeNumber) clearInterval(timeNumber)
} 