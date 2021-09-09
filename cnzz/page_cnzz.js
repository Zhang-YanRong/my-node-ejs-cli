$(function() {
  let cnzzDiv = $('.cnzz')
  let id = $('.cnzzId').val()
  let type = $('.cnzzType').val()
  
  let cScript1 = document.createElement('script')
  cScript1.type = 'text/javascript'
  cScript1.language = 'JavaScript'
  cScript1.id = id
  cScript1.src =
  `https://${type}.cnzz.com/z_stat.php?id=${id}&web_id=${id}`
  cnzzDiv.append(cScript1)

  let cScript2 = document.createElement('script')
  cScript2.type = 'text/javascript'
  cScript2.charset = 'utf-8'
  cScript2.id = id
  cScript2.src =
  `https://c.cnzz.com/core.php?web_id=${id}`
  cnzzDiv.append(cScript2)
  
  let cScript3 = document.createElement('a')
  cScript3.target = '_blank'
  cScript3.title='站长统计'
  cScript3.href = `https://www.cnzz.com/stat/website.php?web_id=${id}`
  cScript3.innerText = '站长统计'
  cnzzDiv.append(cScript3)
})
