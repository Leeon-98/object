/**
   * @param {string/number} value 时间戳
   * @param {string} fmt 想要修改的时间格式 'yyyy-MM-dd' 'yyyy-MM-dd hh:mm'
  */
var tool = {}

tool.formatDate = function(value, fmt) {
  const num = Number(value)
  var date = new Date(num)
  if (/(y+)/.test(fmt)) {
    fmt = fmt
      .replace(RegExp.$1, date.getFullYear() + '')
      .substr(4 - RegExp.$1.length)
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

tool.pars = function(param, key, encode) {
  if (param == null) return ''
  var arr = []
  var t = typeof (param)
  if (t === 'string' || t === 'number' || t === 'boolean') {
    arr.push(key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param))
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
      arr.push(this.pars(param[i], k, encode))
    }
  }
  return arr.join('&')
}
tool.sortObject = function(obj) {
  const newObjArr = Object.keys(obj).sort()
  const newObj = {}
  for (let index = 0; index < newObjArr.length; index++) {
    var key = newObjArr[index]
    newObj[key] = obj[key]
  }
  return newObj
}
export default tool
