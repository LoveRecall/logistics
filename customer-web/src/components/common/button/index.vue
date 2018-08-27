<template>
    <el-button
            :loading="loadingBtn"
            @click="handleBtnClick"
            :disabled="disabled || disableClick">
        <slot></slot>
        <span v-if="startCount">({{countSeconds}})</span>
    </el-button>
</template>

<script>
    /**
     *   orderType:
     *      10=>'采购订单'
     *      20=>'QC订单'
     *      30=>'物流计划'
     *      40=>'物流清单'
     * */


    export default {
        name: "dunning-button",
        props:{
            disabled:{
                type:Boolean,
                default:false
            },
            moduleCode:{
                type:String,
                default:''
            },
            orderNo:{
                type:[String,Number],
                default:''
            },
            orderType:{
                type:[String,Number],
                default:''
            },
        },
        data(){
            return{
                loadingBtn:false,
                startCount:false,
                countSeconds:60,
                timeInterval:'',
                disableClick:false
            }
        },
        methods:{
            handleBtnClick(){
                this.loadingBtn=true;
                this.$ajax.post(this.$apis.PAYMENT_DUNNING,{
                    orderNo:this.orderNo,
                    orderType:this.orderType,
                    moduleCode:this.moduleCode
                }).then(()=>{
                    this.$message({
                        message: this.$i.order.dunSuccess,
                        type: 'success'
                    });
                    this.startCount=true;
                    this.disableClick=true;
                    this.timeInterval=setInterval(()=>{
                        this.countSeconds--;
                    },1000);
                }).finally(()=>{
                    this.loadingBtn=false;
                })
            },
        },
        watch:{
            countSeconds(n){
                if(n===0){
                    clearInterval(this.timeInterval);
                    this.countSeconds=60;
                    this.disableClick=false;
                    this.startCount=false;
                }
            },
        },
        destroyed(){
            if(this.timeInterval){
                clearInterval(this.timeInterval);
            }
        },
    };
</script>

<style scoped>

</style>