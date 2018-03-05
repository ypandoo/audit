<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" label-position="top">

      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">


          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">提交
          </el-button>

        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        </template>

      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">

            <div class="postInfo-container">
              <el-row>
                <el-col :span="12">
                    <el-form-item label-width="100px" label="账户(6-12个英文或数字):" class="postInfo-container-item" prop="account" >
                      <el-input placeholder="账户" :disabled="isEdit" style='min-width:400px;' v-model="postForm.account" >
                      </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label-width="100px" label="用户名(2-12个字符):" class="postInfo-container-item" prop="username" >
                      <el-input placeholder="用户名" :disabled="isEdit" style='min-width:400px;' v-model="postForm.username">
                      </el-input>
                    </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                    <el-form-item label-width="100px" label="Email:" class="postInfo-container-item" prop="email">
                      <el-input placeholder="Email" style='min-width:400px;' v-model="postForm.email" >
                      </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label-width="100px" label="手机号(11位数字):" class="postInfo-container-item" prop="mobile" >
                      <el-input placeholder="手机号" style='min-width:400px;' v-model="postForm.mobile" >
                      </el-input>
                    </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                    <el-form-item label-width="100px" label="密码(6-12个字符):" class="postInfo-container-item" prop="password">
                      <el-input placeholder="密码" style='min-width:400px;' v-model="postForm.password" type="password" >
                      </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label-width="100px" label="确认密码(6-12个字符):" class="postInfo-container-item" prop="repassword">
                      <el-input placeholder="确认密码" style='min-width:400px;' v-model="postForm.repassword" type="password" >
                      </el-input>
                    </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$t('table.role')" prop ="role" >
                    <el-select class="filter-item" :disabled="true" v-model="postForm.role" clearable placeholder="请选择角色" style='min-width:400px;'>
                      <el-option v-for="item in  typeOptions" :key="item.roleId" :label="item.displayName" :value="item.roleId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="8">
                  <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.display_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col> -->
              </el-row>
            </div>
          </el-col>
        </el-row>

        <!-- <el-form-item style="margin-bottom: 40px;" label-width="100px" label="文章简介:" prop="content_short">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.content_short" >
          </el-input>
          <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
        </el-form-item>


        <div style="margin-bottom: 20px;">
          <el-form-item label-width="100px" label="上传附件:" prop="image_uri">
          <Upload v-model="postForm.image_uri"></Upload>
          </el-form-item>
        </div>


        <div class="editor-container">
          <el-form-item label-width="100px" label="文章正文:" prop="content">
          <tinymce :height=500 ref="editor" v-model="postForm.content"></tinymce>
          </el-form-item>
        </div> -->
      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
// import { fetchArticle, createArticle, updateArticle } from '@/api/article'
// import { fetchList as fetchCategory} from '@/api/category'
import { userSearch } from '@/api/remoteSearch'
import { GetRoleList, Register, ModifyUserInfo, GetUserProfile } from '@/api/user'
import validator from 'validator';

const defaultForm = {
  status: 'draft',
  username: '',
  account: '',
  role: '',
  password: '',
  repassword: '',
  email: '',
  mobile: ''
}

export default {
  name: 'userDetail',
  components: { Tinymce, MDinput, Upload, Multiselect, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: '内容未填写完整',
          type: 'error'
        })
        //callback(null)
      } else {
        callback()
      }
    }

    const accountCheck  = (rule, value, callback) => {
      if (value === '') {
        this.$message({message: '账户未填写完整',type: 'error'})
        //callback(null)
        return
      } 
      if (!validator.isAlphanumeric(value)) {
        this.$message({message: '账户名只能是数字和字母',type: 'error'})
        //callback(null)
        return
      }
      if (!validator.isLength(value,{min:6, max:12})) {
        this.$message({message: '账户名为6-12位字符',type: 'error'})
        //callback(null)
        return
      }  

      callback()
    } 

    const mobileCheck  = (rule, value, callback) => {
      if (value === '') {
        this.$message({message: '手机号未填写完整',type: 'error'})
        //callback(null)
        return
      } 
      if (!validator.isNumeric(value)) {
        this.$message({message: '手机号只能是数字',type: 'error'})
        //callback(null)
        return
      }
      if (!validator.isLength(value,{min:11, max:11})) {
        this.$message({message: '手机号只能为11位',type: 'error'})
        //callback(null)
        return
      }  

      callback()
    } 

    const passwordCheck  = (rule, value, callback) => {
      if (value === '') {
        this.$message({message: '密码未填写完整',type: 'error'})
        //callback(null)
        return
      } 
      if (!validator.isNumeric(value)) {
        this.$message({message: '密码只能是数字',type: 'error'})
        //callback(null)
        return
      }
      if (!validator.isLength(value,{min:6, max:12})) {
        this.$message({message: '密码为6-12位',type: 'error'})
        //callback(null)
        return
      }  

      callback()
    } 

    const nameCheck  = (rule, value, callback) => {
      if (value === '') {
        this.$message({message: '用户名未填写完整',type: 'error'})
        //callback(null)
        return
      } 
      // if (!validator.isAlphanumeric(value)) {
      //   this.$message({message: '账户名只能是数字和字母',type: 'error'})
      //   callback(null)
      //   return
      // }
      if (!validator.isLength(value,{min:2, max:12})) {
        this.$message({message: '用户名为2-12位字符',type: 'error'})
        //callback(null)
        return
      }  

      callback()
    } 

    const emailCheck  = (rule, value, callback) => {
      if (value === '') {
        this.$message({message: 'email未填写完整',type: 'error'})
        //callback(null)
        return
      } 
      if (!validator.isEmail(value)) {
        this.$message({message: '非法的email账户名',type: 'error'})
        //callback(null)
        return
      }
      // if (!validator.isLength(value,{min:4, max:12})) {
      //   this.$message({message: '用户名为4-12位字符',type: 'error'})
      //   callback(null)
      //   return
      // }  

      callback()
    } 
    return {
      postForm: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      typeOptions: [],
      rules: {
        username: [{ required: true, validator: nameCheck }],
        password: [{ required: true, validator: passwordCheck }],
        //email: [{ required: true, validator: emailCheck }],
        account: [{ required: true, validator: accountCheck }],
        repassword: [{ required: true, validator: passwordCheck }],
        //mobile: [{ required: true, validator: mobileCheck }],
        role: [{ required: true, validator: validateRequire }],
      }
    }
  },

  created() {
      this.postForm = Object.assign({}, defaultForm)
      GetRoleList({}).then(response => {
        this.typeOptions = response.data.data;
        this.postForm.role = 20; //make auditor selected
        if (this.isEdit) {
          this.fetchData()
        } 
      }).catch(err => {
        this.$message({message: '获取数据失败',type: 'warning'})
        this.fetchSuccess = false
        console.log(err)
      })
  },
  methods: {
    fetchData() {
        GetUserProfile({ account: this.$store.getters.token }).then(response => {
          this.postForm.account = response.data.data.account
          this.postForm.password = response.data.data.password
          this.postForm.repassword = response.data.data.password
          this.postForm.mobile = response.data.data.mobile
          this.postForm.username = response.data.data.username
          this.postForm.email = response.data.data.email
          this.postForm.role = response.data.data.roleId
        }).catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
    },
    submitForm() {
      // this.postForm.display_time = parseInt(this.display_time / 1000)
      console.log(this.postForm)
      var self = this
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if(self.postForm.password != self.postForm.repassword){
              this.$message({
                message: '密码不一致',
                type: 'warning'
              })
              return;
          }

          this.loading = true
          if (this.isEdit) {
            const submitData = {
              // 'account': self.postForm.account,
              'username': self.postForm.username,
              'mobile' : self.postForm.mobile,
              'password': self.postForm.password,
              'email': self.postForm.email
            }

            // add new article
            ModifyUserInfo(submitData).then(response => {
              if (response.data.error_code === 0) {
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.postForm.status = 'published'
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                })
              }
              this.loading = false
            }).catch(err => {
              this.$message({
                message: '修改失败',
                type: 'warning'
              })
              this.loading = false
              console.log(err)
            })
          } else {
            const submitData = {
              'account': self.postForm.account,
              'username': self.postForm.username,
              'roleId': self.postForm.role,
              'mobile' : self.postForm.mobile,
              'password': self.postForm.password,
              'email': self.postForm.email
            }

            // add new article
            Register(submitData).then(response => {
              if (response.data.error_code === 0) {
                this.$notify({
                  title: '成功',
                  message: '用户注册成功',
                  type: 'success',
                  duration: 2000
                })
                this.postForm.status = 'published'
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                })
              }
              this.loading = false
            }).catch(err => {
              this.$message({
                message: '用户注册失败',
                type: 'warning'
              })
              this.loading = false
              console.log(err)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        console.log(response)
        this.userLIstOptions = response.data.items.map(v => ({
          key: v.name
        }))
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }

  label{
    text-align: left !important;
  }
</style>

