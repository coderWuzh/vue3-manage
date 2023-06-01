<template>
  <div class="table-container">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name" placeholder="搜索" class="handle-input mr10" />
        <el-button type="primary" :icon="Search" @click="handleSearch" color="#b0352f">
          搜索
        </el-button>
        <el-button type="primary" :icon="Plus" color="#b0352f" @click="showDialog">
          新增
        </el-button>
      </div>
      <el-table ref="multipleTable"
        :data="tableData.slice((query.pageIndex - 1) * query.pageSize, query.pageIndex * query.pageSize)" border class="table"
        header-cell-class-name="table-header">
        <el-table-column prop="goods_id" label="ID" width="55" align="center" />
        <el-table-column prop="name" label="商品名" align="center" />
        <el-table-column label="商品图(点击查看大图)" align="center">
          <template #default="scope">
            <el-image class="table-td-thumb" :src="scope.row.imgUrl" :z-index="10" :preview-src-list="[scope.row.imgUrl]"
              preview-teleported />
          </template>
        </el-table-column>
        <el-table-column label="价格" align="center">
          <template #default="scope">
            ￥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="数量" align="center" />

        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button v-permiss="15" text :icon="Edit" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button v-permiss="16" text :icon="Delete" class="del" @click="handleDelete(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
          :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange" />
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog v-model="editVisible" title="编辑" width="30%">
      <el-form label-width="70px">
        <el-form-item label="商品id">
          <el-input v-model="form.goods_id" />
        </el-form-item>
        <el-form-item label="商品名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="form.price" />
        </el-form-item>
        <el-form-item label="商品图片" style="width: 300px;">
          <el-upload class="avatar-uploader" action="http://gmall-h5-api.atguigu.cn/admin/product/fileUpload"
            :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="form.num" />
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts" name="basetable">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus, Search } from '@element-plus/icons-vue'
import http from '@/utils/request'
import type { UploadProps } from 'element-plus'
interface TableItem {
  id: number;
  goods_id: number;
  name: string;
  price: number;
  num: number;
  imgUrl: string;
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  form.imgUrl = response.data
  console.log(form.imgUrl);
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  return true
}
const query = reactive({
  name: '',
  pageIndex: 1,
  pageSize: 10,
})
const tableData = ref<TableItem[]>([])
const pageTotal = ref(0)
// 获取表格数据
const getData = () => {
  http
    .$axios({
      url: "/api/goods/getData",
    })
    .then((res: any) => {
      tableData.value = res.data
      pageTotal.value = res.data.length
    });
}
getData()

// 插入数据
const insertData = (form: TableItem) => {
  http
    .$axios({
      url: "/api/goods/insertData",
      method: "POST",
      data: {
        form: JSON.stringify(form)
      }
    })
    .then((res: any) => {
      if (res.success) {
        ElMessage.success(`添加成功`)
      } else {
        ElMessage.error(`添加失败`)
      }
    });
  getData()

}

//新增数据
const showDialog = () => {
  editVisible.value = true
  form.goods_id = 0
  form.name = ''
  form.price = 0
  form.num = 0
  form.imgUrl = ''
  editVisible.value = true
  idx = -1
}
// 查询操作
const handleSearch = () => {
  query.pageIndex = 1
  getData()
}
// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val
  getData()
}

// 删除操作
const handleDelete = (index: number) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning',
  })
    .then(() => {
      http.$axios({
        url: "/api/goods/deleteData",
        method: "POST",
        data: {
          goods_id: index + (query.pageIndex - 1) * 10
        }
      })
        .then((res: any) => {
          if (res.success) {
            ElMessage.success('删除成功')
            getData()
          } else {
            ElMessage.error(`修改失败`)
          }
        });

    })
    .catch(() => { })
}
// 表格编辑时弹窗和保存
const editVisible = ref(false)
const form = reactive({
  id: 0,
  goods_id: 0,
  name: '',
  price: 0,
  num: 0,
  imgUrl: '',
})
let idx = -1
const handleEdit = (index: number, row: any) => {
  idx = index + (query.pageIndex - 1) * 10
  form.goods_id = row.goods_id
  form.name = row.name
  form.price = row.price
  form.num = row.num
  form.imgUrl = row.imgUrl
  editVisible.value = true
}
const saveEdit = () => {
  editVisible.value = false
  if (idx == -1) {
    console.log(form);
    insertData(form)
  } else {
    http.$axios({
      url: "/api/goods/editData",
      method: "POST",
      data: {
        form: JSON.stringify(form)
      }
    })
      .then((res: any) => {
        if (res.success) {
          ElMessage.success(`修改第 ${idx + 1} 行成功`)
          getData()
        } else {
          ElMessage.error(`修改失败`)
        }
      });
  }
}
</script>


<style scoped>
@media (min-width: 1536px) {
  .container {
    max-width: 100%;
  }
}

.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}

.table {
  width: 100%;
  font-size: 14px;
}

.del {
  color: #b0352f;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

:deep(.el-upload--text) {
  width: 180px;
}

:deep(.avatar-uploader .el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: var(--el-color-primary);
}

:deep(.el-icon.avatar-uploader-icon) {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
:deep(.el-pagination.is-background .el-pager li.is-active){
  background-color:#b0352f
}
</style>
