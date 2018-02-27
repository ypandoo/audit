<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" label-position="top">

      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">

          <!-- <router-link style="margin-right:15px;" v-show='isEdit' :to="{ path:'create-form'}">
            <el-button type="info">创建form</el-button>
          </router-link> -->

          <!-- <el-dropdown trigger="click">
            <el-button plain>{{!postForm.comment_disabled?'评论已打开':'评论已关闭'}}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu class="no-padding" slot="dropdown">
              <el-dropdown-item>
                <el-radio-group style="padding: 10px;" v-model="postForm.comment_disabled">
                  <el-radio :label="true">关闭评论</el-radio>
                  <el-radio :label="false">打开评论</el-radio>
                </el-radio-group>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->

          <!-- <el-dropdown trigger="click">
            <el-button plain>平台
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu class="no-border" slot="dropdown">
              <el-checkbox-group v-model="postForm.platforms" style="padding: 5px 15px;">
                <el-checkbox v-for="item in platformsOptions" :label="item.key" :key="item.key">
                  {{item.name}}
                </el-checkbox>
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown> -->

          <!-- <el-dropdown trigger="click">
            <el-button plain>
              外链
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu class="no-padding no-border" style="width:300px" slot="dropdown">
              <el-form-item label-width="0px" style="margin-bottom: 0px" prop="source_uri">
                <el-input placeholder="请输入内容" v-model="postForm.source_uri">
                  <template slot="prepend">填写url</template>
                </el-input>
              </el-form-item>
            </el-dropdown-menu>
          </el-dropdown> -->

          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">提交
          </el-button>
          <!-- <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button> -->

        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        </template>

      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <!-- <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>
              <span v-show="postForm.title.length>=26" class='title-prompt'>app可能会显示不全</span>
            </el-form-item> -->

            <div class="postInfo-container">
              <el-row>
                <el-col :span="12">
                    <el-form-item label-width="100px" label="账户(2-20个字符):" class="postInfo-container-item" prop="account" >
                      <el-input placeholder="账户" style='min-width:150px;' v-model="postForm.account" >
                      </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label-width="100px" label="用户名(2-20个字符):" class="postInfo-container-item" prop="username" >
                      <el-input placeholder="用户名" style='min-width:150px;' v-model="postForm.username">
                      </el-input>
                    </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                    <el-form-item label-width="100px" label="Email:" class="postInfo-container-item" prop="email">
                      <el-input placeholder="Email" style='min-width:150px;' v-model="postForm.email" >
                      </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label-width="100px" label="手机号(11位):" class="postInfo-container-item" prop="mobile" >
                      <el-input placeholder="手机号" style='min-width:150px;' v-model="postForm.mobile" >
                      </el-input>
                    </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                    <el-form-item label-width="100px" label="密码(6-10个字符):" class="postInfo-container-item" prop="password">
                      <el-input placeholder="密码" style='min-width:150px;' v-model="postForm.password" type="password" >
                      </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label-width="100px" label="确认密码:" class="postInfo-container-item" prop="repassword">
                      <el-input placeholder="确认密码" style='min-width:150px;' v-model="postForm.repassword" type="password" >
                      </el-input>
                    </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$t('table.role')" prop ="role" >
                    <el-select class="filter-item" v-model="postForm.role" clearable placeholder="请选择角色">
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
import { GetRoleList, Register } from '@/api/user'

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
        callback(null)
      } else {
        callback()
      }
    }

    return {
      postForm: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      typeOptions: {},
      rules: {
        username: [{ required: true, validator: validateRequire }],
        password: [{ required: true, validator: validateRequire }],
        email: [{ required: true, validator: validateRequire }],
        account: [{ required: true, validator: validateRequire }],
        repassword: [{ required: true, validator: validateRequire }],
        mobile: [{ required: true, validator: validateRequire }],
        role: [{ required: true, validator: validateRequire }],
      }
    }
  },

  created() {
      this.postForm = Object.assign({}, defaultForm)
      GetRoleList({}).then(response => {
        this.typeOptions = response.data.data;
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
        // fetchArticle({ id: this.$route.params.id }).then(response => {
        //   this.postForm.title = response.data.item.title
        //   this.postForm.image_uri = response.data.item.url
        //   this.postForm.content_short = response.data.item.desc
        //   this.postForm.content = response.data.item.content
        //   this.postForm.author = response.data.item.author
        //   this.postForm.type = response.data.item.type
        // }).catch(err => {
        //   this.fetchSuccess = false
        //   console.log(err)
        // })
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
              'title': self.postForm.title,
              'desc': self.postForm.content_short,
              'url': self.postForm.image_uri,
              'id': this.$route.params.id,
              'content' : self.postForm.content,
              'author': self.postForm.author,
              'type': self.postForm.type
            }

            // add new article
            // updateArticle(submitData).then(response => {
            //   if (response.data.error_code === 0) {
            //     this.$notify({
            //       title: '成功',
            //       message: '文章修改成功',
            //       type: 'success',
            //       duration: 2000
            //     })
            //     this.postForm.status = 'published'
            //   } else {
            //     this.$message({
            //       message: response.data.msg,
            //       type: 'warning'
            //     })
            //   }
            //   this.loading = false
            // }).catch(err => {
            //   this.$message({
            //     message: '文章修改失败',
            //     type: 'warning'
            //   })
            //   this.loading = false
            //   console.log(err)
            // })
          } else {
            const submitData = {
              'account': self.postForm.account,
              'username': self.postForm.username,
              'role': self.postForm.role,
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

