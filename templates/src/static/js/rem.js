function autofont (){
  let designWidth, rem2px
  if (window.screen.width < window.screen.height){
    designWidth = 750, rem2px = 100
  } else {
    designWidth = 1920, rem2px = 100
  }

  var windowWidth=(window.innerWidth>designWidth)?designWidth:window.innerWidth
  document.documentElement.style.fontSize =
        ((windowWidth / designWidth) * rem2px) + 'px'
}
autofont()                          

window.onresize=function(){   
  console.log(1) 
  autofont() 
}
