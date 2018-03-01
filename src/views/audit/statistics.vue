<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      
      <span class="gap-right"> 审核日期 </span>
      <el-date-picker v-model="listQuery.display_time" type="date" format="yyyy-MM-dd" placeholder="选择开始日期">
      </el-date-picker>

      <el-date-picker v-model="listQuery.display_time" type="date" format="yyyy-MM-dd" placeholder="选择结束日期">
      </el-date-picker>


      <span class="gap-left gap-right"> 审核银行 </span>
      <el-select clearable style="width: 445px" class="filter-item" v-model="listQuery.importance" :placeholder="'审核银行'">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select> 

      <span class="gap-left gap-right"> 审核人 &nbsp; &nbsp; </span>
      <el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.type" :placeholder="'审核人'">
        <el-option v-for="item in  typeOptions" :key="item._id" :label="item.title" :value="item._id">
        </el-option>
      </el-select> 

      <span class="gap-left"></span><span class="gap-left gap-right"></span>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">

      <el-table-column align="center" :label="'审核人'" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'通过数量'" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.acceptedCount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'拒绝数量'" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.rejectedCount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'平均审核周期(单位：小时)'" >
        <template slot-scope="scope">
          <span>{{scope.row.averageScreeningPeriod}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="80px" :label="$t('table.importance')">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" icon-class="star" class="meta-item__icon" :key="n"></svg-icon>
        </template>
      </el-table-column> -->
      <!-- <el-table-column align="center" :label="$t('table.readings')" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.pageviews" class="link-type" @click='handleFetchPv(scope.row.pageviews)'>{{scope.row.pageviews}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('table.status')" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column align="center" :label="$t('table.actions')"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'auditDetail/'+scope.row.imageId" class="link-type" style="margin-right:20px" >审核</router-link>
          <<el-button type="danger" size="mini" @click="handleConfirmDelete(scope.row)">{{$t('table.delete')}}</el-button> -->
          <!-- <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{$t('table.publish')}}
          </el-button> -->
          <!-- <el-button size="mini" type="primary" @click="handleModifyPassword(scope.row)" style="width:80px">修改密码
          </el-button>
          <el-button size="mini" type="primary" :disabled="scope.row.state == 'active'" @click="handleModifyStatus(scope.row, 'active')">启用 
          </el-button>
          <el-button size="mini" type="danger"  :disabled="scope.row.state == 'inactive'" @click="handleModifyStatus(scope.row, 'inactive')">停用
          </el-button> 
        </template>
      </el-table-column> -->
    </el-table>

    <!-- <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->

    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.type')" prop="type">
          <el-select class="filter-item" v-model="temp.type" placeholder="Please select">
            <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select class="filter-item" v-model="temp.status" placeholder="Please select">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.importance')">
          <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max='3'></el-rate>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog> -->

    <!-- <el-dialog title="修改密码" :visible.sync="dialogResetPassword">

    <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
            
            <el-form-item :label="$t('table.account')" disabled prop="account">
              <el-input v-model="temp.account"></el-input>
            </el-form-item>

            <el-form-item :label="$t('table.password')">
              <el-input v-model="temp.password" type="password"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.repassword')">
              <el-input v-model="temp.repassword" type="password"></el-input>
            </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogResetPassword = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="handleResetPassword">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog> -->

  </div>
</template>

<script>
// import { fetchList, deleteArticle } from '@/api/article'
import {ScreeningSummary} from '@/api/screening'
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
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
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
    }
  },
  created() {
      this.getList()
  },
  methods: {
    getList() {
      var self = this
      self.listLoading = true
      ScreeningSummary(self.listQuery).then(response => {
        self.list = response.data.data
        self.total = response.data.total
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
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
      //     this.temp.author = 'vue-element-admin'
      //     createArticle(this.temp).then(() => {
      //       this.list.unshift(this.temp)
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         title: '成功',
      //         message: '创建成功',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     })
      //   }
      // })
    },
    handleUpdate(row) {
      // this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      // this.dialogStatus = 'update'
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    updateData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     const tempData = Object.assign({}, this.temp)
      //     tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      //     updateArticle(tempData).then(() => {
      //       for (const v of this.list) {
      //         if (v.id === this.temp.id) {
      //           const index = this.list.indexOf(v)
      //           this.list.splice(index, 1, this.temp)
      //           break
      //         }
      //       }
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         title: '成功',
      //         message: '更新成功',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     })
      //   }
      // })
    },
    handleResetPassword() {

      // if(this.temp.password != this.temp.repassword){
      //     this.$message({message: '密码不一致',type: 'warning'})
      //     return 
      // }

      // ResetPassword({ account: this.temp.account }).then(response => {
      //   this.$notify({
      //     title: '成功',
      //     message: '修改密码成功',
      //     type: 'success',
      //     duration: 2000
      //   })
      //   const index = this.list.indexOf(this.currentRow)
      //   this.list.splice(index, 1)
      // }).catch(err => {
      //   this.$notify({
      //     title: '失败',
      //     message: '修改密码失败',
      //     type: 'warning',
      //     duration: 2000
      //   })
      //   console.log(err)
      // })

      // this.dialogResetPassword = false
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
</style>