<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" :label="$t('table.account')" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.userName')" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120" align="center" :label="$t('table.mobile')">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" :label="$t('table.role')">
        <template slot-scope="scope">
          <span >{{scope.row.role.displayName}}</span>
        </template>
      </el-table-column> 

      <el-table-column width="240" align="center" :label="$t('table.email')">
        <template slot-scope="scope">
          <span>{{scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160" align="center" :label="$t('table.createDate')">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160" align="center" :label="$t('table.updateDate')">
        <template slot-scope="scope">
          <span>{{scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="400" :label="$t('table.actions')"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleModifyPassword(scope.row)" style="width:80px">修改密码
          </el-button>
          <el-button size="mini" type="primary" :disabled="scope.row.state == 'ACTIVE' || scope.row.role.roleId == 10" @click="handleModifyStatus(scope.row, 'ACTIVE')">启用 
          </el-button>
          <el-button size="mini" type="danger"  :disabled="scope.row.state == 'INACTIVE' || scope.row.role.roleId == 10" @click="handleModifyStatus(scope.row, 'INACTIVE')">停用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改密码" :visible.sync="dialogResetPassword">

    <el-form :rules="rules" ref="temp" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
            
            <el-form-item :label="$t('table.account')"  prop="account">
              <el-input v-model="temp.account" :disabled="true"></el-input>
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
    </el-dialog>

  </div>
</template>

<script>
import { GetUserList, ResetPassword, UpdateUserState } from '@/api/user'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'


export default {
  name: 'userList',
  directives: {
    waves
  },
  data() {
      const passwordCheck  = (rule, value, callback) => {
      if (value === '') {
        this.$message({message: '密码未填写完整',type: 'error'})
        return
      } 
      if (!validator.isNumeric(value)) {
        this.$message({message: '密码只能是数字',type: 'error'})
        return
      }
      if (!validator.isLength(value,{min:6, max:12})) {
        this.$message({message: '密码为6-12位',type: 'error'})
        return
      }  
      callback()
    }

    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      currentRow: {},
      listQuery: {
        page: 1,
        limit: 20,
      },
      typeOptions: {},
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
        repassword: [{ required: true, validator: passwordCheck }],
        password: [{ required: true, validator: passwordCheck }],
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
      GetUserList({roleId: ''}).then(response => {
        self.list = response.data.data
        self.total = response.data.total
        self.listLoading = false
      }).catch(err => {
              this.$message({
                message: '获取用户列表失败',
                type: 'warning'
              })
              self.listLoading = false
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

    handleModifyStatus(row, state) {
      UpdateUserState({account: row.username, state:state}).then(response => {
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
      this.temp.password = row.password
      this.temp.repassword = row.repassword
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },

    handleResetPassword() {

      if(this.temp.password != this.temp.repassword){
          this.$message({message: '密码不一致',type: 'warning'})
          return 
      }

      ResetPassword({ account: this.temp.account, password: this.temp.password }).then(response => {
        this.$refs['temp'].clearValidate()
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

  }
}
</script>
