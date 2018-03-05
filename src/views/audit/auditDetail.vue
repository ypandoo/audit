<template>
  <div class="app-container calendar-list-container">

    <el-table :key='tableKey' :data="basic" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%; margin-bottom:20px">
      <el-table-column label="卡片信息">
      <el-table-column  align="center" :label="$t('table.imageId')" width="240">
        <template slot-scope="scope">
          <span>{{scope.row.imageId}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" :label="$t('table.uploadDate')" width="240">
        <template slot-scope="scope">
          <span>{{scope.row.uploadDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" :label="'最后审核时间'" width="240">
        <template slot-scope="scope">
          <span>{{scope.row.screeningDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="160"  align="center" :label="$t('table.imageState')">
        <template slot-scope="scope">
          <span>{{scope.row.imageState | imageStateFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" :label="'卡片所属银行'">
        <template slot-scope="scope">
          <span>{{scope.row.customerName}}</span>
        </template>
      </el-table-column>
      </el-table-column>
    </el-table>

    
    <el-table :key='tableKey1' :data="history" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%; margin-bottom:20px">

      <el-table-column label="审核历史">
      <el-table-column align="center" :label="$t('table.screeningDate')" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.screeningDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.userName')" width="240">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'审核结果'" width="240">
        <template slot-scope="scope">
           <span>{{scope.row.screeningResult | imageStateFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" :label="'审核备注'">
        <template slot-scope="scope">
          <span>{{scope.row.screeningDesc}}</span>
        </template>
      </el-table-column>
      </el-table-column>
    </el-table>

    <el-row class="head">
      审核内容
    </el-row>
      <el-row>
        <el-col :span=16 class="head" style="height:660px">
           <img :src="imageData" class="image">
        </el-col>
        <el-col :span=8 class="head" style="height:660px; background-color:white">

          <el-row>审核文字</el-row>
          <p style="    font-size: 16px;
    font-weight: 500;
    color: #b0b0b0;
    padding: 10px 20px;
    margin-bottom: 60px;">{{text}}</p>

          <el-row>输入审核理由</el-row>
          <MDinput name="name" v-model="reason" required :maxlength="100">
                
          </MDinput>


          <el-row style="    margin-top: 60px;
    text-align: right;">
            <el-button  type="primary" :disabled="audited" @click="handleModifyStatus('ACCEPTED')">审核通过 </el-button> 
            <el-button  type="danger"  :disabled="audited" @click="handleModifyStatus('REJECTED')">审核驳回</el-button>
          </el-row>
          
          
        </el-col>
      </el-row>

  </div>
</template>

<script>
import { GetScreeningList, GetScreeningItem, postScreeningResult} from '@/api/screening'
import MDinput from '@/components/MDinput'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
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
  components: { MDinput },
  data() {
    return {
      tableKey: 0,
      tableKey1: 1,
      basic: [],
      history:[],
      audited: true,
      total: null,
      listLoading: true,
      imageData: '',
      text: '',
      reason: '',
      currentRow: {},
      listQuery: {
        page: 1,
        limit: 20,
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: '+id'
      },
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
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
        imageStateFilter(status){
      const statusMap = {'IMPORTED':'未审核' ,
                        'PARTIAL_ACCEPTED':'部分审核' ,
                        'ACCEPTED':'审核通过' ,
                        'REJECTED':'审核驳回' }

      return statusMap[status]
    },
  },
  created() {
      this.getList()
  },
  methods: {
    getList() {
      var self = this
      self.listLoading = true
      GetScreeningItem({imageId:  this.$route.params.id }).then(response => {
        if(response.data.error_code == 0)
        {
          self.basic =[{imageState: response.data.data.imageState
          , imageId: response.data.data.imageId
          , screeningDate: response.data.data.screeningDate
          , customerName:response.data.data.customerName
          , uploadDate: response.data.data.uploadDate
          , text: response.data.data.text
          }];

          self.imageData = response.data.data.imageData
          self.history = response.data.data.screeningRecord
          self.text = response.data.data.text
          self.listLoading = false
          self.audited = false
        }else{
          this.$message({message: '获取数据失败',type: 'warning'})
          console.log(err)
        }
      }).catch(err => {
          this.$message({message: '获取数据失败',type: 'warning'})
          console.log(err)
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

    handleModifyStatus(screeningResult) {

      if(screeningResult == 'REJECTED' && !this.reason){
         this.$message({message: '请输入拒绝理由',type: 'warning'})
         return
      }

      postScreeningResult({imageId: this.$route.params.id, screeningResult:screeningResult, comments: this.reason}).then(response => {
        this.$message({message: '操作成功',type: 'success'})
        self.audited = true
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

<style rel="stylesheet/scss" lang="scss" scoped>
.gap-left{
  margin-left: 60px;
}

.gap-right{
  margin-right: 20px;
}

h3{
  font-size: 20px;
  color:#409eff
}
.image{
      height: 100%;
      padding: 10px
}

.head{
      padding-left: 10px;
    color: #909399;
    font-size: 14px;
    font-weight: bold;
    background: #f5f7fa;
    border: 1px solid #ebeef5;
    background-color: #f5f7fa;
    padding: 10px;
}

.border{
  border: 1px solid #ebeef5;
}
</style>
