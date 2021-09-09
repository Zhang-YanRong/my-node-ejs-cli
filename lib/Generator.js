// lib/Generator.js
const ora = require('ora');
const inquirer = require('inquirer')
const fs = require('fs')
const FS = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const I18N = 'i18n'
const CNZZ = 'cnzz'
const LAYUI = 'layui'
const DEFAULT_CONFIG = 'default-config'
const config = require('../cli-config.json');
const basePath = path.resolve(__dirname, '../')

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message);
  // // 开始加载动画
  spinner.start();
 

  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态为修改为成功
    spinner.succeed(message);
    return result; 
  } catch (error) {
    // 状态为修改为失败
    spinner.fail('Request failed, ' + message)
  } 
}

class Generator {
  constructor (name, targetDir){
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
    this.config = config
  }

  // 核心创建逻辑
  async create(){
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'checkbox',
      choices: [I18N, CNZZ, LAYUI],
      message: 'Please select the components you want'
    })

    // 当前命令行选择的目录
    const cwd  = process.cwd();

    const targetAir  = path.join(cwd, this.name)

    // 目录是否已经存在？
    if (FS.existsSync(targetAir)) {
      await fs.remove(targetAir)
    }

    if(repo.length) {
      console.log('choose：' + chalk.cyan(repo))
    }

    this.copyBaseFile(targetAir, repo, this)
  }

  // 拷贝基础文件&合并配置
  copyBaseFile(targetAir, repo, _this) {
    const spinner = ora('Start upload file');
    spinner.start();
    spinner.color = 'yellow';
    spinner.text = 'Loading...';

    FS.copy(path.resolve(__dirname, '../templates'), targetAir).then(async () => {
      spinner.succeed(chalk.blue('Copy base file'));

      await wrapLoading(_this.mergeConfig, chalk.blue('Merge i18n config'), repo, I18N, targetAir, _this)

      await wrapLoading(_this.mergeConfig, chalk.blue('Merge cnzz config'), repo, CNZZ, targetAir, _this)

      await wrapLoading(_this.mergeConfig, chalk.blue('Merge layui config'), repo, LAYUI, targetAir, _this)
      
      await wrapLoading(_this.defaulJSONToFile, chalk.blue('Merge default config'), targetAir, _this)
    }).catch(err => {
      spinner.fail('Failed to upload base file')
    })
  }

  // 合并配置
  mergeConfig(repo, type, targetAir, _this) {
    if(repo.includes(type)){
      let config = _this.config[type]

      config.forEach(v => {
        const outpath = path.join(targetAir, v.path)
        const filePath = path.resolve(basePath, v.filePath)

        if(FS.existsSync(outpath)) {
          _this.mergeJSONToFile(filePath, outpath)   
        } else {
          _this.addConfigFile(filePath, outpath)
        }
      })
    }
  }

  // 添加配置的相关文件
  addConfigFile(filePath, outpath) {
    const status = fs.statSync(filePath).isDirectory()
    if(status) {
      FS.ensureDirSync(outpath)
      FS.copySync(filePath, outpath)
    } else {
      FS.ensureFileSync(outpath)
      const read = fs.createReadStream(filePath, {encoding: "utf-8"})
      const out = fs.createWriteStream(outpath, {encoding: "utf-8"})
      read.on('data',data =>{
        out.write(data, function () {
          // console.log(chalk.blue('write ' + outpath))
        })
      })

      read.on('end', () => {
        out.end("", function(params) {
          // console.log(I18N + chalk.green(' finshed'));
        })
      })
    }
  }

  // 合并参数配置到文件
  mergeJSONToFile(filePath, outpath, str) {
    const jsonData = require(filePath)
    const jsonDataKeys = Object.keys(jsonData)

    let read = fs.readFileSync(outpath, "utf-8")
    let resStr = read
    
    jsonDataKeys.forEach(v => {
      let jsReg = new RegExp('// {' + v + '}', 'g')
      resStr = resStr.replace(jsReg, jsonData[v])

      let ejsReg = new RegExp('<!-- {' + v + '} -->', 'g')
      resStr = resStr.replace(ejsReg, jsonData[v])
    })

    fs.writeFileSync(outpath, resStr, "utf-8")      
  }

  // 替换默认变量
  defaulJSONToFile(targetAir, _this) {
    let config = _this.config[DEFAULT_CONFIG]

    config.forEach(v => {
      const outpath = path.join(targetAir, v.path)
      const filePath = path.resolve(basePath, v.filePath)
      
      if(fs.existsSync(outpath)) {
        _this.mergeJSONToFile(filePath, outpath)
      }
    })
  }
}

module.exports = Generator;