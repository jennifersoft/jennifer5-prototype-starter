<template>
    <x-table
        :table-type="'nowrap'"
        :table-effect="'hover stripeless'"
        :table-size="size"
        :table-width="mainWidth"
        :scroll-width="mainWidth"
        :scroll-height="scrollHeight"
        :columns="columns"
        :data="rows"
        :template-row="rowTemplate"
        :row-height="rowHeight"
        :sort-type="'single'"
        :resize="true"
        @click="onClickTableRow"
    >
    </x-table>
</template>

<script>
import XTable from 'vue-sheets/src/components/xtable';
import { mapState as baseMapState } from '../store/base';

export default {
    components: {
        XTable,
    },
    props: {
        size: {
            type: String,
            required: false,
            default: 'normal',
            validator: value => {
                return value === 'normal' || value === 'small';
            },
        },
        columns: {
            type: Array,
            required: true,
        },
        rows: {
            type: Array,
            required: false,
            default: () => [],
        },
        rowTemplate: {
            type: String,
            required: true,
        },
        marginTop: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    computed: {
        ...baseMapState({
            mainWidth: state => state.mainWidth,
            mainHeight: state => state.mainHeight - 32,
        }),
        scrollHeight() {
            return this.mainHeight - this.marginTop;
        },
        rowHeight() {
            if (this.size === 'normal') return 27;
            return 22;
        },
    },
    methods: {
        onClickTableRow(row, e) {
            this.$emit('click', row, e);
        },
    },
};
</script>

<style scoped></style>
