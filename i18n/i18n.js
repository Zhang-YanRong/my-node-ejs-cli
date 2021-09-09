const i18n = require('i18n')
const path = require('path')
const { DEFAULT_LANG } = require('./index')

const setI18n = () => {
  const i18nOptions = {
    locales: ['en', 'zh', 'kr'],
    directory: path.join(__dirname, '../../lang'),
    objectNotation: true,
    updateFiles: false,
    defaultLocale: 'zh',
    logDebugFn: function(msg) {
      console.log('debug', msg)
    },
    logWarnFn: function(msg) {
      console.log('warn', msg)
    },
    logErrorFn: function(msg) {
      console.log('error', msg)
    }
  }

  i18n.configure(i18nOptions)
  return i18n.init
}

const setLang = (req, res, next) => {
  const nowLang = req.cookies['lang'] || DEFAULT_LANG()
  i18n.setLocale(nowLang)
  next()
}

module.exports = {
  setI18n,
  setLang
}
