<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      background-color="#fff"
      text-color="#000"
      active-text-color="#b0352f"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu :key="item.index" v-permiss="item.permiss" :index="item.index">
            <template #title>
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-menu-item  v-permiss="item.permiss" :index="subItem.index">
                <template #title>
                  {{ subItem.title }}
                </template>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :key="item.index" v-permiss="item.permiss" :index="item.index">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <template #title>
              {{ item.title }}
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>



<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarStore } from '../store/sidebar'

const items = [
  {
    icon: 'HomeFilled',
    index: '/dashboard',
    title: '系统首页',
    permiss: '1',
  },
  {
    icon: 'Calendar',
    index: '',
    title: '基础表单',
    permiss: '2',
    subs:[
    {
        index: '/goodsTable',
        title: '商品表单',
        permiss: '2',
      },{
        index: '/orderTable',
        title: '订单表单',
        permiss: '2',
      },
    ]
  },
  {
    icon: 'Avatar',
    index: '/authority',
    title: '权限管理',
    permiss: '0',
  },
  {
    icon: 'Edit',
    index: '3',
    title: '表单相关',
    permiss: '4',
    subs: [
      {
        index: '/form',
        title: '基本表单',
        permiss: '5',
      },
    ],
  },
  {
    icon: 'Setting',
    index: '/icon',
    title: '图标',
    permiss: '10',
  },
]

const route = useRoute()
const onRoutes = computed(() => {
  return route.path
})

const sidebar = useSidebarStore()
</script>


<style scoped>
.sidebar {
	display: block;
	position: absolute;
	left: 0;
	top: 70px;
	bottom: 0;
	overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
	width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
	width: 250px;
}
.sidebar > ul {
	height: 100%;
}
</style>
