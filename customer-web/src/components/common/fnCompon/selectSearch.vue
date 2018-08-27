<template>
    <div class="select-wrap">
        <div class="select" v-if="selectHide">
            <el-select v-model="keyObject" value-key="id" :placeholder="$i.common.inputSearch" :clearable="false">
                <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.label"
                    :value="item"/>
            </el-select>
        </div>
        <div class="search">
            <el-date-picker v-if="keyObject && keyObject.type === 'dateRange'"
                v-model="keyObject.value"
                type="daterange"
                range-separator="-"
                start-placeholder="Start date"
                end-placeholder="End date">
            </el-date-picker>
            <el-input v-else
                v-model="keyObject.value"
                clearable
                :placeholder="$i.common.inputkeyWordToSearch"
                :style="{width:width+'px'}"
                @keyup.enter.native="inputEnter"/>
            <el-button
                type="primary"
                slot="append"
                icon="el-icon-search"
                @click="inputEnter"
                :loading="searchLoad"/>
        </div>
    </div>
</template>
<script>
export default {
    name: 'selectSearch',
    data() {
        return {
            keyObject: null
        }
    },
    props: {
        options: {
            type: Array,
            default: []
        },
        selectHide: {
            type: Boolean,
            default: true
        },
        searchLoad: {
            type: Boolean,
            default: false
        },
        value: {
            type: [String, Number],
            default: ''
        },
        width:{
            type: Number,
            default: 150
        }
    },
    created () {
        this.keyObject = this.options.filter(o => o.id === this.value)[0] || {};
    },
    methods: {
        inputEnter() {
            let operatorFilters = [];
            if (this.keyObject.id && this.keyObject.value) {
                let value;
                if (this.keyObject.type === 'dateRange') {
                    value = {start: this.keyObject.value[0].getTime(), end: this.keyObject.value[1].getTime()};
                } else {
                    value = this.keyObject.value;
                }
                operatorFilters.push({property: this.keyObject.id, value, operator: this.keyObject.operator || '='});
            }
            this.$emit('inputEnter', this.keyObject, operatorFilters);
        }
    }
}
</script>

<style lang="less" scoped>
    .select-wrap {
        display:flex;
        align-items:center;
        .select {
            margin-right:5px;
        }
        .set {
            cursor: pointer;
            padding-left:18px;
            color:#999;
            i {
                font-size:25px;
            }
        }
    }
</style>
