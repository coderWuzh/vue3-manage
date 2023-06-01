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
        <el-table-column prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="uId" label="用户ID" width="55" align="center" />
        <el-table-column prop="order_id" label="订单号"  align="center" />
        <el-table-column prop="goods_name" label="商品名" align="center" />
        <el-table-column label="总价" width="85" align="center">
          <template #default="scope">
            ￥{{ scope.row.goods_price }}
          </template>
        </el-table-column>
        <el-table-column prop="goods_num" label="数量" width="55" align="center" />
        <el-table-column prop="order_status" label="订单状态" width="55" align="center" />
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
        <el-form-item label="ID">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="form.uId" />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="form.order_id" />
        </el-form-item>
        <el-form-item label="商品名">
          <el-input v-model="form.goods_name" />
        </el-form-item>
        <el-form-item label="总价">
          <el-input v-model="form.goods_price" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="form.goods_num" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-input v-model="form.order_status" />
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
interface TableItem {
  id: number;
  uId: number;
  order_id: string;
  goods_name: string;
  goods_price: string;
  goods_num: string;
  order_status:string
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
      url: "/api/order/getData",
    })
    .then((res: any) => {
      console.log(res.data);
      
      tableData.value = res.data
      pageTotal.value = res.data.length
    });
}
getData()

// 插入数据
const insertData = (form: TableItem) => {
  http
    .$axios({
      url: "/api/order/insertData",
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
  form.id=0;
  form.uId=0;
  form.order_id='';
  form.goods_name='';
  form.goods_price='';
  form.goods_num='';
  form.order_status='',
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
const handleDelete = (row: any) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning',
  })
    .then(() => {
      http.$axios({
        url: "/api/order/deleteData",
        method: "POST",
        data: {
          id:row.id
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
  id:0,
  uId:0,
  order_id:'',
  goods_name:'',
  goods_price:'',
  goods_num:'',
  order_status:'',
})
let idx = -1
const handleEdit = (index: number, row: any) => {
  idx = index + (query.pageIndex - 1) * 10
  form.id = row.id
  form.uId = row.uId
  form.order_id = row.order_id
  form.goods_name = row.goods_name
  form.goods_price = row.goods_price
  form.goods_num = row.goods_num
  form.order_status = row.order_status
  editVisible.value = true
}
const saveEdit = () => {
  editVisible.value = false
  if (idx == -1) {
    console.log(form);
    insertData(form)
  } else {
    http.$axios({
      url: "/api/order/editData",
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
