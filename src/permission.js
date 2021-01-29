import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
const _import = require('./router/_import_' + process.env.NODE_ENV) // 获取组件的方法
import Layout from '@/layout' // Layout 是架构组件，不在后台返回，在文件里单独引入
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({
  showSpinner: false
}) // NProgress Configuration
const whiteList = ['/login'] // no redirect whitelist
// import request from '@/utils/request'
var getRouter // 用来获取后台拿到的路由
// 假装fakeRouter是通过后台接口请求回来的数据
const fakeRouter = {
  'router': [
    // {
    //   'path': '/testRouter',
    //   'component': 'Layout',
    //   'name': 'Test',
    //   'meta': {
    //     'title': '测试',
    //     'icon': 'dashboard'
    //   },
    //   'children': [
    //     {
    //       'path': 'index',
    //       'component': 'board/index',
    //       'name': 'Menu1',
    //       'meta': { 'title': 'Menu1' },
    //       'children': [
    //         {
    //           'path': 'item',
    //           'component': 'tools/index',
    //           'name': 'Menu1-1',
    //           'meta': { 'title': 'Menu1-1' }
    //         }
    //       ]
    //     }
    //   ],
    //   'hidden': true
    // },
    {
      'path': '*',
      'redirect': '/404',
      'hidden': true
    }
  ]
}
router.beforeEach(async(to, from, next) => {
  // console.log(from, to)
  // if (to.query.f === '4') {
  //   sessionStorage.setItem('f', to.query.f)
  //   if (location.href.indexOf('#reloaded') === -1) {
  //     location.href = location.href + '#reloaded'
  //     location.reload()
  //   }
  // }
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      console.log(to.path, '要去的路径')
      // if is logged in, redirect to the home page
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.token
      if (hasGetUserInfo) {
        if (!getRouter) { // 不加这个判断，路由会陷入死循环
          // request({ //  从后台请求路由表
          //   url: 'admin/permissions/getFrontPer',
          //   type: 'get'
          // }).then(res => {
          //   // console.log(res.result.data.router)
          //   getRouter = res.result.data.router
          //   routerGo(to, next) // 执行路由跳转方法
          // }).catch(err => {
          //   console.log(err)
          // })
          getRouter = fakeRouter.router // 假数据
          routerGo(to, next) // 执行路由跳转方法
        } else {
          try {
            next()
          } catch (error) {
            // 重新登录
            await store.dispatch('user/resetToken')
            Message.error(error || '登录验证失效')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})
function routerGo(to, next) {
  getRouter = filterAsyncRouter(getRouter) // 过滤路由
  router.addRoutes(getRouter) // 动态添加路由
  global.antRouter = getRouter // 将路由数据传递给全局变量，做侧边栏菜单渲染工作
  next({ ...to, replace: true })
}

function filterAsyncRouter(asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') { // Layout组件特殊处理
        route.component = Layout
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
