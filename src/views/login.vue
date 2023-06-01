<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="login-box">
        <div class="left-img">
          <img class="img" src="../assets/img/bg.jpeg" alt="">
        </div>
        <div class="right-form">
          <el-form ref="login" :model="param" :rules="rules" label-width="0px" class="ms-content">
            <el-form-item prop="username">
              <el-input v-model="param.username" placeholder="username">
                <template #prepend>
                  <el-button :icon="User" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="param.password"
                type="password"
                placeholder="password"
                @keyup.enter="submitForm(login)"
              >
                <template #prepend>
                  <el-button :icon="Lock" />
                </template>
              </el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="submitForm(login)">
                登录
              </el-button>
            </div>
            <p class="login-tips">
              Tips : 用户名和密码随便填。
            </p>
          </el-form>
          <div class="tips">
            思茶网后台管理系统
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { usePermissStore } from '../store/permiss'
import { useTagsStore } from '../store/tags'
import http from '@/utils/request'


interface LoginInfo {
  username: string
  password: string
}

const router = useRouter()
const param = reactive<LoginInfo>({
  username: 'admin',
  password: '123456',
})

const rules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    {
      min: 3, 
      max: 10,
      message: '长度在3到10个字符之间', 
      trigger: 'blur'
    }
  ],
  password: [
    { 
      required: true, 
      message: '请输入密码', 
      trigger: 'blur' 
    },
    {
      min: 6, 
      max: 16, 	
      message: '长度在6到20个字符之间',
      trigger: 'blur'
    }
  ],
}
const permiss = usePermissStore()
const login = ref<FormInstance>()
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl)
    return
  formEl.validate((valid: boolean) => {
    if (valid) {
      http
      .$axios({
        url: "/api/login",
        method: "POST",
        data: {
          adminName:param.username,
          adminPwd:param.password
        }
      })
      .then((res: any) => {
        console.log(res);
        if(res.success){
          ElMessage.success('登录成功')
          localStorage.setItem('ms_username', res.data.admin_name)
          const keys = res.data.authority.split(',')
          // const keys = permiss.defaultList[param.username === 'admin' ? 'admin' : 'user']
          permiss.handleSet(keys)
          localStorage.setItem('ms_keys', JSON.stringify(keys))
          router.push('/')
        }else{
          ElMessage.error(res.msg)
        }
      })
    }
    else {
      ElMessage.error('用户名或密码错误')
      return false
    }
  })
}

const tags = useTagsStore()
tags.clearTags()
</script>


<style scoped lang="less">
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(https://source.unsplash.com/collection/94734566/1920x1080);
	background-size: 100%;
}
.ms-login {
	display: flex;
	margin: 0 auto;
  align-items: center;
	width: 700px;
  height: 100vh;
	border-radius: 5px;
	overflow: hidden;
  .login-box {
    display: flex;
    border-radius: 6px;
    overflow: hidden;
  }
	.left-img {
    position: relative;
    flex: 1;
		height: 400px;
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &::after {
      position: absolute;
      content: "";
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background-color: rgba(255, 255, 255, 0.2);
      z-index: 1;
    }
	}
  .right-form {
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 400px;
    background: #F3FBFE;
    .tips {
      position: absolute;
      right: 8px;
      bottom: 8px;
      color: #ccc;
    }
  }
}
.ms-content {
	padding: 30px 30px;
}
.login-btn {
	text-align: center;
}
.login-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}
.login-tips {
	font-size: 12px;
	line-height: 30px;
	color: #fff;
}
</style>
