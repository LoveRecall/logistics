<template>
  <div class="attachment">
    <div class="attchment">
       <div class="attchment_item" @click='download'>
            <div class="attchment_item_content">
                <i class="el-icon-document"></i>
                 <p>产品介绍</p>
                <i class="el-icon-download"></i>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
    /*从父组件 哪里传 props=>list*/
    export default {
        name: 'attachment',
        props: {
            list: {
                type: Array,
                default: function() {
                    return []
                }
            },
        },
        data() {
            return {}
        },
        components: {

        },
        created() {

        },
        methods: {
            download() {
                window.location.href = "url";
            }
        }
    }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .attchment {
        display: flex;
        justify-content: flex-start;
        height: 400px;
    }

    .attchment_item {
        width: 180px;
        height: 60px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border: 1px solid #BEBEBE;
        border-radius: 3px;
        margin-left: 20px;
    }

    .attchment_item_content {
        width: 180px;
        display: flex;
        justify-content: center;
        align-items: baseline;
    }

    .attchment_item p {
        font-size: 14px;
        padding-left: 5px;
        padding-right: 5px;
    }

    .attchment_item i {
        font-size: 40px;
    }

</style>
