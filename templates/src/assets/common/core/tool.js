let tool = {}

tool.FILTER_SIZE = function(size) {
  if (size > 1024 * 1024 * 1024) {
    return Math.floor((size * 100) / (1024 * 1024 * 1024)) / 100 + 'G'
  } else if (size > 1024 * 1024) {
    return Math.floor((size * 100) / (1024 * 1024)) / 100 + 'M'
  } else if (size > 1024) {
    return Math.floor((size * 100) / 1024) / 100 + 'K'
  } else {
    return Math.floor(size * 100) / 100 + 'B'
  }
}

module.exports = tool