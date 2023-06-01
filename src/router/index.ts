import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { usePermissStore } from '../store/permiss'
import Home from '../views/home.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  }, 
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '系统首页',
          permiss: '1',
        },
        component: () => import (/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
      },{
        path: '/authority',
        name: 'authority',
        meta: {
          title: '权限管理',
          permiss: '0',
        },
        component: () => import (/* webpackChunkName: "dashboard" */ '../views/authority.vue'),
      }, {
        path: '/goodsTable',
        name: 'goodsTable',
        meta: {
          title: '商品表单',
          permiss: '2',
        },
        component: () => import (/* webpackChunkName: "table" */ '../views/goodsTable.vue'),
      },  {
        path: '/orderTable',
        name: 'orderTable',
        meta: {
          title: '订单表单',
          permiss: '2',
        },
        component: () => import (/* webpackChunkName: "table" */ '../views/orderTable.vue'),
      },{
        path: '/form',
        name: 'baseform',
        meta: {
          title: '表单',
          permiss: '5',
        },
        component: () => import (/* webpackChunkName: "form" */ '../views/form.vue'),
      }, {
        path: '/icon',
        name: 'icon',
        meta: {
          title: '自定义图标',
          permiss: '10', 
        },
        component: () => import (/* webpackChunkName: "icon" */ '../views/icon.vue'),
      }, {
        path: '/user',
        name: 'user',
        meta: {
          title: '个人中心',
        },
        component: () => import (/* webpackChunkName: "user" */ '../views/user.vue'),
      },
    ],
  }, {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: () => import (/* webpackChunkName: "login" */ '../views/login.vue'),
  }, {
    path: '/403',
    name: '403',
    meta: {
      title: '没有权限',
    },
    component: () => import (/* webpackChunkName: "403" */ '../views/403.vue'),
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '没有权限',
    },
    component: () => import (/* webpackChunkName: "403" */ '../views/404.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | tea7-manage`
  const role = localStorage.getItem('ms_username')
  const permiss = usePermissStore()
  if (!role && to.path !== '/login') {
    next('/login')
  }
  else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
    // 如果没有权限，则进入403
    next('/403')
  }
  else {
    next()
  }
})

export default router
