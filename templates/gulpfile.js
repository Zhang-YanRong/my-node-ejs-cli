const { series, src, dest, watch, parallel, lastRun } = require('gulp')
const glob = require('glob') 
const loadPlugins = require('gulp-load-plugins') // 减少gulp插件引入
const webfontsGenerator = require('@vusion/webfonts-generator') // svg处理工具
const fs = require('fs-extra')  // node 的fs工具封装
const path = require('path')
const $ = loadPlugins()
const minify = Boolean(process.env.minify)
const isProduction = () => process.env.NODE_ENV === 'production'
const TYPE = process.env.TYPE
const LANG = process.env.LANG
const BASE_URL = process.env.OSS_BASE
const htmlI18n = require('gulp-html-i18n')
const dayjs = require('dayjs')

const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
const JSdescription = `
/**
 * @description
 * 更新时间 { ${time} }
 */
`

const HTMLdescription = `<!-- <更新时间 { ${time} }  -->`

const {
  resolve,
  outputDir,
  run,
  clear,
  deleteOne
} = require('./scripts/utils')

function showError (error) {
  console.log(error.toString())
  this.emit('end')
}


/*
 * js处理
 * 转es5
 * 压缩
 * 输出
*/
function completeJs () {
  return src(['src/assets/js/**/*.js',])
    .pipe($.replace('BASE_URL', BASE_URL))
    .pipe($.replace('PROCESS_ENV', TYPE))
    .pipe($.replace('PROCESS_LANG', LANG))
    .pipe($.plumber())
    .pipe($.babel({ presets: ['@babel/preset-env'] }))
    .pipe($.if(isProduction, $.uglify()))
    .on('error', function(err) {
      $.util.log($.util.colors.red('[Error]'), err.toString())
    })
    .pipe($.header(JSdescription))
    .pipe(dest(outputDir(['dist/assets/js/'])))
}

/* views并复制到输出目录 */
async function copyViews () {
  return src('src/views/**/*.ejs')
    .pipe($.replace('BASE_URL', BASE_URL))
    .pipe($.replace('PROCESS_ENV', TYPE))
    .pipe($.replace('PROCESS_LANG', LANG))
    .pipe($.plumber())
    .pipe($.header(HTMLdescription))
    .pipe(dest(outputDir(['dist/views'])))
}

/* 拷贝static */
function copyStatic () {
  return src(['src/static/**/*'], { since: lastRun(copyStatic) })
    .pipe(dest(outputDir(['dist/static'])))
}

/* 编译less并拷贝 */
function copyCss () {
  return src(['src/assets/css/**/*', '!src/assets/css/*/style.less', '!src/assets/css/*/style*'])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())  // gulp-sourcemaps 源映射
    // .pipe($.sass().on('error', $.sass.logError))
    .pipe($.less({
      paths: [ path.join(__dirname) ]
    }))
    .on('error', showError)
    .pipe($.replace('BASE_URL', BASE_URL))
    .pipe($.sourcemaps.write())
    .pipe($.cleanCss({ compatibility: 'ie8' }))
    .pipe($.header(JSdescription))
    .pipe(dest(outputDir(['dist/assets/css'])))
}

/* 并拷贝图片 */
function copyImg () {
  return src(['src/assets/img/**/*.{png,jpg,jpeg,gif,ico}'], { since: lastRun(copyImg) })
    .pipe($.if(minify, $.tinypngCompress({
      key: '2vBr4KPP66nJh7dHmGjCT6mlY7956Qq9',
      sigFile: 'images/.tinypng-sigs',
      log: true
    })))
    .pipe(dest(outputDir(['dist/assets/img'])))
}

/** 压缩图片 */
function minifyImg () {
  return src(['src/assets/img/**/*.{png,jpg,jpeg,gif,ico}'])
    .pipe($.if(minify, $.tinypngCompress({
      key: '2vBr4KPP66nJh7dHmGjCT6mlY7956Qq9',
      sigFile: 'images/.tinypng-sigs',
      log: true
    })))
    .pipe(dest(outputDir(['src/assets/minifys'])))
}


/* 拷贝组件 */
function copyConponents () {
  return src('src/components/**/*.ejs')
    .pipe($.replace('BASE_URL', BASE_URL))
    .pipe($.replace('PROCESS_ENV', TYPE))
    .pipe($.replace('PROCESS_LANG', LANG))
    .pipe(dest(outputDir(['dist/components'])))
}

/**
 * 编译页面初始化js
 * 
 * 注：文件更改需重启项目
 */
function compilerInitJs () {
  return src([
    'src/assets/common/core/start.js',
    `config/${TYPE}_${LANG}.js`,
    'src/assets/common/core/tool.js',
    'src/assets/common/core/fn.js',
    'src/assets/common/core/init.js',
    'src/assets/common/core/!(start|end).js',
    'src/assets/common/core/end.js',
  ], { since: lastRun(compilerInitJs) })
    .pipe($.replace('module.exports = url', ''))
    .pipe($.replace('module.exports = tool', ''))
    .pipe($.babel({ presets: ['@babel/preset-env'] }))
    .pipe($.concat('init.js'))
    .pipe($.header(JSdescription))
    .pipe(dest('dist/assets/common/core'))
}

/**
 * @description watch所有文件
 */
function watchChange (){
  watch(['src/assets/js/**/*.js', ], completeJs)
  watch(['src/views/**/*.ejs', 'lang/**/*.json'], copyViews)
  watch(['src/static/**/*', 'src/static/**/*.js', 'src/static/**/*.css'], copyStatic)
  watch(['src/assets/css/**/*.less', 'them/*.less'], copyCss)
  watch(['src/assets/img/**/*'], copyImg)
  watch(['src/components/**/*.ejs', 'lang/**/*.json'], copyConponents)
}

/* 启动koa */
async function runServe () {
  await run('nodemon', ['server'])
}

async function prodServe () {
  await run('yarn', ['pm2'])
}

exports.dev = async () => {
  process.env.NODE_ENV = 'development'
  await series(
    clear,
    parallel(
      completeJs,
      compilerInitJs,
      copyViews,
      copyCss,
      copyImg,
      copyConponents,
      copyStatic,
    ),
    parallel(
      runServe,
      watchChange,
    )
  )()
}

/* 启动build */
exports.build = async () => {
  process.env.NODE_ENV = 'production'
  await series(
    clear,
    parallel(
      completeJs,
      compilerInitJs,
      copyViews,
      copyCss,
      copyImg,
      copyConponents,
      copyStatic,
    )
    // prodServe
  )()
}

/** 压缩图片 */
exports.minifyImg = async () => {
  await series(
    minifyImg
  )()
}
