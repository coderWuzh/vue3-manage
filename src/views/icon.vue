<script setup lang="ts" name="icon">
import { computed, ref } from 'vue'

const iconList: Array<string> = [
  'attentionforbid',
  'attentionforbidfill',
  'attention',
  'attentionfill',
  'tag',
  'tagfill',
  'people',
  'peoplefill',
  'notice',
  'noticefill',
  'mobile',
  'mobilefill',
  'voice',
  'voicefill',
  'unlock',
  'lock',
  'home',
  'homefill',
  'delete',
  'deletefill',
  'notification',
  'notificationfill',
  'notificationforbidfill',
  'like',
  'likefill',
  'comment',
  'commentfill',
  'camera',
  'camerafill',
  'warn',
  'warnfill',
  'time',
  'timefill',
  'location',
  'locationfill',
  'favor',
  'favorfill',
  'skin',
  'skinfill',
  'news',
  'newsfill',
  'record',
  'recordfill',
  'emoji',
  'emojifill',
  'message',
  'messagefill',
  'goods',
  'goodsfill',
  'crown',
  'crownfill',
  'move',
  'add',
  'hot',
  'hotfill',
  'service',
  'servicefill',
  'present',
  'presentfill',
  'pic',
  'picfill',
  'rank',
  'rankfill',
  'male',
  'female',
  'down',
  'top',
  'recharge',
  'rechargefill',
  'forward',
  'forwardfill',
  'info',
  'infofill',
  'redpacket',
  'redpacket_fill',
  'roundadd',
  'roundaddfill',
  'friendadd',
  'friendaddfill',
  'cart',
  'cartfill',
  'more',
  'moreandroid',
  'back',
  'right',
  'shop',
  'shopfill',
  'question',
  'questionfill',
  'roundclose',
  'roundclosefill',
  'roundcheck',
  'roundcheckfill',
  'global',
  'mail',
  'punch',
  'exit',
  'upload',
  'read',
  'file',
  'link',
  'full',
  'group',
  'friend',
  'profile',
  'addressbook',
  'calendar',
  'text',
  'copy',
  'share',
  'wifi',
  'vipcard',
  'weibo',
  'remind',
  'refresh',
  'filter',
  'settings',
  'scan',
  'qrcode',
  'cascades',
  'apps',
  'sort',
  'searchlist',
  'search',
  'edit',
]
const keyword = ref('')
const list = computed(() => {
  return iconList.filter((item) => {
    return item.includes(keyword.value)
  })
})
</script>

<template>
  <div class="container">
    <h2>使用方法</h2>
    <h3 mt8>
      iconify icon
    </h3>
    <p mt4>
      > 由unocss支持, 内置：@iconify-json/carbon
    </p>
    <a mt4 block href="https://icon-sets.iconify.design/carbon/" target="_blank">> icon 列表</a>
    <p mt4>
      > 使用方法：设置类名 icon-btn
    </p>
    <p mt4>
      > 如:
        &lt;i icon-btn i-carbon-logo-github /&gt;
    </p>
    <h3 mt10>
      element icon
    </h3>
    <p style="line-height: 50px">
      直接通过设置类名为 el-icon-lx-iconName 来使用即可。例如：（共{{ iconList.length }}个图标）
    </p>
    <p class="example-p">
      <i class="el-icon-lx-redpacket_fill" style="font-size: 30px; color: #ff5900" />
      <span>&lt;i class=&quot;el-icon-lx-redpacket_fill&quot;&gt;&lt;/i&gt;</span>
    </p>
    <p class="example-p">
      <i class="el-icon-lx-weibo" style="font-size: 30px; color: #fd5656" />
      <span>&lt;i class=&quot;el-icon-lx-weibo&quot;&gt;&lt;/i&gt;</span>
    </p>
    <p class="example-p">
      <i class="el-icon-lx-emojifill" style="font-size: 30px; color: #ffc300" />
      <span>&lt;i class=&quot;el-icon-lx-emojifill&quot;&gt;&lt;/i&gt;</span>
    </p>
    <br>
    <h2>图标</h2>
    <div class="search-box">
      <el-input v-model="keyword" class="search" size="large" clearable placeholder="请输入图标名称" />
    </div>
    <ul>
      <li v-for="(item, index) in list" :key="index" class="icon-li">
        <div class="icon-li-content">
          <i :class="`el-icon-lx-${item}`" />
          <span>{{ item }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.example-p {
	height: 45px;
	display: flex;
	align-items: center;
}
.search-box {
	text-align: center;
	margin-top: 10px;
}
.search {
	width: 300px;
}
ul,
li {
	list-style: none;
}
.icon-li {
	display: inline-block;
	padding: 10px;
	width: 120px;
	height: 120px;
}
.icon-li-content {
	display: flex;
	height: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}
.icon-li-content i {
	font-size: 36px;
	color: #606266;
}
.icon-li-content span {
	margin-top: 10px;
	color: #787878;
}
</style>
