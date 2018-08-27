<template>
    <div class="overview">
        <div class="title">
            <span>{{title}}</span>
        </div>
        <div class="search-option">
            <el-form :label-width="`${labelWidth}px`">
                <el-row>
                    <el-col
                            class="search-item"
                            v-for="v in formColumn"
                            :key="v.key"
                            v-if="v._isDefaultShow"
                            :class="{multipleSelect:v.multipleSelect}"
                            :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :prop="v.key" :label="`${v.label} :`">
                            <div v-if="v.type==='dropdown'">
                                <drop-down-single
                                        class="speLine"
                                        v-model="formData[v.key]"
                                        :list="v._list"
                                        :defaultProps="v._defaultProps"
                                        :searchPlaceholder="$i.product.pleaseInput"
                                        :checkInputBoxPl="$i.product.pleaseChoose"
                                        :expandOnClickNode="false">
                                </drop-down-single>
                            </div>
                            <div v-else-if="v.type==='select'">
                                <el-select class="speLine"
                                           :prop="v.key"
                                           :filterable="v._filterable?true:false"
                                           v-model="formData[v.key]"
                                           clearable
                                           :multiple="v._multiple?true:false"
                                           :collapse-tags="v._collapse?true:false"
                                           :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in v._options"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.type==='between'">
                                <between class="speLine"
                                         :form="formData"
                                         :between-key="v.betweenKey"></between>
                            </div>
                            <div v-else-if="v.type==='number'">
                                <v-input-number
                                        class="speNumber speLine"
                                        :placeholder="$i.product.pleaseInput"
                                        v-model="formData[v.key]"></v-input-number>
                            </div>
                            <div v-else-if="v._slot">
                                <slot :name="v._slot" :data="formData"></slot>
                            </div>
                            <div v-else>
                                <el-input
                                        :prop="v.key"
                                        class="speLine"
                                        v-model="formData[v.key]"
                                        :placeholder="$i.product.pleaseInput"></el-input>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-form :model="formData" ref="formData" class="body" :class="{hide:hideBody}" :label-width="`${labelWidth}px`">
                <el-row>
                    <el-col
                            class="search-item"
                            v-for="v in formColumn"
                            :key="v.key"
                            v-if="!v._isDefaultShow"
                            :class="{multipleSelect:v.multipleSelect}"
                            :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :prop="v.key" :label="`${v.label} :`">
                            <div v-if="v.type==='dropdown'">
                                <drop-down-single
                                        class="speLine"
                                        v-model="formData[v.key]"
                                        :list="v._list"
                                        :defaultProps="v._defaultProps"
                                        :searchPlaceholder="$i.product.pleaseInput"
                                        :checkInputBoxPl="$i.product.pleaseChoose"
                                        :expandOnClickNode="false">
                                </drop-down-single>
                            </div>
                            <div v-else-if="v.type==='select'">
                                <el-select class="speLine"
                                           :prop="v.key"
                                           :filterable="v._filterable?true:false"
                                           v-model="formData[v.key]"
                                           clearable
                                           :multiple="v._multiple?true:false"
                                           :collapse-tags="v._collapse?true:false"
                                           :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in v._options"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.type==='between'">
                                <between class="speLine"
                                         :form="formData"
                                         :between-key="v.betweenKey"></between>
                            </div>
                            <div v-else-if="v.type==='number'">
                                <v-input-number
                                        class="speNumber speLine"
                                        :placeholder="$i.product.pleaseInput"
                                        v-model="formData[v.key]"></v-input-number>
                            </div>
                            <div v-else-if="v._slot">
                                <slot :name="v._slot" :data="formData"></slot>
                            </div>
                            <div v-else>
                                <el-input
                                        :prop="v.key"
                                        class="speLine"
                                        v-model="formData[v.key]"
                                        :placeholder="$i.product.pleaseInput"></el-input>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="search-btn">
            <el-button
                    @click="search"
                    :loading="disabledSearch"
                    plain
                    type="primary">{{$i.product.search}}</el-button>
            <el-button
                    @click="clear"
                    type="info"
                    plain>{{$i.product.clear}}</el-button>
            <el-button
                    class="advancedBtn"
                    type="text"
                    v-if="showAdvancedBtn"
                    @click="hideBody = !hideBody">
                {{hideBody?$i.product.advanced:$i.product.hideTheAdvanced}}
            </el-button>
        </div>
        <div class="table">
            <v-table
                    :code="tableCode"
                    :height="500"
                    :loading="loadingTable"
                    :data="tableData"
                    :buttons="tableButtons"
                    @change-checked="changeChecked"
                    @change-sort="val=>{changeSort(val)}"
                    @action="tableBtnClick">
                <template slot="header">
                    <slot name="btns"></slot>
                </template>
            </v-table>
            <slot name="pagination"></slot>
        </div>
        <div class="footer-btn">
            <slot name="footerBtn"></slot>
        </div>
    </div>
</template>

<script>
    import dropDownSingle from '../fnCompon/dropDownSingle'
    import between from './betweenNumber'
    import VTable from '../table/index'
    import VPagination from '../table/pagination'
    import VInputNumber from '../inputNumber/index'
    

    export default {
        name: "overview",
        components:{
            dropDownSingle,
            between,
            VTable,
            VPagination,
            VInputNumber
        },
        props:{
            title:{
                type:String,
            },
            formColumn:{
                type:Object,
            },
            labelWidth:{
                type:Number,
                default:190
            },
            tableData:{
                type:Array,
                default:[]
            },
            tableCode:{
                type:String,
                default:''
            },
            tableButtons:{
                type:[Array,Function],
            },
            pageData:{
                type:Object
            },
            changePage:{
                type:Function,
            },
            changeSize:{
                type:Function
            },
            loadingTable:{           //表格转圈
                type:Boolean,
                default:false,
            },
        },
        data(){
            return{
                hideBody:true,
                formData:{},
                dictionary:[],
                showAdvancedBtn:false,      //是否要显示高级按钮

                /**
                 * 按钮状态
                 * */
                disabledSearch:false,

                /**
                 * 表格数据配置
                 * */
                selectList:[],
            }
        },
        methods:{
            init(param){
                //处理初始化数据
                let queryCode=[];
                let allDefault=true;
                _.map(this.formColumn,v=>{
                    if(v.selectCode){
                        queryCode.push(v.selectCode);
                    }
                    if(!v._isDefaultShow){
                        allDefault=false;
                    }
                });
                if(param){
                    Object.assign(this.formData,param);
                }
                if(allDefault){
                    this.showAdvancedBtn=false;
                }else{
                    this.showAdvancedBtn=true;
                }
                this.getUnit(queryCode).then(res=>{
                    res[0].push({
                        id:19124124018,
                        code:'country',
                        codes:res[1]
                    });
                    let dictionary=res[0];
                    _.map(this.formColumn,v=>{
                        if(v.type==='dropdown'){
                            if(v.dropDownType==='category'){
                                let list=[
                                    {
                                        id: 5125125,
                                        name: this.$i.product.myCategory,
                                        children: [],
                                        _disableClick:true,
                                    },
                                    {
                                        id: 12312512,
                                        name: this.$i.product.sysCategory,
                                        children: [],
                                        _disableClick:true,
                                    },
                                ];
                                this.getCategory().then(res=>{
                                    list[0].children=res[1];
                                    list[1].children=res[0];
                                    v._list=list;
                                });
                            }
                        }else if(v.type==='select'){
                            v._options=_.findWhere(dictionary,{code:v.selectCode}).codes;
                        }
                    })
                }).catch(()=>{

                });
            },
            getCategory(){
                const myCategory=this.$ajax.get(this.$apis.get_buyer_sys_category, {});
                const sysCategory=this.$ajax.get(this.$apis.get_buyer_my_category, {});
                return this.$ajax.all([myCategory,sysCategory]).then(res=>{
                    return res;
                }).catch(err=>{

                })
            },
            getUnit(codes){
                const unitAjax=this.$ajax.post(this.$apis.get_partUnit,codes,{cache:true});
                const countryAjax=this.$ajax.get(this.$apis.get_country,{},{cache:true});
                return this.$ajax.all([unitAjax,countryAjax]);
            },

            /**
             *  一些事件
             * */
            search(){
                this.disabledSearch=true;
                this.formData.pn=1;
                this.$emit('search',this.$depthClone(this.formData));
            },
            clear(){
                _.map(this.formData,(v,k)=>{
                    if(_.isArray(this.formData[k])){
                        this.formData[k]=[];
                    }else if(_.isObject(this.formData[k])){
                        this.formData[k]={};
                    }else if(_.isNumber(this.formData[k])){
                        this.formData[k]=null;
                    }else if(_.isString(this.formData[k])){
                        this.formData[k]='';
                    }
                })
            },
            changeChecked(e){
                this.$emit('change-checked',e);
            },
            tableBtnClick(e){
                this.$emit('tableBtnClick',e);
            },
            changeSort(e){
                console.log(this.$depthClone(e.sorts[0]),'e')
                this.$emit('change-sort',e);
            },
        },
        created(){
            this.init();
        },
        watch:{
            tableData(){
                this.disabledSearch=false;
            }
        },
    };
</script>

<style scoped>
    .title {
        font-weight: bold;
        font-size: 18px;
        height: 32px;
        line-height: 32px;
        color: #666666;
        margin-bottom: 5px;
    }
    .advancedBtn >>> span{
        text-decoration: underline;
    }
    .body {
        overflow: hidden;
        max-height: 320px;
        display: block;
        transition: max-height .5s cubic-bezier(.445, .05, .55, .95);
    }
    .hide {
        max-height: 0;
    }
    .speLine, .search-item >>> .speLine{
        width: 80% !important;
    }
    .speNumber >>> input{
        text-align: left;
    }
    .multipleSelect{
        height: auto !important;
    }
    .multipleSelect >>> .el-select{
        max-height: 70px;
        overflow: scroll;
        position: relative;
    }
    .multipleSelect >>> .el-select .el-input{
        width: 100%;
    }
    .multipleSelect >>> .el-select::-webkit-scrollbar {
        width: 5px;
        height: 1px;
    }
    .multipleSelect >>> .el-select .el-select__tags{
        position: absolute;
        top:5px;
        transform: translateY(0);
    }


    .search-item{
        height: 56px;
    }
    .search-btn{
        text-align: center;
    }
    .table{
        margin-top: 20px;
    }
    .footer-btn{
        text-align: center;
    }
</style>