const { src, dest } = require('gulp')

const path = require('path')
const execa = require('execa')
const fs = require('fs-extra')
const dayjs = require('dayjs')

const resolve = ( args ) => path.resolve(__dirname, '..', ...args)

const outputDir = (url) => resolve(url)

const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })

const clear = async function clear (cb) {
  await fs.removeSync(outputDir(['dist']))
  cb()
}

const deleteOne = function(arr, val) { 
  var index = arr.indexOf(val) 
  if (index > -1) { 
    arr.splice(index, 1) 
  } 
  return arr
}

const nowDay = dayjs().format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A')


exports.resolve = resolve
exports.run = run
exports.clear = clear
exports.outputDir = outputDir
exports.deleteOne = deleteOne
exports.nowDay = nowDay

