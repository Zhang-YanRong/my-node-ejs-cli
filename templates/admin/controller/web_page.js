const { UPDATE_TIME } = require('../untils/index')
// {replaceCNZZ}
// {replaceI18n}
const { getHomeData } = require('./api')
      

let webPage = {}

/**主页显示 */
webPage.home = async (req, res, next) => {
  let pageData = {
    msg: ''
  }

  // 获取首页数据
  const data = await getHomeData()

  if (data.code === 0) {
    pageData = data.data
  }

  await res.render('home/page', {
    // {replaceI18nHome}
    time: UPDATE_TIME(),
    pageData,
    // {replaceUseCnzz}
  })
}


// error
webPage.errorPage = async (err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error =  {}
  res.status(err.status || 500)
  res.render('error/error', {
    // {replaceI18nError}
    time: UPDATE_TIME(),
    // {replaceUseCnzz}
  })
}

module.exports = webPage
