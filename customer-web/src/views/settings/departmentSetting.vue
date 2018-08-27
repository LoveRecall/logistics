<template>
  <div class="department-setting">
    <div class="title">
      {{$i.setting.departmentSetting}}
    </div>

    <div class="body">
      <el-row :gutter="15">
        <el-col :span="8">
          <div class="card department" v-loading="loadingDepartment">
            <div class="title">{{$i.setting.department}}</div>
            <div class="handler">
              <el-row>
                <el-col :span="8">
                  <el-button @click="addDepartment()" size="small" type="primary">{{$i.setting.add}}
                  </el-button>
                </el-col>
                <el-col :span="16">
                  <el-input
                    size="small"
                    :placeholder="$i.setting.pleaseInput"
                    v-model="searchDepartment"
                    clearable>
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-col>
              </el-row>
            </div>
            <div class="list">
              <div class="list-title">{{$i.setting.all}} <span>({{$i.setting.activated}} {{departmentUserTotal}})</span>
              </div>
              <el-tree class="departmentTree"
                       ref="departmentTree"
                       :data="departmentData"
                       :props="{label: 'deptName'}"
                       node-key="deptId"
                       default-expand-all
                       draggable
                       :allow-drop="(draggingNode, dropNode, type) => type === 'prev' && !dropNode.childNodes.length"
                       @node-drop="departmentDrop"
                       :expand-on-click-node="false"
                       :filter-node-method="filterDepartment"
                       @node-click="data => departmentClick(data)">
                <div class="custom-tree-node" slot-scope="{ node, data }"
                     :class="{isAction:node.data.deptId === userData.deptId}">
                  <div v-if="!data.children">
                    <span class="name-title" v-text="node.label + '(' + node.data.deptUserCount + ')'"></span>
                    <div class="action">
                      <el-button
                        class="treeBtn"
                        type="text"
                        icon="el-icon-edit"
                        @click.stop="addDepartment(data,node,$event)">
                      </el-button>
                      <el-button
                        class="treeBtn"
                        type="text"
                        icon="el-icon-delete"
                        @click.stop="deleteDepartment(data,node)">
                      </el-button>
                    </div>
                  </div>
                  <span v-else v-text="node.label"></span>
                </div>
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="card role" v-loading="loadingRole">
            <div class="title">{{$i.setting.role}}</div>
            <div class="handler">
              <el-row>
                <el-col :span="8">
                  <el-button :disabled="!userData.deptId" @click="addRole()" size="small"
                             type="primary">{{$i.setting.add}}
                  </el-button>
                </el-col>
                <el-col :span="16">
                  <el-input
                    size="small"
                    :placeholder="$i.setting.pleaseInput"
                    v-model="searchRole"
                    clearable>
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-col>
              </el-row>
            </div>
            <div class="list">
              <div class="list-title">{{$i.setting.all}} <span>({{$i.setting.activated}} {{roleUserTotal}})</span></div>
              <el-tree
                class="speTree"
                ref="roleTree"
                :data="roleData"
                :props="{label: 'roleName'}"
                show-checkbox
                node-key="roleId"
                default-expand-all
                draggable
                :allow-drop="(draggingNode, dropNode, type) => type === 'prev' && !dropNode.childNodes.length"
                @node-drop="roleDrop"
                :expand-on-click-node="false"
                :filter-node-method="filterRole"
                @node-click="roleNodeClick"
                @check="roleCheckClick">
                <div class="custom-tree-node" slot-scope="{ node, data }"
                     :class="{isAction:node.data.roleId === selectRole}">
                  <div v-if="!data.children">
                    <span class="name-title" v-text="node.label + '(' + data.roleUserCount + ')'"></span>
                    <div class="action">
                      <el-button
                        class="treeBtn"
                        type="text"
                        icon="el-icon-edit"
                        @click.stop="addRole(data,node)">
                      </el-button>
                      <el-button
                        class="treeBtn"
                        type="text"
                        icon="el-icon-delete"
                        @click.stop="deleteRole(data,node)">
                      </el-button>
                    </div>
                  </div>
                  <span v-else v-text="node.label"></span>
                </div>
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="card role" v-loading="loadingPrivilege">
            <div class="title">{{$i.setting.privilege}}</div>
            <div class="handler">
              <el-row>
                <el-col :span="8">
                  <el-button :disabled="!selectRole" @click="savePrivilege" size="small"
                             type="primary">{{$i.setting.save}}
                  </el-button>
                </el-col>
                <el-col :span="16">
                  <el-input
                    size="small"
                    :placeholder="$i.setting.pleaseInput"
                    v-model="searchPrivilege"
                    clearable>
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-col>
              </el-row>
            </div>
            <div class="list">
              <el-tree
                class="speTree"
                ref="privilegeTree"
                :data="privilegeData"
                :props="{label: 'name'}"
                show-checkbox
                node-key="code"
                :default-expanded-keys="['pageAll','dataAll']"
                :expand-on-click-node="false"
                :filter-node-method="filterPrivilege">
              </el-tree>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="footer">
      <div class="title">{{$i.setting.belongingUsers}}</div>
      <div class="btns">
        <el-button :disabled="checkedRole.length !== 1" type="primary" @click="addUsers">{{$i.setting.add}}</el-button>
        <el-button :disabled="selectList.length===0" :loading="inviteUserLoading" type="primary"
                   @click="inviteUser">
          {{$i.setting.invite}}
        </el-button>
        <el-button type="primary" @click="()=>$refs.importUser.show()">{{$i.button.upload}}</el-button>
      </div>
      <div class="content">
        <el-form :inline="true">
          <el-form-item :label="$i.setting.email">
            <el-input :placeholder="$i.setting.pleaseInput" clearable v-model="searchUser.email"></el-input>
          </el-form-item>
          <el-form-item :label="$i.setting.userName">
            <el-input :placeholder="$i.setting.pleaseInput" clearable v-model="searchUser.userName"></el-input>
          </el-form-item>
          <el-form-item :label="$i.setting.gender">
            <el-select :placeholder="$i.setting.pleaseChoose" clearable v-model="searchUser.gender">
              <el-option
                v-for="item in genderOption"
                :key="item.id"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$i.setting.status">
            <el-select :placeholder="$i.setting.pleaseChoose" clearable v-model="searchUser.status">
              <el-option
                v-for="(item,index) in actionOption"
                :key="index"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDepartmentUser">{{$i.setting.search}}</el-button>
          </el-form-item>
        </el-form>

        <v-table v-loading="userListLoading"
                 class="speTable"
                 ref="vTable"
                 :data="tableDataList"
                 :buttons="setButton"
                 hide-filter-value
                 hide-filter-column
                 @change-checked="item => { selectList = item }"
                 @action="btnClick"></v-table>
        <v-pagination :page-data="userListPage" @size-change="pageSizeChange"
                      @change="pageChange"></v-pagination>
      </div>
    </div>

    <!--修改/添加 用户信息-->
    <el-dialog
      class="speDialog"
      :close-on-click-modal="false"
      :title="editUserdialog.title[editUserdialog.type]"
      :visible.sync="editUserdialog.show"
      width="50%">
      <el-form :model="addUser">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$i.setting.email" :label-width="formLabelWidth" required>
              <el-input
                v-if="editUserdialog.type === 0"
                class="speInput"
                v-model="addUser.email"
                auto-complete="off"
                :placeholder="$i.setting.pleaseInput"></el-input>
              <span v-else v-text="addUser.email"></span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$i.setting.userName" :label-width="formLabelWidth">
              <el-input
                class="speInput"
                v-model="addUser.userName"
                auto-complete="off"
                :placeholder="$i.setting.pleaseInput"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$i.setting.lang" :label-width="formLabelWidth">
              <el-select class="speInput" v-model="addUser.lang" :placeholder="$i.setting.pleaseChoose">
                <el-option
                  v-for="item in languageOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$i.setting.tel" :label-width="formLabelWidth">
              <el-input class="speInput" v-model="addUser.tel" auto-complete="off"
                        :placeholder="$i.setting.pleaseInput"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$i.setting.gender" :label-width="formLabelWidth">
              <el-select class="speInput" v-model="addUser.gender" :placeholder="$i.setting.pleaseChoose">
                <el-option
                  v-for="item in genderOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$i.setting.birthday" :label-width="formLabelWidth">
              <el-date-picker
                class="speInput"
                :editable="false"
                v-model="addUser.birthday"
                type="date"
                @change="() => addUser.birthday = $dateFormat(addUser.birthday, 'yyyy-mm-dd')"
                :placeholder="$i.setting.pleaseChoose">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$i.setting.department" :label-width="formLabelWidth" required>
              <el-select :disabled="editUserdialog.type === 0" class="speInput" v-model="addUser.deptId"
                         @change="changeUserDep"
                         :placeholder="$i.setting.pleaseChoose">
                <el-option
                  v-for="item in departmentData"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$i.setting.role" :label-width="formLabelWidth" required>
              <el-select :disabled="editUserdialog.type === 0" class="speInput" v-model="addUser.roleId"
                         :placeholder="$i.setting.pleaseChoose">
                <el-option
                  v-for="item in roleOption"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item :label="$i.setting.remark" :label-width="formLabelWidth">
              <el-input class="speInput" v-model="addUser.remark" auto-complete="off"
                        :placeholder="$i.setting.pleaseInput"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" :loading="addUserLoading" @click="sureAddUser">{{$i.setting.sure}}</el-button>
        <el-button @click="editUserdialog.show = false">{{$i.setting.cancel}}</el-button>
      </div>
    </el-dialog>

    <v-import-template ref="importUser" code="USER_IMPORT" biz-code="BIZ_USER"></v-import-template>
  </div>
</template>

<script>

  import {VTable, VPagination, VImportTemplate} from '@/components/index'
  import config from 'service/config'
  import {Base64} from 'js-base64';
  import Qs from 'qs';
  import {mapActions} from 'vuex'
  import $i from '../../language/index';

  export default {
    name: "department-setting",
    components: {
      VTable,
      VPagination,
      VImportTemplate
    },
    data() {
      return {
        //基础配置
        searchUser: {
          email: '',
          userName: '',
          gender: '',
          status: '',
        },
        actionOption: [
          {name: $i.setting.notActive, code: 0},
          {name: $i.setting.activated, code: 1},
          {name: $i.setting.disable, code: 2}
        ],
        editUserdialog: {
          show: false,
          type: 0, // 0、添加  1、编辑
          title: [$i.setting.addUser, $i.setting.editUser]
        },
        disabledSearch: false,
        userListLoading: false,
        formLabelWidth: '120px',
        loadingDepartment: false,
        loadingRole: false,
        loadingPrivilege: false,
        addUserLoading: false,
        inviteUserLoading: false,
        checkedRole: [],
        selectList: [],
        languageOption: [],
        genderOption: [],
        roleOption: [],
        departmentData: [],
        departmentUserTotal: 0,          //department总人数
        roleData: [],
        privilegeData: [
          {name: $i.setting.privilegePage, children: [], code: 'pageAll'},
          {name: $i.setting.privilegeData, children: [], code: 'dataAll'}
        ],
        roleUserTotal: 0,                //role总人数
        searchDepartment: '',            //搜索的部门名称
        searchRole: '',                  //搜索的role名称
        searchPrivilege: '',                //搜索的priv的名称
        selectRole: null,
        userData: {
          email: '',
          userName: '',
          gender: null,
          status: null,
          ps: 50,
          pn: 1,
          deptId: null,
          roleIds: null
        },
        tableDataList: [],
        addUser: {
          email: '',
          deptId: 0,
          roleId: 0,
          userName: '',
          lang: '',
          tel: '',
          gender: '2',
          birthday: '',
          remark: ''
        },
        userListPage: {},
      }
    },
    created() {
      this.getPart();
      // this.getUnit();
    },
    mounted() {
      this.setMenuLink({
        type: 100,
        query: {code: 'DEPARTMENT_SETTING', bizCode: 'BIZ_USER'},
        label: this.$i.common.log
      });
      this.getDepartmentData();
    },
    watch: {
      searchDepartment(val) {
        this.$refs.departmentTree.filter(val);
      },
      searchRole(val) {
        this.$refs.roleTree.filter(val);
      },
      searchPrivilege(val) {
        this.$refs.privilegeTree.filter(val);
      },
      selectRole(val) {
        if (!val) {
          this.privilegeData = this.$options.data().privilegeData;
        }
        this.getPrivilege();
      }
    },
    methods: {
      ...mapActions(['setMenuLink']),
      pageSizeChange(val) {
        this.userListPage.ps = val;
        this.getDepartmentUser();
      },
      pageChange(val) {
        this.userListPage.pn = val;
        this.getDepartmentUser();
      },
      getDepartmentData(type) {
        this.loadingDepartment = true;
        this.userListLoading = true;
        this.departmentUserTotal = 0;
        return this.$ajax.get(this.$apis.get_departmentOverview).then(res => {
          this.departmentData = res;
          this.departmentData.forEach(v => {
            this.departmentUserTotal += v.deptUserCount;
          });

          if (type) {
            let roles = _.findWhere(res, {deptId: this.userData.deptId});
            roles && this.departmentClick(roles);
          }
          return res;
        }).finally(err => {
          this.loadingDepartment = false;
          this.userListLoading = false;
        });
      },
      getDepartmentUser() {
        let checkedNode = this.$refs.roleTree.getCheckedNodes(true)
          , roleIds = _.compact(_.pluck(checkedNode, 'roleId'))
          , params = _.clone(this.userListPage);

        this.tableDataList = [];

        if (_.isEmpty(roleIds)) {
          return false;
        }

        params.roleIds = roleIds;

        params = _.extend(params, this.searchUser)

        this.$ajax.post(this.$apis.get_departmentUser, params).then(res => {
          let {end, pn, ps, tc, start} = res;
          this.userListPage = {end, pn, ps, tc, start};
          this.tableDataList = this.$getDB(this.$db.setting.department, res.datas, item => {
            let gender, status, lang;
            if (item.status.value !== 0) {
              item._disabledCheckbox = true;
            }
            item.birthday.value = this.$dateFormat(item.birthday.value, 'yyyy-mm-dd');
            item.gender.value = item.gender.value.toString();
            gender = _.findWhere(this.genderOption, {code: item.gender.value}) || {};
            status = _.findWhere(this.actionOption, {code: item.status.value}) || {};
            lang = _.findWhere(this.languageOption, {code: item.lang.value}) || {};
            item.gender._value = gender.name || '';
            item.status._value = status.name || '';
            item.lang._value = lang.name || '';
            return item;
          });
        });
      },
      setButton(item) {
        let btns = [{label: 'Edit', type: 1}];
        if (item.status.value === 1) {
          btns.push({label: 'Disabled', type: 2});
        } else if (item.status.value === 2) {
          btns.push({label: 'Enable', type: 3});
        }
        return btns;
      },
      changeUserDep(val) {
        let deps = _.findWhere(this.departmentData, {deptId: val});
        this.roleOption = _.isEmpty(deps) ? [] : deps.deptRoles;
        this.addUser.roleId = '';
      },
      departmentClick(data, checked) {
        this.userData = this.$options.data().userData;
        this.userData.deptId = data.deptId;
        this.roleData = this.$depthClone(data.deptRoles || []);
        this.searchRole = '';
        this.selectRole = null;
        this.$nextTick(() => {
          this.$refs.roleTree.setCheckedNodes(checked || this.roleData);
          this.roleCheckClick();
        });
      },
      roleNodeClick(data) {
        this.selectRole = data.roleId;
      },
      roleCheckClick() {
        this.checkedRole = _.compact(this.$refs.roleTree.getCheckedKeys(true));
        // 更新部门信息
        this.getDepartmentUser();
        // 显示权限列表
        // this.getPrivilege();
      },
      addDepartment(item) {
        this.$prompt(this.$i.setting.pleaseInputDepartment,
          this.$i.setting[item ? 'prompt' : 'addDepartment'],
          {
            closeOnClickModal: false,
            confirmButtonText: this.$i.setting.sure,
            cancelButtonText: this.$i.setting.cancel,
            inputValue: ' ' + (item ? item.deptName : ''),
            closeOnHashChange: false,
            inputValidator: (value) => {
              let depItem;
              if (!value || value === '') {
                return this.$i.setting.pleaseInput;
              }

              depItem = _.findWhere(this.departmentData, {deptName: value.trim()});

              if (depItem && (!item || depItem.deptId !== item.deptId)) {
                return this.$i.setting.canNotRepeatDepartmentName;
              }
            },
            callback: (action, vm) => {
              if (action !== 'confirm') {
                return false;
              }

              let params = {deptName: vm.inputValue.trim()}, http;
              this.loadingDepartment = true;

              if (item) {
                params.deptId = item.deptId;
              }

              http = () => item ? this.$ajax.put : this.$ajax.post;

              http()(this.$apis.get_department, params).then(res => {
                this.$message.success(this.$i.setting.successfulOperation);
                this.getDepartmentData();
              }).finally(() => this.loadingDepartment = false);
            }
          });
      },
      addRole(item) {
        this.$prompt(this.$i.setting.pleaseInputRole,
          this.$i.setting[item ? 'prompt' : 'addRole'],
          {
            closeOnClickModal: false,
            confirmButtonText: this.$i.setting.sure,
            cancelButtonText: this.$i.setting.cancel,
            inputValue: ' ' + (item ? item.roleName : ''),
            inputValidator: (value) => {
              let roleItem;
              if (!value || value === '') {
                return this.$i.setting.pleaseInput;
              }

              roleItem = _.findWhere(this.roleData, {roleName: value.trim()});

              if (roleItem && (!item || roleItem.roleId !== item.roleId)) {
                return this.$i.setting.roleExisted;
              }
            },
            callback: (action, vm) => {
              if (action !== 'confirm') {
                return false;
              }

              let params = {roleName: vm.inputValue.trim()}, http;
              this.loadingRole = true;

              http = () => item ? this.$ajax.put : this.$ajax.post;

              if (item) {
                params.roleId = item.roleId;
              } else {
                params.deptId = this.userData.deptId;
              }

              http()(this.$apis.add_departmentRole, params).then(res => {
                this.$message.success(this.$i.setting.successfulOperation);
                this.getDepartmentData(true);
              }).finally(() => this.loadingRole = false);
            }

          });
      },
      filterDepartment(value, data) {
        if (!value) return true;
        return data.deptName.indexOf(value) !== -1;
      },
      filterRole(value, data) {
        if (!value) return true;
        return data.roleName.indexOf(value) !== -1;
      },
      filterPrivilege(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      deleteDepartment(e) {
        this.$confirm(this.$i.setting.sureDelete, this.$i.setting.prompt, {
          confirmButtonText: this.$i.setting.sure,
          cancelButtonText: this.$i.setting.cancel,
          type: 'warning'
        }).then(() => {
          this.$ajax.get(this.$apis.get_departmentRole, {
            deptId: e.deptId
          }).then(res => {
            if (res && res.length > 0) {
              this.$message({
                message: this.$i.setting.pleaseRemoveRoleUser,
                type: 'warning'
              });
            } else {
              this.loadingDepartment = true;
              this.$ajax.delete(this.$apis.delete_department, {
                deptId: e.deptId
              }).then(res => {
                this.getDepartmentData();
              });
            }
          }).finally(err => {

          });

        });
      },
      deleteRole(e, node) {
        this.$confirm(this.$i.setting.sureDelete, this.$i.setting.prompt, {
          confirmButtonText: this.$i.setting.sure,
          cancelButtonText: this.$i.setting.cancel,
          type: 'warning'
        }).then(() => {
          this.loadingRole = true;
          this.$ajax.delete(this.$apis.delete_departmentRole, {
            deptId: this.userData.deptId,
            roleId: e.roleId
          }).then(res => {
            this.$message({
              type: 'success',
              message: this.$i.setting.deleteSuccess
            });
            this.getDepartmentData(true);
          }).finally(() => {
            this.loadingRole = false;
          });
        });
      },
      btnClick(item, type) {
        if (type === 1) {
          this.roleOption = this.$copyArr(this.roleData);
          this.addUser = _.mapObject(item, val => val.value);
          this.editUserdialog.type = 1;
          this.editUserdialog.show = true;
        } else {
          this.disabledUser(item.userId.value, type === 2);
        }
      },
      addUsers() {
        //设置基本信息
        this.roleOption = this.$copyArr(this.roleData);

        this.addUser = this.$options.data().addUser;

        let roleId = this.$refs.roleTree.getCheckedKeys();

        roleId = roleId[0] || roleId[1];

        this.addUser.deptId = this.userData.deptId;
        this.addUser.roleId = roleId;
        this.editUserdialog.type = 0;
        this.editUserdialog.show = true;
      },
      sureAddUser() {
        let params = this.$depthClone(this.addUser);
        if (this.$validateForm(params, this.$db.setting.addUser)) {
          return false;
        }
        this.addUserLoading = true;

        if (this.editUserdialog.type === 1) {
          params.id = params.userId;
          delete params.userId;
        }

        // params.birthday = this.$dateFormat(params.birthday, 'yyyy-mm-dd');

        this.$ajax.post(this.$apis.add_departmentUser, params)
          .then(res => {
            !params.id && this.getDepartmentData().then(depRes => {
              let roles = _.findWhere(depRes, {deptId: this.userData.deptId})
                , userData = this.$depthClone(this.userData);

              userData.deptRoles = roles ? roles.deptRoles : [];
              this.departmentClick(userData, this.$refs.roleTree.getCheckedNodes(true));
              this.getPrivilege();
            });
            this.getDepartmentUser();
            this.editUserdialog.show = false;
            this.addUser = this.$options.data().addUser;
            this.$message.success(this.$i.setting.successfulOperation);
          }).finally(err => this.addUserLoading = false);
      },
      disabledUser(userId, type = true) {
        this.$confirm(type ? this.$i.setting.disabledUser : this.$i.setting.enabledUser, this.$i.hintMessage.systemHints, {
          confirmButtonText: this.$i.button.confirm,
          cancelButtonText: this.$i.button.ccancel,
          type: 'warning'
        }).then(() => {
          this.$ajax.put(type ? this.$apis.USER_DISABLE : this.$apis.USER_ENABLE, {userId})
            .then(res => {
              this.getDepartmentData(true);
              this.$message.success(this.$i.setting.successfulOperation);
            });
        });

      },
      inviteUser() {
        let emails = [];

        this.inviteUserLoading = true;
        _.map(this.selectList, v => emails.push(v.email.value));

        this.$ajax.post(this.$apis.invite_departmentUser,
          {
            emails,
            callback: `${config.ENV.LOGIN_URL}/#/activation?activeToken=%s&email=%s&redirect=${Base64.encode(window.location.origin + '/#/login')}`
          })
          .then(res => this.$message.success(this.$i.setting.invitationSuccess))
          .finally(() => this.inviteUserLoading = false);
      },
      /*getUnit() {
        return this.$ajax.post(this.$apis.get_partUnit, ['LANGUAGE'], {cache: true})
          .then(res => this.languageOption = res[0].codes);
      },*/
      savePrivilege() {
        let nodes = [], dataNodes
          , params = {resourceCodes: [], domainCodes: []};

        nodes = this.$refs.privilegeTree.getHalfCheckedNodes().concat(this.$refs.privilegeTree.getCheckedNodes());
        dataNodes = this.$refs.privilegeTree.getNode('dataAll');
        this.loadingPrivilege = true;

        _.map(nodes, val => !_.isUndefined(val.type) && params.resourceCodes.push(val.code))

        _.map(dataNodes.childNodes, value => {
          let checked = _.where(value.childNodes, {checked: true})
            , userIds = [];

          if (!_.isEmpty(checked)) {
            userIds = _.map(checked, val => val.data.userId);
            params.domainCodes.push({bizDomainCode: value.data.code, userIds});
          }
        });

        params.deptId = this.userData.deptId;
        params.roleId = this.selectRole;

        this.$ajax.post(this.$apis.ROLE_PRIVILEGE, {datas: [params]})
          .then(res => {
            this.$message.success(this.$i.setting.privilegeSetSuccess);
            this.getPrivilege();
          })
          .finally(() => this.loadingPrivilege = false);
      },
      getPrivilege() {
        this.userData.deptId && this.selectRole &&
        this.$ajax.post(this.$apis.PRIVILEGE_PRIVILEGE_SELECT, {
          deptId: this.userData.deptId,
          roleId: this.selectRole
        }).then(res => {
          this.$ajax.all([
            this.getPrivilegeResource(),
            this.getPrivilegeData()
          ]).then(() => {
            let checked = []
              , resourceCodeStr;
            res.selectedResourceCodes = res.selectedResourceCodes || [];

            resourceCodeStr = res.selectedResourceCodes.join(',');

            !_.isEmpty(res.selectedDomainUserIds)
            && _.mapObject(res.selectedDomainUserIds, (val, key) => _.map(val, v => checked.push(`${key}_${v}`)));

            !_.isEmpty(res.selectedResourceCodes)
            && _.map(res.selectedResourceCodes, val => resourceCodeStr.indexOf(`${val}:`) === -1 && checked.push(val));

            this.$refs.privilegeTree.setCheckedKeys(checked);
          });
        });
      },
      getPrivilegeResource(data) {
        return this.$ajax.get(this.$apis.PRIVILEGE_RESOURCE, {}, {cache: true})
          .then(res => this.privilegeData[0].children = res);
      },
      getPrivilegeData(data) {
        return this.$ajax.all([
          this.$ajax.get(this.$apis.PRIVILEGE_DATA_BIZDOMAIN, {}, {cache: true}),
          this.$ajax.get(this.$apis.get_departmentUser, {}, {cache: true})
        ]).then(res => {
          let list = [];

          list = _.map(res[0], val => {
            let users = _.map(res[1], ({userName, userId}) => ({
              name: userName,
              code: `${val.bizDomainCode}_${userId}`,
              userId
            }));
            return {name: val.bizDomainName, code: val.bizDomainCode, children: users};
          });

          this.privilegeData[1].children = list;
        });
      },
      departmentDrop() {
        let sorts = []
          , data = this.$depthClone(this.departmentData);

        _.map(data.reverse(), (val, index) => sorts.push({deptId: val.deptId, sort: index + 1}));

        this.$ajax.post(this.$apis.DEPARTMENT_UPDATESORT, {sorts});
      },
      roleDrop(node) {
        let checked = this.$refs.roleTree.getCheckedNodes(true)
          , sorts = []
          , data = this.$depthClone(this.roleData);

        if (node.checked) {
          checked.push(node.data);
          this.$refs.roleTree.setCheckedNodes(checked);
        }

        _.map(data.reverse(), (val, index) => sorts.push({roleId: val.roleId, sort: index + 1}));


        this.$ajax.post(this.$apis.ROLE_UPDATESORT, {deptId: this.userData.deptId, sorts});
      },
      getPart() {
        this.$ajax.post(this.$apis.CODE_PART, ['SEX', 'LANGUAGE'], {cache: true}).then(res => {
          this.genderOption = (_.findWhere(res, {code: 'SEX'}) || {}).codes;
          this.languageOption = (_.findWhere(res, {code: 'LANGUAGE'}) || {}).codes;
        });
      }
    },
  }
</script>

<style scoped>
  .title {
    font-weight: bold;
    font-size: 18px;
    height: 32px;
    line-height: 32px;
    color: #666666;
  }

  .body {
    margin-top: 5px;
  }

  .body .card {
    height: 430px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    /*box-shadow: 0 0 30px #e0e0e0;*/
  }

  .body .card .title {
    font-weight: normal;
    font-size: 14px;
    padding: 5px 10px;
    border-bottom: 1px solid #f3f3f3;
  }

  .body .card .handler {
    padding: 10px;
    border-bottom: 1px solid #f3f3f3;
  }

  .body .card .handler .speInput {
    width: auto;
    float: right;
  }

  .body .card .list {
    height: 320px;
    overflow-y: scroll;
  }

  .body .card .list .list-title {
    font-weight: bold;
    height: 30px;
    line-height: 30px;
    padding-left: 15px;
    font-size: 18px;
  }

  .body .card .list .list-title span {
    font-weight: normal;
    font-size: 14px;
    margin-left: 10px;
  }

  /*tree样式调整*/
  .departmentTree /deep/ .el-tree-node__expand-icon {
    display: none;
  }

  .departmentTree /deep/ .custom-tree-node {
    padding-left: 20px;
  }

  .speTree /deep/ .isAction,
  .departmentTree /deep/ .isAction {
    color: #037dfb;
  }

  /deep/ .custom-tree-node {
    width: 100%;
    position: relative;
  }

  /deep/ .custom-tree-node span {
    font-size: 14px;
  }

  /deep/ .custom-tree-node .action {
    position: absolute;
    right: 0;
    top: 0;
  }

  /deep/ .el-tree-node__content {
    line-height: 30px;
    height: 30px;
  }

  .footer {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .footer .content {
    margin-top: 10px;
  }

  .footer .btn {
    text-align: center;
  }

  .footer .btn button {
    padding: 9px 25px !important;
  }

  .footer .btns {
    margin-top: 5px;
  }

  .speInput {
    width: 80%;
  }

  .name-title {
    cursor: move;
  }
</style>
