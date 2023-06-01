<template>
  <div class="table-container">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" :icon="Plus" color="#b0352f" @click="showDialog">
          新增
        </el-button>
      </div>
      <el-table ref="multipleTable"
        :data="tableData.slice((query.pageIndex - 1) * query.pageSize, query.pageIndex * query.pageSize)" border class="table"
        header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="admin_name" label="管理员账号" align="center" />
        
        <el-table-column prop="password" label="密码" align="center" />
        <el-table-column prop="authority" label="权限" align="center" />

        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button v-permiss="15" text :icon="Edit" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button v-permiss="16" text :icon="Delete" class="del" @click="handleDelete(scope.row)">
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
        <el-form-item label="账号">
          <el-input v-model="form.admin_name" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" />
        </el-form-item>
        <el-form-item label="权限">
          <el-input v-model="form.authority" />
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
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import http from '@/utils/request'
interface TableItem {
  id?: number;
  admin_name:string
  password:string
  authority:string
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
      url: "/api/admin/getData",
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
      url: "/api/admin/addAdmin",
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
  form.admin_name = ''
  form.password = ''
  form.authority = ''
  editVisible.value = true
  idx = -1
}
// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val
  getData()
}

// 删除操作
const handleDelete = (row: any) => {
  admin_id = row.id

  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning',
  })
    .then(() => {
      http.$axios({
        url: "/api/admin/deleteAdmin",
        method: "POST",
        data: {
          admin_id
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
  admin_name:'',
  password:'',
  authority:''
})
let idx = -1
let admin_id:number
const handleEdit = (index: number, row: any) => {
  admin_id = row.id
  idx = index + (query.pageIndex - 1) * 10
  form.admin_name = row.admin_name
  form.password = row.password
  form.authority = row.authority
  editVisible.value = true
  console.log(admin_id);
}
const saveEdit = () => {
  editVisible.value = false
  if (idx == -1) {
    console.log(form);
    insertData(form)
  } else {
    http.$axios({
      url: "/api/admin/editAdmin",
      method: "POST",
      data: {
        admin_id,
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
