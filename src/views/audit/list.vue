<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      
      <span class="gap-right"> 上传日期 </span>
      <el-date-picker v-model="listQuery.upload_start_time" type="date" :clearable= "false" format="yyyy-MM-dd" placeholder="选择开始日期">
      </el-date-picker>

      <el-date-picker v-model="listQuery.upload_end_time" type="date" :clearable= "false" format="yyyy-MM-dd" placeholder="选择结束日期">
      </el-date-picker>

      <span class="gap-left gap-right"> 审核日期 </span>
      <el-date-picker :disabled="listQuery.imageState == 'IMPORTED' || listQuery.imageState == 'TODO'" v-model="listQuery.audit_start_time" type="date" format="yyyy-MM-dd" placeholder="选择开始日期">
      </el-date-picker>

      <el-date-picker :disabled="listQuery.imageState == 'IMPORTED' || listQuery.imageState == 'TODO'" v-model="listQuery.audit_end_time" type="date" format="yyyy-MM-dd" placeholder="选择结束日期">
      </el-date-picker>

    </div>

    <div class="filter-container">
      <span class="gap-right"> 审核银行 </span>
      <el-select clearable style="width: 445px" class="filter-item" v-model="listQuery.customerId" :placeholder="'银行'">
        <el-option v-for="item in bankList" :key="item.name" :label="item.ident" :value="item.name">
        </el-option>
      </el-select> 

      <span class="gap-left gap-right"> 图片状态 </span>
      <el-select style="width: 445px" class="filter-item" v-model="listQuery.imageState">
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
          <span>{{scope.row.itemId}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" :label="$t('table.imageId')" width="240">
        <template slot-scope="scope">
          <img :src="scope.row.imageData" style="width:100px; height:auto"/>
        </template>
      </el-table-column> -->

      <el-table-column align="center" :label="$t('table.customerName')" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.customerName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120" align="center" :label="$t('table.imageState')">
        <template slot-scope="scope">
          <span>{{scope.row.imageState | imageStateFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80" align="center" :label="'审核员'">
        <template slot-scope="scope">
          <span >{{scope.row.screeningRecord.length >= 1 ? scope.row.screeningRecord[0].username : ''}}</span>
        </template>
      </el-table-column> 

      <el-table-column width="80" align="center" :label="'审核员'">
        <template slot-scope="scope">
          <span>{{scope.row.screeningRecord.length >= 2 ? scope.row.screeningRecord[1].username : ''}} </span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" :label="$t('table.uploadDate')">
        <template slot-scope="scope">
          <span>{{ parseInt(scope.row.creationDate)*1000 | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" :label="$t('table.screeningDate')">
        <template slot-scope="scope">
          <span>{{ parseInt(scope.row.screeningDate)*1000 | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'auditDetail/'+scope.row.itemId" class="link-type" style="margin-right:20px" >审核</router-link>
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
import { GetScreeningList, GetBankList} from '@/api/screening'
import { GetUserList} from '@/api/user'
var moment = require('moment')
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'


const stateOptions = [
  { key: 'TODO', display_name: '未审核+部分审核' },
  { key: 'IMPORTED', display_name: '未审核' },
  { key: 'PARTIAL_ACCEPTED', display_name: '部分审核' },
  { key: 'ACCEPTED', display_name: '审核通过' },
  { key: 'REJECTED', display_name: '审核驳回' }
]

export default {
  name: 'auditList',
  directives: {
    waves
  },
  data() {
    var currentDate =  new Date()
    var lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    return {
      tableKey: 0,
      list: null,
      total: 1,
      listLoading: true,
      currentRow: {},
      listQuery: {
        page: 1,
        limit: 20,
        upload_start_time : lastMonth,
        upload_end_time : currentDate,
        audit_start_time: '',
        audit_end_time: '',
        customerId: 'ICBC',
        imageState: 'TODO'
      },
      isAdmin: true,
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
                        'REJECTED':'审核驳回',
                        'TODO': '未审核+部分审核'}

      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  created() {
      if(this.$store.getters.roles[0] == 'admin')
        this.isAdmin = true;
      else
        this.isAdmin = false;

      //role id auditor
      GetBankList().then(response => {
        this.bankList = response.data.data;
        this.listQuery.imageState = 'TODO';
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
        var dt =  new Date(parseInt(row.creationDate)*1000)
        if(currentDate - dt > ONE_HOUR*12 && (row.imageState == 'IMPORTED' || row.imageState == 'PARTIAL_ACCEPTED'))
        {
          return 'warning-row';
        } 
        return '';
    },

    getList() {
      var self = this
      self.listLoading = true

      var imageState = []
      if(this.listQuery.imageState == 'TODO')
      {
        imageState.push('IMPORTED')
        imageState.push('PARTIAL_ACCEPTED')
      }else{
        imageState.push(this.listQuery.imageState)
      }

      var query = {
        'customerId': this.listQuery.customerId,
        'currentPage': this.listQuery.page,
        'pageSize': this.listQuery.limit,
        'uploadDateFrom':    parseInt((new Date(this.listQuery.upload_start_time)).getTime()*0.001),
        'uploadDateTo':      parseInt((new Date(this.listQuery.upload_end_time)).getTime()*0.001),
        'screeningDateFrom': this.listQuery.audit_start_time == '' ? '' : parseInt((new Date(this.listQuery.audit_start_time)).getTime()*0.001),
        'screeningDateTo':   this.listQuery.audit_end_time == '' ? '' : parseInt((new Date(this.listQuery.audit_end_time)).getTime()*0.001),
        'imageState': imageState
      }
      GetScreeningList(query).then(response => {
        self.list = response.data.data.list
        self.total = response.data.data.pagination.total
        self.listLoading = false
      }).catch(err => {
        this.$notify({
          title: '失败',
          message: '获取审核列表失败',
          type: 'warning',
          duration: 2000
        })
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
