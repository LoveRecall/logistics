<template>
  <div class="category-common">
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <el-button type="primary" @click="()=>$refs.importCategory.show()">{{$i.button.upload}}</el-button>
    <span style="display:none;" v-text="upDataPage"></span>
    <div class="hd">{{ $i.common.categorycommonTitle }}</div>
    <div class="category-wrap">
      <div class="maping-relation">
        <h5>{{ $i.common.mappingRelation }}</h5>
        <div class="category">
          <div class="hd input-hd">
                        <span class="text">
                            <b>{{ $i.common.myCategory }}</b>({{ $i.common.generalCategory }})({{ $i.common.tags }})&nbsp;
                        </span>
            <el-input :placeholder="$i.common.inputkeyWordToSearch" v-model="mapingCategoryKeyWord"
                      suffix-icon="el-icon-search"/>
          </div>
          <el-tree
            class="filter-tree"
            :data="mappingRelationData"
            :props="treeProps"
            :filter-node-method="filterNode"
            ref="tree2"
            default-expand-all
            v-show="mappingRelationData.length >= 1"></el-tree>
          <div v-show="mappingRelationData.length <= 0" class="mappingRelation">{{ $i.common.mappingNoData }}</div>
        </div>
      </div>
      <div class="my-category">
        <h5>{{ $i.common.myCategory }}</h5>
        <div class="category">
          <div class="input-hd">
            <el-button size="mini" @click="add(myCategoryData, 'parents')">{{ $i.common.add }}</el-button>
            <el-input :placeholder="$i.common.inputkeyWordToSearch" v-model="myCategoryKeyWord"
                      suffix-icon="el-icon-search"/>
          </div>
          <!--
            draggable
            :allow-drop="allowDrop"
            @node-drop="categoryDrop"
          -->
          <el-tree
            class="filter-tree"
            :data="myCategoryData"
            :props="defaultProps"
            highlight-current
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            @node-click="myCategoryChange"
            ref="tree">
            <div slot-scope="{ node, data }" style="width: 100%">
              <div class="custom-tree-node" style="width: 100%">
                <span v-text="node.label"></span>
                <div class="icon-wrap">
                  <i class="el-icon-edit" @click="edit(data)"></i>
                  <i class="el-icon-remove-outline" @click="remove(node, data)"></i>
                  <i class="el-icon-circle-plus-outline" v-if="node.level === 1" @click="add(data)"></i>
                </div>
              </div>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="mapping">
        <span>{{ $i.common.mapping }}</span><i></i>
      </div>
      <div class="general-category">
        <h5>{{ $i.common.generalCategory }}</h5>
        <div class="category">
          <div class="input-hd">
            <el-input :placeholder="$i.common.inputkeyWordToSearch" v-model="generalCategoryKeyWord"
                      suffix-icon="el-icon-search"/>
          </div>
          <el-tree
            :data="mgeneralCategoryData"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="generalTree"
            highlight-current
            :filter-node-method="filterNode"
            :props="defaultProps"
            @check-change="generalCategoryChange"></el-tree>
          <div class="btn-wrap">
            <el-button type="primary" @click="save" :disabled="!myCategory">{{ $i.common.save }}</el-button>
          </div>
        </div>
      </div>
    </div>

    <v-import-template ref="importCategory" code="BIZ_SKU_CATEGORY_IMPORT"
                       biz-code="BIZ_SKU_CATEGORY"></v-import-template>
  </div>
</template>
<script>
  import {mapActions} from 'vuex'
  import {VImportTemplate} from '@/components/index'

  export default {
    name: 'Categorycommon',
    components: {
      VImportTemplate
    },
    data() {
      return {
        upDataPage: 0,
        selectedNodes: [],
        myCategoryKeyWord: '',
        generalCategoryKeyWord: '',
        mapingCategoryKeyWord: '',
        myCategoryData: [],
        myCategory: '',
        mgeneralCategoryData: [],
        mappingRelationData: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          id: 'id'
        },
        treeProps: {
          children: 'categorys',
          label: 'name',
          id: 'id'
        }
      }
    },
    created() {
      this.getMgeneralCategoryData();
      this.getMyCategoryData();
      this.getMappingCategory();
      this.setMenuLink({
        type: 100,
        query: {code: 'CATEGORY', bizCode: 'BIZ_SUPPLY_CATEGORY'},
        label: this.$i.common.log
      });
    },
    methods: {
      ...mapActions(['setMenuLink']),
      allowDrop(b, a, t) {
        if (t === 'prev' && !a.childNodes.length && b.data.parentId === a.data.parentId) {
          return true;
        }

      },
      categoryDrop(node) {
        let sorts = []
          , data = this.$depthClone(this.myCategoryData);

        if (node.data.parentId) {
          data = _.map(this.$refs.tree.getNode(node.data.parentId).childNodes, val => val.data);
        }

        _.map(data, (val, index) => sorts.push({id: val.id, sort: index + 1}));

        this.$ajax.post(this.$apis.PURCHASE_CATEGORY_SORT, {parentId: node.data.parentId, sorts})
          .then(res => {
            this.getMyCategoryData();
            this.getMappingCategory();
          });
      },
      getMgeneralCategoryData() {
        this.$ajax.get(this.$apis.GET_PURCHASE_SYS_CATEGORY)
          .then(res => {
            this.mgeneralCategoryData = res;
          });
      },
      getMyCategoryData() {
        this.$ajax.get(this.$apis.GET_PURCHASE_CATEGORY)
          .then(res => {
            this.myCategoryData = res;
          })
      },
      getMappingCategory() {
        this.$ajax.get(this.$apis.GET_PURCHASE_MAPPING_CATEGORY)
          .then(res => {
            this.mappingRelationData = res;
            this.mappingRelationDataSplit(this.mappingRelationData);
          })
      },
      mappingRelationDataSplit(list) {
        list.forEach((item, index) => {
          if (item.builder) item.name = `${item.name}(${item.builder})`;
          if (item[this.treeProps.children].length && item[this.treeProps.children]) this.mappingRelationDataSplit(item[this.treeProps.children])
        });
      },
      addNewCategory(data, name, type) {
        const params = {
          parentId: data.id || 0,
          name: name
        };
        this.$ajax.post(this.$apis.GET_PURCHASE_CATEGORY, params)
          .then(res => {
            this.getMyCategoryData();
            this.getMappingCategory();
            this.myCategory = '';
          });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data[this.defaultProps.label].indexOf(value) !== -1;
      },
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        const id = children[index].id;

        if (data.children && data.children.length) {
          return this.$message.warning(this.$i.setting.categoryDeleteParent);
        }

        this.$confirm(this.$i.setting.categoryDelete,
          this.$i.hintMessage.systemHints,
          {
            confirmButtonText: this.$i.common.ok,
            cancelButtonText: this.$i.common.cancel,
            type: 'warning'
          })
          .then(() => {
            this.$ajax.get(`${this.$apis.POST_PURCHASE_CATEGORY_DELETE}/{id}`, {
              id: id
            }).then(res => {
              this.getMappingCategory();
              children.splice(index, 1);
              this.$message({
                type: 'success',
                message: this.$i.common.deleteSuccess
              });
            });
          });
      },
      add(data, type) {
        this.$prompt(this.$i.common.addClassification, this.$i.common.prompt, {
          confirmButtonText: this.$i.common.confirm,
          cancelButtonText: this.$i.common.cancel
        }).then(({value}) => {
          if (!value) return this.$message({
            message: this.$i.common.theClassificationNameCanNotBeEmpty,
            type: 'warning'
          });
          if (type === 'parents') return this.addNewCategory(data, value, type);
          if (data.children && data.children.length) {
            this.addNewCategory(data, value, type);
          } else {
            this.$ajax.get(this.$apis.GET_PURCHASE_ADD_APPING_CATEGORY, {
              id: data.id
            })
              .then(res => {
                if (!res) return this.addNewCategory(data, value, type);
                this.$confirm(this.$i.common.addEmptying, this.$i.common.prompt, {
                  confirmButtonText: this.$i.common.confirm,
                  cancelButtonText: this.$i.common.cancel,
                  type: 'warning'
                }).then(() => {
                  this.addNewCategory(data, value, type)
                }).catch(() => {
                  return false;
                })
              });
          }
          ;
        });
      },
      edit(data) {
        this.$prompt(this.$i.common.pleaseEdit, this.$i.common.prompt, {
          confirmButtonText: this.$i.common.confirm,
          cancelButtonText: this.$i.common.cancel,
          inputValue: data.name
        }).then(({value}) => {
          if (!value) {
            return this.$message.warning(this.$i.common.canTBeEmptys);
          }
          if (data.name === value) {
            return false;
          }
          this.$ajax.post(`${this.$apis.POST_PURCHASE_UPDATE_CATEGORY}/?name=${value}`, {
            id: data.id
          })
            .then(res => {
              data.name = value;
              this.getMappingCategory();
              // this.mappingRelationDataForEach(this.mappingRelationData, data.id, 'edit', value);
            });
        }).catch(() => {

        });
      },
      myCategoryChange(val) {
        if (val.children && val.children.length) {
          this.$refs.generalTree.setCheckedKeys([]);
          return this.myCategory = '';
        }
        this.myCategory = val.id;
        this.$ajax.get(this.$apis.GET_PURCHASE_CHANGE_MAPPING_CATEGORY, {
          id: val.id
        }).then(res => {
          this.$refs.generalTree.setCheckedKeys(res ? res.split(',') : []);
        });
      },
      save() {
        let nodes = [];
        this.selectedNodes.forEach(item => {
          nodes.push(item.id)
        });
        const params = {
          categoryId: this.myCategory,
          sysId: nodes.toString()
        };
        this.$ajax.post(this.$apis.POST_PURCHASE_SAVE_MAPPING_CATEGORY, params)
          .then(res => {
            this.$message.success(this.$i.hintMessage.operationSuccessful);
            this.mappingRelationData = res;
            this.mappingRelationDataSplit(this.mappingRelationData);
          });
      },
      generalCategoryChange(data) {
        this.selectedNodes = this.$refs.generalTree.getCheckedNodes(true);
      }
    },
    watch: {
      myCategoryKeyWord(val) {
        this.$refs.tree.filter(val);
      },
      generalCategoryKeyWord(val) {
        this.$refs.generalTree.filter(val);
      },
      mapingCategoryKeyWord(val) {
        this.$refs.tree2.filter(val);
      }
    },
  }
</script>
<style scoped>
  /deep/ .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  /deep/ .custom-tree-node .el-icon-edit {
    display: inline-block;
  }

  /deep/ .custom-tree-node .el-icon-edit,
  /deep/ .custom-tree-node .el-icon-circle-plus-outline,
  /deep/ .custom-tree-node .el-icon-remove-outline {
    display: none;
    margin-right: 5px;
  }

  /deep/ .custom-tree-node .icon-wrap {
    width: 100px;
    text-align: right;
  }

  /deep/ .custom-tree-node:hover .el-icon-edit,
  /deep/ .custom-tree-node:hover .el-icon-circle-plus-outline,
  /deep/ .custom-tree-node:hover .el-icon-remove-outline {
    display: inline-block;
  }

  /deep/ .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
</style>
<style scoped>
  .category-common .hd {
    font-weight: 700;
    font-size: 16px
  }

  .category-common .mappingRelation {
    font-size: 16px;
    color: #666;
    text-align: center;
    line-height: 50px
  }

  .category-common .category-wrap {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 20px;
    overflow-x: auto
  }

  .category-common .category-wrap .mapping {
    width: 50px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    background: #fff;
    color: #000;
    position: relative;
    margin-top: 245px;
    margin-right: 30px
  }

  .category-common .category-wrap .mapping:after {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    background: #d7d7d7
  }

  .category-common .category-wrap .mapping:before {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: #d7d7d7
  }

  .category-common .category-wrap .mapping i {
    z-index: 0;
    height: 100%;
    width: 20px;
    position: absolute;
    right: 0;
    top: 0
  }

  .category-common .category-wrap .mapping i:after {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 1px;
    background: #d7d7d7;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg)
  }

  .category-common .category-wrap .mapping i:before {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 1px;
    background: #d7d7d7;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg)
  }

  .category-common .category-wrap .mapping span {
    position: absolute;
    left: 10px;
    line-height: 30px;
    z-index: 1
  }

  .category-common .category-wrap h5 {
    font-weight: 400;
    font-size: 20px;
    color: #666;
    padding: 15px;
    border-bottom: 1px solid #e0e0e0
  }

  .category-common .category-wrap .general-category,
  .category-common .category-wrap .my-category {
    width: 30vw
  }

  .category-common .category-wrap .general-category,
  .category-common .category-wrap .maping-relation,
  .category-common .category-wrap .my-category {
    margin-right: 15px;
    min-width: 260px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 5px
  }

  .category-common .category-wrap .general-category .btn-wrap,
  .category-common .category-wrap .maping-relation .btn-wrap,
  .category-common .category-wrap .my-category .btn-wrap {
    padding: 10px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center
  }

  .category-common .category-wrap .general-category .category .input-hd,
  .category-common .category-wrap .maping-relation .category .input-hd,
  .category-common .category-wrap .my-category .category .input-hd {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 32px;
    padding: 10px 15px;
    border-bottom: 1px solid #e0e0e0
  }

  .category-common .category-wrap .general-category .category .el-tree,
  .category-common .category-wrap .maping-relation .category .el-tree,
  .category-common .category-wrap .my-category .category .el-tree {
    overflow: auto;
    height: 50vh
  }

  .category-common .category-wrap .maping-relation {
    width: 40vw
  }

  .category-common .category-wrap .maping-relation .hd .text,
  .category-common .category-wrap .maping-relation .hd {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between
  }

  .category-common .category-wrap .maping-relation .hd .text {
    color: #666;
    font-size: 12px;
    white-space: nowrap
  }

  .category-common .category-wrap .maping-relation .hd .text b {
    font-size: 12px;
    white-space: nowrap;
    color: #ccc
  }
</style>
