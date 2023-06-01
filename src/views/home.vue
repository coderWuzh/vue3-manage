<template>
  <v-header />
  <v-sidebar />
  <div class="content-box" :class="{ 'content-collapse': sidebar.collapse }">
    <div class="content home-content">
    <v-tags></v-tags>
      <router-view v-slot="{ Component }">
        <transition name="move" mode="out-in">
          <keep-alive :include="tags.nameList">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebarStore } from '../store/sidebar'
import { useTagsStore } from '../store/tags'
import vHeader from '../components/header.vue'
import vSidebar from '../components/sidebar.vue'
import vTags from '../components/tags.vue' 

const sidebar = useSidebarStore()
const tags = useTagsStore()
</script>

<style scoped>
  .home-content{
    padding: 5px 10px;
  }
</style>

