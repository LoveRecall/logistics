<template>
    <div class="between">
        <i class="between-range_icon"></i>
        <v-input-number
                class="between-range_input"
                :placeholder="$i.common.min"
                @blur="check"
                v-model="form[betweenKey[0]]"></v-input-number>
        <span class="between-separator">~</span>
        <v-input-number
                class="between-range_input"
                :placeholder="$i.common.max"
                @blur="check"
                v-model="form[betweenKey[1]]"></v-input-number>
        <i class="between-range_close-icon"></i>
    </div>
</template>

<script>
    
    import VInputNumber from '../inputNumber/index'
    
    export default {
        name: "betweenNumber",
        components:{
            VInputNumber
        },
        props:{
            form:{
                type:Object,
            },
            betweenKey:{
                type:Array,
                default:[]
            },
        },
        data(){
            return{

            }
        },
        methods:{
            check(){
                if(this.form[this.betweenKey[0]]!==null && this.form[this.betweenKey[1]]!==null && this.form[this.betweenKey[0]]>this.form[this.betweenKey[1]]){
                    this.$nextTick(()=>{
                        this.form[this.betweenKey[0]]=null;
                        this.form[this.betweenKey[1]]=null;
                    })
                }
            },
        },
    }
</script>

<style scoped>
    .between{
        width: 100%;
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        background-color: #ffffff;
        border-radius:4px;
        border:1px solid #dcdfe6;
        box-sizing: border-box;
        color:#606266;
        font-size: inherit;
        height: 28px;
        line-height: 28px;
        outline: none;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    }
    .between-range_icon{
        font-size: 14px;
        margin-left: -5px;
        color: #c0c4cc;
        float: left;
        line-height: 32px;
        width: 25px;
        height: 100%;
        text-align: center;
        transition: all .3s;
    }
    .between-range_close-icon{
        font-size: 14px;
        color: #c0c4cc;
        width: 25px;
        display: inline-block;
        float: right;
        line-height: 32px;
        height: 100%;
        text-align: center;
        transition: all .3s;
    }
    .between-input{
        line-height: 1;
        border:none;
        outline: none;
        display: inline-block;
        height:100%;
        margin:0;
        padding: 0;
        width: 39%;
        text-align: center;
        font-size: 14px;
        color:#606226;
    }
    .between-range_input >>> input{
        border:0;
        height: 26px;
    }
    .between-separator{
        display: inline-block;
        height: 100%;
        padding: 0 5px;
        margin: 0;
        text-align: center;
        line-height: 22px;
        font-size: 14px;
        width: 5%;
        color: #303133;
    }
</style>