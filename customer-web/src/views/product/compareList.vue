<template>
    <div class="compare-zone" :class="{isTransparent:change}">
        <div class="compare-main" :class="{show:change}">
            <div class="btnGroup">
                <el-button :disabled="disabledBtn" @click="startCompare" class="btn" type="primary" size="mini">{{$i.product.goCompare}} ({{data.length}})</el-button>
                <el-button @click="clearData" class="clearBtn" type="danger" size="mini">{{$i.product.clearData}}</el-button>
            </div>
            <div class="compare-list" style="float: left;">
                <div class="treeList">
                    <el-tag
                            class="tag"
                            v-for="tag in data"
                            :key="tag.ids"
                            closable
                            :type="tag.type"
                            @close="handleClose(tag)">
                        {{tag.name}}
                    </el-tag>
                    <span style="display: inline-block;width: 40px"></span>
                </div>
            </div>
        </div>

        <!--<div class="speIcon" :class="{speDiv:change}">-->
            <i @click="hideList" class="el-icon-d-arrow-right" :class="{iconShow:change,iconHide:!change}"></i>
        <!--</div>-->
    </div>

</template>

<script>


    /** CompareList
     *  author LiuSx
     *  Time 2018-03-26
     *  @param { config }  -组件配置
     *
     *
     *  @param { tags }  -对比列表的内容
     *
     * */


    export default {
        name: "compare-list",
        props:{
            data:{
                type:Array,
                default:[]
            }
        },
        data(){
            return{
                show:true,
                tags: [
                    {name:'1',id:1}
                ],
                change:false,
                disabledBtn:true,              //是否能点击compare按钮
            }
        },
        methods:{
            hideList(){
                // this.config.showCompareList=false;
                this.change=!this.change;
            },

            //前往比较页面开始比较
            startCompare(){
                this.$emit('goCompare');
            },

            //删除所选中的项
            handleClose(tag){
                this.$emit('closeTag',tag);
            },

            //清空选项
            clearData(){
                this.$emit('clearData');
            },
        },
        created(){
            if(this.data.length>=2){
                this.disabledBtn=false;
            }else{
                this.disabledBtn=true;
            }
        },
        watch:{
            data(n){
                if(n.length>=2){
                    this.disabledBtn=false;
                }else{
                    this.disabledBtn=true;
                }
            }
        }
    }
</script>

<style scoped>
    .compare-zone{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 2000;
        height: 50px;
        line-height: 40px;
        transition: all linear .3s;
        background: rgba(0, 0, 0, 0.6);
    }
    .compare-main{
        transition: all linear .3s;
    }
    .compare-main .btnGroup{
        float:left;width: 16%;
        padding-left: 10px;
        box-sizing: border-box
    }
    .isTransparent{
        background: transparent !important;
        transform: translateX(100%);
        /*left:0;*/
    }
    .compare-list{
        width: 84%;
        position: relative;
        overflow: auto;
        /*margin-left: 40px;*/
        transition: all linear .3s;
    }
    .show{
        transform: translateX(110%);
        transition: all linear .3s;
        /*background: red;*/
    }
    .speIcon{
        position: absolute;
        height: 40px;
        width: 40px;
        bottom: 10px;
        right: 0;
        background-color: #666666;
        text-align: center;
        transition: all linear .3s;
    }
    .speDiv{
        background-color: transparent;
        transition: all linear .3s;
    }
    i{
        position: absolute;
        color: #ffffff;
        font-size: 20px;
        top:10px;
        transition: all linear .3s;
        cursor: pointer;
        z-index: 2000;
    }
    .iconHide{
        right: 20px;
    }
    .iconShow{
        transform: rotate(180deg);
        transition: all linear .3s;
        color:#636363;
        left:-30px;
    }
    .compare-main .btn{
        float: left;
        margin-top: 6px;
        margin-right: 20px;
    }
    .compare-main .clearBtn{
        float: left;
        margin-top: 8px;
        margin-right: 20px;
        padding: 5px 10px;
    }
    .compare-list .treeList{
        white-space:nowrap;
    }
    .compare-list .el-tag{
        background-color: #ffffff;
        color: #666666;
        border:1px solid #f4f4f4;
        margin-left: 10px;
        z-index:200;
    }
    /*.compare-list .treeList{*/

    /*}*/


    /*滚动条样式设置*/
    .compare-zone ::-webkit-scrollbar {
        width: 14px;
        height: 8px;
        padding: 0;
        background-color: transparent;
    }
    .compare-zone ::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: rgba(255, 255, 255, 1)
    }
</style>