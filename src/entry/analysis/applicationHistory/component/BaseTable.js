export default {
    data() {
        return {
            tableObj: null,
        };
    },
    props: {
        rows: {
            type: Array,
            required: false,
            default: () => [],
        },
        index: {
            type: Number,
            required: false,
            default: -1,
        },
        height: {
            type: Number,
            required: true,
        },
    },
    watch: {
        rows(newVal) {
            this.tableObj.update(newVal);

            // 데이터 업데이트시 로우선택 효과 주기
            if (newVal.length > 0 && this.index > -1) {
                setTimeout(() => {
                    this.tableObj.select(this.index);
                }, 1);
            }
        },
        height(newVal) {
            this.tableObj.scrollHeight(newVal);
        },
    },
};
