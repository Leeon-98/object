function resizeFontsize() {
  var width = document.documentElement.clientWidth
  document.documentElement.style.fontSize = width / 7.5 + 'px'
  // width/(效果图片宽度/文本字体大小(100))
}
resizeFontsize()
// 改变横屏竖屏执行效果更换
window.addEventListener('orientationchange', resizeFontsize)
// 改变手机大小执行效果更换
window.addEventListener('resize', resizeFontsize)
