<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      
      <span class="gap-right"> 审核日期 </span>
      <el-date-picker v-model="listQuery.audit_start_time" :clearable="false" type="date" format="yyyy-MM-dd" placeholder="选择开始日期">
      </el-date-picker>

      <el-date-picker v-model="listQuery.audit_end_time" :clearable="false" type="date" format="yyyy-MM-dd" placeholder="选择结束日期">
      </el-date-picker>


      <span class="gap-left gap-right"> 审核银行 </span>
      <el-select clearable style="width: 445px" class="filter-item" v-model="listQuery.customerId" :placeholder="'银行'">
        <el-option v-for="item in bankList" :key="item.name" :label="item.ident" :value="item.name">
        </el-option>
      </el-select> 
    </div>

    <div class="filter-container">
      <span class="gap-right"> 审核人 &nbsp; &nbsp; </span>
      <el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.account" :placeholder="'审核人'">
        <el-option v-for="item in  userList" :key="item.account" :label="item.name" :value="item.account">
        </el-option>
      </el-select> 

      <span class="gap-left"></span><span class="gap-left gap-right"></span>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">

      <el-table-column align="center" :label="'通过数量'" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.accepted}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'拒绝数量'" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.rejected}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'平均审核周期(单位：小时)'" >
        <template slot-scope="scope">
          <span>{{scope.row.averagePeriod | hourFilter}}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import {ScreeningSummary, GetBankList} from '@/api/screening'
import { GetUserList} from '@/api/user'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'auditStatistic',
  directives: {
    waves
  },
  data() {
    var currentDate =  new Date()
    var lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    return {
      tableKey: 0,
      list: [],
      total: null,
      bankList: [],
      userList: [],
      listLoading: true,
      currentRow: {},
      listQuery: {
        page: 1,
        limit: 20,
        audit_start_time : lastMonth,
        audit_end_time : currentDate,
        customerId: '',
        account: ''
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      downloadLoading: false
    }
  },
  filters: {
    hourFilter(seconds) {
      var hours = parseFloat(seconds) / 3600;

      return hours.toFixed(1)
    },
  },
  created() {
      self.listLoading = true
      GetBankList().then(response => {
        this.bankList = response.data.data;
        GetUserList({roleId: 20}).then(response => {
          this.userList = response.data.data;
          this.getList();
        }).catch(err => {
          self.listLoading = false
          this.$notify({title: '失败',message: '获取用户列表失败',type: 'warning',duration: 2000})
        })})
        .catch(err => {
          self.listLoading = false
          this.$notify({title: '失败',message: '获取银行列表失败',type: 'warning',duration: 2000})
        })
  },
  methods: {
    getList() {
      var self = this
      var query = {
        'screeningBank': this.listQuery.customerId,
        'screeningUser': this.listQuery.account,
        'screeningDateFrom':    parseInt((new Date(this.listQuery.audit_start_time)).getTime()*0.001),
        'screeningDateTo':      parseInt((new Date(this.listQuery.audit_end_time)).getTime()*0.001),
      }

      ScreeningSummary(query).then(response => {
        self.list = []
        self.list.push(response.data.data)
        self.total = response.data.total
        self.listLoading = false
      }).catch(err => {
          self.listLoading = false
          this.$notify({title: '失败',message: '获取统计数据失败',type: 'warning',duration: 2000})
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
