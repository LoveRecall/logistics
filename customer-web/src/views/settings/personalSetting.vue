<template>
  <div class="peosonalSetting">
    <el-form label-width="190px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$i.setting.email +':'" required>
            <el-input type="email" style="max-width:200px;" v-model="form.email" disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item :label="$i.setting.userName+':'" required >
            <el-input style="max-width:200px" v-model="form.userName" :disabled="isModify"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item  :label="$i.setting.password+':'">
            <el-input style="max-width:140px;" type="password" disabled="disabled" name="fakeusernameremembered" auto-complete="new-password"></el-input>
            <button type="button" :class="isModifyPass?'Disbutton':'button'"   @click="modifyPassword()">Replace</button>
            <!-- <el-button style=" " @click="dialogVisible = true">Replace</el-button> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item  :label="$i.setting.tel+':'" required>
            <el-input style="max-width:200px" v-model="form.tel" :disabled="isModify"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$i.setting.birthday+':'"  v-if="isVisible" >
            <div style="display:flex;max-width:200px;">
              <el-date-picker
                type="date"
                :placeholder="$i.common.inputSearch"
                v-model="form.birthday"
                style="max-width:300px;"
                @change="val => {form.birthday = $dateFormat(form.birthday,'yyyy-mm-dd')}"
                :disabled="isModify"></el-date-picker>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item  :label="$i.setting.department+':'" v-if="isVisible">
            <el-input style="max-width:200px"v-model="form.deptName"  disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item  :label="$i.setting.language+':'"  v-if="isVisible" required>
            <el-select v-model="form.lang" :placeholder="$i.common.inputSearch" style="width: 200px" :disabled="isModify">
              <el-option
                v-for="item in language"
                :key="item.code"
                :label="item.name"
                :value="item.code"
                style="width: 200px">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item  :label="$i.setting.role+':'" v-if="isVisible">
            <el-input style="max-width:200px" v-model="form.roleName" disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$i.setting.gender+':'"  v-if="isVisible" required>
            <el-select v-model="form.gender" :placeholder="$i.common.inputSearch" style="width: 200px" :disabled="isModify">
              <el-option
                v-for="item in sex"
                :key="item.id"
                :label="item.name"
                :value="Number(item.code)"
                style="width: 200px">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="button_div">
      <div class="summary-btn">
        <div v-if="summaryDisabled">
          <el-button @click="modifySummary">{{$i.common.modify}}</el-button>
        </div>
        <div v-else>
          <el-button :loading="allowModifySummary" type="primary" @click="putUserProfile">{{$i.common.modify}}</el-button>
          <el-button @click="cancelModifySummary">{{$i.common.cancel}}</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      class="speDialog"
      :visible.sync="dialogVisibleO"
      width="30%"
      :before-close="handleClose">
      <el-form>
        <el-form-item :label="$i.setting.oldPassword +':'"  :label-width="formLabelWidth" required>
          <el-input type="password"  v-model="modifyPass.oldPassword"></el-input>
        </el-form-item>
        <el-form-item :label="$i.setting.newPassword+':'"  :label-width="formLabelWidth" required>
          <el-input  type="password" v-model="modifyPass.newPassword"></el-input>
        </el-form-item>
        <el-form-item :label="$i.setting.confirmPassword+':'" :label-width="formLabelWidth" required>
          <el-input type="password" v-model="modifyPass.comfirmNewPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="okPassword">{{$i.common.ok}}</el-button>
            <el-button @click="cancelPassword">{{$i.common.cancel}}</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$i.common.enterPassword));
        } else {
          if (this.modifyPass.comfirmNewPassword.length !== '') {
            this.$refs.modifyPass.validateField('comfirmNewPassword');
          }
          callback()
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$i.common.enterPasswordAgain));
        } else if (value !== this.modifyPass.newPassword) {
          callback(new Error(this.$i.common.theTwoPasswordsDoNotMatch));
        } else {
          callback();
        }
      };
      return {
        summaryDisabled:true,
        allowModifySummary:false,
        form: {
          email:'',
          userName:'',
          password:'',
          tel:'',
          gender:'', //0：男，1：女，2：未知性
          birthday:'',
          lang:'',
          deptName:'',
          roleName:'',
          deptId:'',
          roleId:''
        },
        modifyPass:{
          oldPassword:'',
          newPassword:'',
          comfirmNewPassword:''
        },
        modifyEmail:{
          newEmail:''
        },
        dialogVisibleO:false,
        formLabelWidth: '160px',
        language:[],
        sex:[],
        isVisible:false,
        isModify:true,
        isModifyPass:false,
      };
    },
    methods: {
      ...mapActions(['setMenuLink']),
      getUserPrivilege(){
        this.$ajax.get(this.$apis.get_user_privilege)
          .then(res => {
            //用户类型：0 管理员，1 普通用户  2 english 1 chinese
            if (res.userType === 1 ){
              this.isVisible = true;
            }else{
              this.isVisible = false;
            }
          })
      },
      postLanguage(){
        this.$ajax.post(this.$apis.POST_CODE_PART,['LANGUAGE','SEX'])
          .then(res => {
            this.language = _.findWhere(res, {'code': 'LANGUAGE'}).codes;
            this.sex = _.findWhere(res, {'code': 'SEX'}).codes;
          });
      },
      getUserProfile(){
        this.$ajax.get(this.$apis.get_user_profile)
          .then(res => {
            this.form = res
          })
      },
      modifySummary(){
        this.summaryDisabled=false;
        this.isModify = false;
        this.isModifyPass = true;
      },
      cancelModifySummary(){
        this.summaryDisabled=true;
        this.isModify = true;
        this.isModifyPass = false;
        this.getUserProfile();
      },
      cancelPassword(){
        this.dialogVisibleO = false;
        this.modifyPass = {
          password:'',
          newPassword:'',
          comfirmNewPassword:''
        }
      },
      okPassword(){
        if (this.$validateForm(this.modifyPass, this.$db.setting.personalInfo)) {
          return false;
        }else{
          if (this.modifyPass.newPassword === this.modifyPass.comfirmNewPassword ){
            this.putUserPassword();
          }else{
            this.$message({
              type: 'warning',
              message: this.$i.common.pleaseKeepTheSamePasswordYouEnteredTwice
            });
            return  false;
          }
        }
      },
      putUserProfile(){
        if (!this.isVisible){
          this.form.birthday = new Date().getTime();
          this.form.lang = '2';
        }
        if (this.$validateForm(this.form, this.$db.setting.personalInfo)) {
          return false;
        }
        const params = {
          userName: this.form.userName,
          tel: this.form.tel,
          gender: this.form.gender,
          birthday: this.form.birthday,
          lang: this.form.lang
        }

        this.allowModifySummary=true;
        this.$ajax.put(this.$apis.put_user_profile,params)
          .then(res => {
            this.$message({
              type: 'success',
              message: this.$i.common.modifySuccess
            });
            this.getUserProfile();
            this.isModifyPass = false;
            this.isModify = true;
            this.summaryDisabled=true;
            this.allowModifySummary=false;
          }).catch(err=>{
          this.allowModifySummary=false;
          this.summaryDisabled=true;
          this.isModify = true;
          this.isModifyPass = false;
          this.getUserProfile();
        });
      },
      putUserPassword(){
        //校验新旧密码
        if(this.modifyPass.oldPassword == this.modifyPass.comfirmNewPassword){
          this.$message({
            type: 'warning',
            message: this.$i.common.cannotPassword
          });
          return false;
        }

        const params = {
          password:this.modifyPass.oldPassword,
          newPassword:this.modifyPass.newPassword,
          comfirmNewPassword:this.modifyPass.comfirmNewPassword,
        }
        this.$ajax.put(this.$apis.put_user_profile_password,params)
          .then(res => {
            this.dialogVisibleO = false;
            this.$message({type: 'success', message: this.$i.common.modifySuccess});
            this.modifyPass = {
              password:'',
              newPassword:'',
              comfirmNewPassword:''
            }
          })
      },
      handleClose(){
        this.dialogVisibleO = false;
      },
      modifyPassword(){
        if (this.isModifyPass){
          return false;
        }else{
          this.dialogVisibleO = true;
        }
      }
    },
    created(){
      this.getUserPrivilege();
      this.getUserProfile();
      this.postLanguage();
    },
    mounted(){
      this.setMenuLink({
        path: '/logs',
        query: {code: 'PERSONAL_SETTING',bizCode: 'BIZ_USER'},
        type: 100,
        label: this.$i.common.log,
      });
    },
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .button_div{
    display: flex;
    justify-content: center;
    margin-top: 60px;
    margin-bottom: 80px;
  }
  .dialog-footer{
    padding-top: 30px;
  }
  .button{
    padding: 7px 6px;
    font-size: 12px;
    border-radius: 3px;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-color: #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
    margin: 0;
  }
  .button:hover {
    color: #3a8ee6;
    border-color: #c6e2ff;
    background: #ecf5ff;
    outline: none;
  }
  .Disbutton{
    padding: 7px 6px;
    font-size: 12px;
    border-radius: 3px;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-color: #dcdfe6;
    color: #c0c4cc;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    cursor: not-allowed;
  }

</style>
