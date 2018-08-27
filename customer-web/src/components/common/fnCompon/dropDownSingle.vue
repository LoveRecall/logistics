<template>
    <div class="dropDown">
        <el-popover
                ref="popover5"
                :placement="placement"
                trigger="click"
                v-model="visible">
            <div class="deepBox">
                <el-input
                        :placeholder="searchPlaceholder"
                        v-model="filterText">
                </el-input>
                <div class="deep" :style="{'height':treeHeight}">
                    <el-tree
                            default-expand-all
                            ref="tree"
                            :empty-text="emptyText"
                            :data="copyList"
                            node-key="id"
                            :props="defaultProps"
                            :expand-on-click-node="expandOnClickNode"
                            @node-click="getChecked"
                            :filter-node-method="filterNode">
                    </el-tree>
                </div>
            </div>
        </el-popover>
        <el-input
                @mouseover.native="handleMouseover"
                @mouseleave.native="handleMouseLeave"
                :placeholder="checkInputBoxPl"
                v-popover:popover5
                v-model="val[defaultProps.label]"
                :size="size"
                readonly>
            <i v-if="showIcon" slot="suffix" class="el-icon-arrow-down speIcon"></i>
            <i v-else @click="clearData" slot="suffix" class="el-icon-error speIcon"></i>
        </el-input>
    </div>
</template>

<script>
    /**dropDown
     * Time -2018-03-20
     * @param { emptyText } - 内容为空时 树形展示的文本
     * @param { searchPlaceholder } - 搜索框提示文字
     * @param { checkInputBoxPl } - 操作框提示文字
     * @param { list } - 树型组件数组
     * @param { selectedList } - 选中nodes => 返回数组 可用过 vw.$refs.status 取值
     * @param { getChecked } -methods 选择触发 返回值getChecked
     * @param { treeHeight } - 树高度 默认 200
     * @param { chindeNode } - 是否只能选择子节点 boolean 默认false
     */
    export default {
        data() {
            return {
                selectedList:'',
                data:[],
                visible: false,
                filterText: '',
                val: {},
                copyList:[],
                showIcon:true
            };
        },
        props: {
            emptyText: {
                type: String,
                default: 'no data'
            },
            searchPlaceholder: {
                type: String,
                default: ''
            },
            checkInputBoxPl: {
                type: String,
                default: 'Please Choose'
            },
            list: {
                type: Array,
                default: []
            },
            treeHeight: {
                type: String,
                default: '200px'
            },
            placement: {
                type: String,
                default: 'bottom'
            },
            defaultProps: {
                type: Object,
                default: () => {
                    return {
                        children: 'children',
                        label: 'label'
                    }
                }
            },
            chindeNode: {
                type: Boolean,
                default: false
            },
            value: {
                type: [String, Number],
                default: ''
            },
            size: {
                type: String,
                default: 'mini'
            },
            expandOnClickNode: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            selectedList(val) {
                this.$emit('input', val.id);
            },
            value(val) {
                if(!val) return this.val = {};
                this.setInput(this.$depthClone(this.list), this.value);
            },
            list(n){
                this.copyList=this.$depthClone(n);
            },
            'val.id'(){
                if(this.expandOnClickNode && this.val[this.defaultProps.children] && this.val[this.defaultProps.children].length || this.val._disableClick){
                    return;
                }
                this.selectedList = this.$depthClone(this.val);
            },
        },
        mounted() {
            this.setInput(this.list, this.value);
        },
        methods: {
            getChecked(item) {
                if(this.expandOnClickNode && item[this.defaultProps.children] && item[this.defaultProps.children].length || item._disableClick){
                    return;
                }
                this.selectedList = item;
                this.visible = false;
            },
            setInput(item, val) {
                item.forEach(data => {
                    if(val === data.id) return this.val = data;
                    if(data[this.defaultProps.children] && data[this.defaultProps.children].length) this.setInput(data.children, val);
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data[this.defaultProps.label].indexOf(value) !== -1;
            },
            clearData(){
                this.selectedList=[];
                this.val[this.defaultProps.label]='';
                this.$nextTick(()=>{
                    this.visible = false;
                })
            },
            handleMouseover(){
                if(this.val[this.defaultProps.label]){
                    this.showIcon=false;
                }
            },
            handleMouseLeave(){
                this.showIcon=true;
            },
        }
    };
</script>
<style scoped>
    .dropDown >>> .el-dropdown {
        width:100%;
    }
</style>

<style scoped lang="less">
    .deepBox {
        padding:10px;
        background:#fff;
        .deep {
            margin-top:10px;
            max-height:200px;
            overflow-y: auto;
        }
    }
    .checkInputBox {
        position: relative;
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        min-height: 28px;
        outline: 0;
        padding: 0 15px;
        min-width:200px;
        i.el-icon-arrow-up {
            transition: all .5s ease;
            cursor: pointer;
        }
        &.active {
            border-color:#409eff;
            i {
                color:#409eff;
                transform: rotate(180deg);
            }
        }
        width: 100%;
        .dataBox {
            overflow: hidden;
            span {
                display:inline-block;
                font-size:12px;
                line-height: 26px;
                i {
                    font-size:14px;
                    cursor: pointer;
                }
            }
        }
        .checkInputBoxPl {
            position: absolute;
            left:10px;
            top:50%;
            transform: translate(0, -50%);
            color:#999;
            font-weight: normal;
            font-size: 12px;
        }
        .el-icon-arrow-down {
            position: absolute;
            right:5px;
            top:50%;
            margin-top:-8px;
        }
    }
    .dropDown {
        position: relative;
        min-width:188px;

        .data-box-active {
            width:230px;
            padding:10px;
            box-sizing: border-box;
            border-radius: 5px;
            box-shadow: 0 0 5px #ccc;
            position:absolute;
            right:-232px;
            top:0;
            background:#fff;
            span {
                background:#f4f4f4;
                color:#94979a;
                padding:8px 8px;
                margin:5px 5px 5px 0;
                border-radius: 5px;
                display:inline-block;
                font-size:12px;
                i {
                    font-size:14px;
                    cursor: pointer;
                }
            }
        }
        .speIcon{
            margin-right: 5px;
        }
    }
</style>