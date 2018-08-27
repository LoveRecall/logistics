<template>
    <div>
        <div>
            <el-button @click="createRemark" type="primary" plain size="mini">{{$i.product.add}}</el-button>
        </div>
        <br>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    prop="remark"
                    :label="$i.product.remark"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="updateName"
                    :label="$i.product.operator"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="updateDt"
                    :label="$i.product.time"
                    align="center">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    :label="$i.product.action"
                    align="center">
                <template slot-scope="scope">
                    <el-button @click="editRemark(scope.$index, scope.row)" type="text" size="small">{{$i.product.modify}}</el-button>
                    <el-button @click="deleteRemark(scope.$index, scope.row)" type="text" size="small">{{$i.product.delete}}</el-button>
                </template>
</el-table-column>
</el-table>
<br>
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage1" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
</el-pagination>

<el-dialog title="新增备注" :visible.sync="addRemarkFormVisible" center width="500px">
    <el-form :model="parms">
        <el-form-item label="备注:" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="parms.remark">
            </el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createRemarkSubmit">提交</el-button>
        <el-button @click="addRemarkFormVisible = false">取 消</el-button>
    </div>
</el-dialog>

<!--<el-dialog title="备注查看" :visible.sync="checkRemarkFormVisible" center width="500px">-->
<!--<el-form :model="form">-->

<!--<el-form-item label="备注:" :label-width="formLabelWidth">-->
<!--{{form.name}}-->
<!--Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur, consectetur debitis deleniti ea, eligendi est magnam numquam perferendis quidem suscipit, veniam voluptatem voluptatibus! Assumenda, corporis impedit in iste minus neque.-->
<!--</el-form-item>-->

<!--</el-form>-->
<!--<div slot="footer" class="dialog-footer">-->
<!--<el-button @click="checkRemarkFormVisible = false">关 闭</el-button>-->
<!--</div>-->
<!--</el-dialog>-->

<el-dialog title="修改备注" :visible.sync="editRemarkFormVisible" center width="500px">
    <el-form :model="parms">
        <el-form-item label="备注:" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="parms.remark">
            </el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit_submit">提交</el-button>
        <el-button @click="editRemarkFormVisible = false">取 消</el-button>
    </div>
</el-dialog>


</div>
</template>

<script>
    export default {
        name: "addline-table",
        props: {
            add_url: {
                type: String,
                default: 'post_addCustomerListRemark'
            },
            delete_url: {
                type: String,
                default: 'post_delete_CustomerRemark'
            },
            updata_url: {
                type: String,
                default: 'post_customerUpdataRmark'
            },
            get_url: {
                type: String,
                default: 'post_getCustomerListRemark'
            },

        },
        data() {
            return {
                value: '', //输入框内容
                currentPage1: 1, //当前页
                tableData: [], //表格数据
                parms: {
                    "id":'',
                    "remark": "",
                    "supplierCustomerId": this.$route.query.id,
                    "version": 0
                },
                getListParams:{
                    id: this.$route.query.id,
                    pn: 1,
                    ps: 50,
                },
                addRemarkFormVisible: false, //新增备注弹出框显示隐藏
                checkRemarkFormVisible: false, //查看备注弹出框显示隐藏
                editRemarkFormVisible: false, //编辑备注弹出框显示隐藏
                formLabelWidth: '50px', //弹出框input长度
                id: this.$route.query.id
            }
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },

            //新增备注
            createRemark() {
                this.addRemarkFormVisible = true;
            },
            createRemarkSubmit() {
                this.$ajax.post(this.$apis[this.add_url], this.parms).then((res) => {
                      this.get_remark()
                }).catch((res) => {
                    console.log(res)
                })
                this.addRemarkFormVisible = false
            },
            //查看备注
            checkRemark() {
                this.checkRemarkFormVisible = true;
            },

            //修改备注
            editRemark(index, row) {
               
                this.parms.id = row.id
                this.parms.version=row.version              
                this.parms.remark = ''
                this.editRemarkFormVisible = true;
            },
            edit_submit() {       
               
                this.$ajax.post(this.$apis[this.updata_url], this.parms).then((res) => {
                    this.get_remark()
                }).catch((res) => {
                    console.log(res)
                })
                this.editRemarkFormVisible = false;
            },
            //删除备注
            deleteRemark(index, row) {
                this.$confirm('确定删除该备注?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.post(this.$apis[this.delete_url], {
                        id: row.id
                    }).then((res) => {
                        this.get_remark()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch((res) => {
                        console.log(res)
                    })
                }).catch(() => {

                });
            },
            //获取remark数据列表
            get_remark() {
                this.$ajax.post(this.$apis[this.get_url], this.getListParams
                ).then((res) => {
                    
                    this.tableData = res.datas
                }).catch((res) => {
                    console.log(res)
                })
            },
            //.........增加remark
            add_Remark() {

            },
            //.........删除remark
            delete_Remark() {

            },
        },
        created() {
            this.get_remark()

        }
    }

</script>
<style>
    .el-dialog__wrapper .el-dialog__header {
        border-bottom: 1px solid #e9eaec;
    }

    .el-dialog__wrapper .el-dialog__body {
        padding: 16px;
    }

    .el-dialog__wrapper .el-form-item--small.el-form-item {
        margin-bottom: 0;
    }

    .el-dialog__wrapper .el-dialog__footer {
        padding: 12px 18px;
    }

    /*.el-message-box__wrapper .el-message-box--center{*/

    /*padding:0;*/

    /*}*/

    /*.el-message-box__wrapper .el-message-box__content{*/

    /*border-bottom: 1px solid #e9eaec;*/

    /*padding: 16px;*/

    /*}*/

    /*.el-message-box__wrapper .el-message-box__title span{*/

    /*font-size: 14px;*/

    /*}*/

    /*.el-message-box__wrapper .el-message-box__header{*/

    /*padding: 14px 16px;*/

    /*line-height: 1;*/

    /*border-bottom: 1px solid #e9eaec;*/

    /*}*/

    /*.el-message-box__wrapper .el-message-box__btns{*/

    /*padding: 12px 18px;*/

    /*}*/

</style>
<style scoped>


</style>