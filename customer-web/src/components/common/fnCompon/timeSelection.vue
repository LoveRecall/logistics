<template>
    <div class="timeSelection">
        <el-date-picker
            v-model="dateTime"
            type="datetime"
            :disabled="disabled"
            :picker-options="pickerOptions"
            :placeholder="datePlaceholder"
            :disabled-date="disabledDate"
        />
    </div>
</template>
<script>
    const toDou = (n) => {
        if (n < 10) return '0' + n;
        return '' + n;
    };

    const getTimeString = (date, timezone) => {
        var tz = date.getTimezoneOffset();
        var dt = new Date();
        dt.setTime(date.getTime() + tz*60000 + timezone*3600000);
        return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()} ${toDou(dt.getHours())}:${toDou(dt.getMinutes())}:${toDou(dt.getSeconds())}`;
    };

    export default {
        name: 'timeSelection',
        data() {
            return {
                 pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            let str = getTimeString(new Date(), 0);
                            console.log(str)
                            //picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }],
                    shortcut: [{
                        text: '今天',
                        onClick(picker) {
                            console.log(getTimeString(new Date(), 8))
                            //picker.$emit('pick', new Date());
                        }
                    }]
                }
            }
        },
        props: {
            datePlaceholder: {
                type: String,
                default: 'please choose the date'
            },
            disabled: { //是否禁用
                type: Boolean,
                default: false
            },
            value: {
                type: [Date, String],
                default: () => {
                    return new Date();
                }
            }
        },
        computed: {
            dateTime: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('input', val);
                }
            } 
        },
        methods: {
            disabledDate(val) {
                return 1;
            }
        }
    }
</script>
<style lang="less" scoped>

</style>
