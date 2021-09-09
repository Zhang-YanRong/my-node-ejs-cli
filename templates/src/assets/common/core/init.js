$.ProjectCore.init = () => {
  if (!$.ProjectCore.fn) return
  
  typeof $.ProjectCore.fn.extendJQuery === 'function' &&
      $.ProjectCore.fn.extendJQuery()
}