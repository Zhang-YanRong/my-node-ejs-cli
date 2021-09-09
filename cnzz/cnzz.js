const LANG = process.env.LANG || 'zh'
let cnzz = {}
/**
 * 整体的cnzz配置
 */
if (LANG === 'en') {
  cnzz.type = '132133'
  cnzz.id = '13132132132'
  cnzz.googleId = 'GTM-MDVS2Z4'
} else if (LANG === 'kr') {
  cnzz.type = '123'
  cnzz.id = '123456'
  cnzz.googleId = 'GTM-TTRNQ9B'
} else {
  cnzz.type = '123132'
  cnzz.id = '123132'
  cnzz.googleId = ''
}

module.exports = cnzz