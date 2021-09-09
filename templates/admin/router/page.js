'use strict'
const express = require('express')
const router = express.Router()
const webPage = require('../controller/web_page')

router
  .get('/', webPage.home)
  
  
module.exports = router