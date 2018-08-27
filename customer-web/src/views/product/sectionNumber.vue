<template>
    <div class="section-number">
        <el-form-item :label="$t('product.page.exwPrice')">
            <el-input-number
                    class="numberInput"
                    v-model="data.max"
                    :min="0"
                    :controls="false">
            </el-input-number>
        </el-form-item>
    </div>
</template>

<script>
    export default {
        name: "section-number",
        props:{
            data:{
                type:Object,
                default:{}
            },
        },
        data(){
            return{

            }
        },
        methods:{

        }
    }
</script>

<style scoped>
    .section-number{

    }
</style>