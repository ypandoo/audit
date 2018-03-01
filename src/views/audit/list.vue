<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      
      <span class="gap-right"> 上传日期 </span>
      <el-date-picker v-model="listQuery.upload_start_time" type="date" format="yyyy-MM-dd" placeholder="选择开始日期">
      </el-date-picker>

      <el-date-picker v-model="listQuery.upload_end_time" type="date" format="yyyy-MM-dd" placeholder="选择结束日期">
      </el-date-picker>

      <span class="gap-left gap-right"> 审核日期 </span>
      <el-date-picker :disabled="listQuery.imageState == 'IMPORTED'" v-model="listQuery.audit_start_time" type="date" format="yyyy-MM-dd" placeholder="选择开始日期">
      </el-date-picker>

      <el-date-picker :disabled="listQuery.imageState == 'IMPORTED'" v-model="listQuery.audit_end_time" type="date" format="yyyy-MM-dd" placeholder="选择结束日期">
      </el-date-picker>

    </div>

    <div class="filter-container">
      <span class="gap-right"> 审核银行 </span>
      <el-select clearable style="width: 445px" class="filter-item" v-model="listQuery.customerName" :placeholder="'银行'">
        <el-option v-for="item in bankList" :key="item.id" :label="item.ident" :value="item.id">
        </el-option>
      </el-select> 

      <span class="gap-left gap-right"> 图片状态 </span>
      <el-select @change='handleFilter' style="width: 445px" class="filter-item" v-model="listQuery.imageState">
        <el-option v-for="item in stateList" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <span class="gap-left gap-right"></span><span class="gap-left gap-right"></span>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column align="center" :label="$t('table.imageId')" width="240">
        <template slot-scope="scope">
          <span>{{scope.row.imageId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.imageId')" width="240">
        <template slot-scope="scope">
          <img :src="scope.row.imageData" style="width:100px; height:auto"/>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.customerName')" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.customerName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="160" align="center" :label="$t('table.imageState')">
        <template slot-scope="scope">
          <span>{{scope.row.imageState | imageStateFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column width="160" align="center" :label="$t('table.screeningUserName1')">
        <template slot-scope="scope">
          <span >{{scope.row.screeningUserName1}}</span>
        </template>
      </el-table-column> 

      <el-table-column width="200" align="center" :label="$t('table.screeningUserName2')">
        <template slot-scope="scope">
          <span>{{scope.row.screeningUserName2 }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" :label="$t('table.uploadDate')">
        <template slot-scope="scope">
          <span>{{scope.row.uploadDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" :label="$t('table.screeningDate')">
        <template slot-scope="scope">
          <span>{{scope.row.screeningDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'auditDetail/'+scope.row.imageId" class="link-type" style="margin-right:20px" >审核</router-link>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
// import { fetchList, deleteArticle } from '@/api/article'
import { GetScreeningList, GetBankList} from '@/api/screening'
import { GetUserList} from '@/api/user'
var moment = require('moment')
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

const stateOptions = [
  { key: 'IMPORTED', display_name: '未审核' },
  { key: 'PARTIAL_ACCEPTED', display_name: '部分审核' },
  { key: 'ACCEPTED', display_name: '审核通过' },
  { key: 'REJECTED', display_name: '审核驳回' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 1,
      listLoading: true,
      currentRow: {},
      listQuery: {
        page: 1,
        limit: 20,
        upload_start_time : new Date(),
        upload_end_time : new Date(),
        audit_start_time: '',
        audit_end_time: '',
        customerName: '',
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: '+id'
      },
      bankList: {},
      stateList: stateOptions,
      importanceOptions: [1, 2, 3],
      typeOptions: {},
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        account: '',
        password: '',
        repassword: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogResetPassword: false,
      pvData: [],
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // updatedAt: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    imageStateFilter(status){
      const statusMap = {'IMPORTED':'未审核' ,
                        'PARTIAL_ACCEPTED':'部分审核' ,
                        'ACCEPTED':'审核通过' ,
                        'REJECTED':'审核驳回' }

      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  created() {
      //role id auditor
      GetBankList().then(response => {
        this.bankList = response.data.data;
        this.listQuery.imageState = 'IMPORTED';
        this.getList();
      }).catch(err => {
      this.$notify({
        title: '失败',
        message: '获取银行列表失败',
        type: 'warning',
        duration: 2000
      })
      console.log(err)
    })

      //this.getList()
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
        var ONE_HOUR = 60 * 60 * 1000
        var currentDate = new Date()
        var dt =  new Date(parseInt(row.screeningDate)*1000)
        if(currentDate - dt > ONE_HOUR*12)
        {
          return 'warning-row';
        } 
        return '';
    },

    getList() {
      var self = this
      self.listLoading = true
      GetScreeningList(this.listQuery).then(response => {
        self.list = response.data.data.list
        self.total = response.data.data.pagination.total
        self.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },

    handleModifyStatus(row, state) {
      UpdateUserState({state:state}).then(response => {
        this.$message({message: '操作成功',type: 'success'})
        row.state = state
      }).catch(err => {
        this.$message({message: '操作失败',type: 'warning'})
        console.log(err)
      })


    },
    resetTemp() {
      this.temp = {
        account: '',
        password: '',
        repassword: '',
        status: 'published'
      }
    },
    handleModifyPassword(row) {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogResetPassword = true
      this.temp.account = row.account
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleResetPassword() {

      if(this.temp.password != this.temp.repassword){
          this.$message({message: '密码不一致',type: 'warning'})
          return 
      }

      ResetPassword({ account: this.temp.account }).then(response => {
        this.$notify({
          title: '成功',
          message: '修改密码成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(this.currentRow)
        this.list.splice(index, 1)
      }).catch(err => {
        this.$notify({
          title: '失败',
          message: '修改密码失败',
          type: 'warning',
          duration: 2000
        })
        console.log(err)
      })

      this.dialogResetPassword = false
    },
    handleConfirmDelete(row){
      this.currentRow = row
      this.dialogDelete = true
    },
    // handleFetchPv(pv) {
    //   // fetchPv(pv).then(response => {
    //   //   this.pvData = response.data.pvData
    //   //   this.dialogDelete = true
    //   // })
    // },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel(tHeader, data, 'table-list')
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.gap-left{
  margin-left: 60px;
}

.gap-right{
  margin-right: 20px;
}

.warning-row {
    color:red !important;
  }

.success-row {
    background: #f0f9eb;
  }
</style>
