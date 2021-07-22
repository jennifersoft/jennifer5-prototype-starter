<template>
    <sheets-table
        class="detail-table"
        table-type="simple headline"
        table-size="large"
        table-effect="hover stripeless"
        scroll="scroll"
        resize
        :data="list"
        :columns="tableColumn"
        :row-height="35"
        :height="height - 36"
        :table-width="width"
        :scroll-height="height - 36"
        :template-row="TEMPLATE_ROW"
        :sort-cache="true"
        @click="onClickTableRow"
    />
</template>

<script>
import SheetsTable from 'vue-sheets/src/components/xtable';
import { TEMPLATE_ROW_SOCKET_DETAIL } from '@entry/analysis/socket/templates';

export function onClickStacktraceBtn(row, event) {
    const { target } = event;
    const { data, index } = row;
    const { key } = data;

    if (target.classList.contains('round-btn')) {
        switch (target.classList.item(0)) {
            case 'show-stack':
                this.$emit('show-stack', data);
                return;
            case 'wait-stack':
                return;
            case 'receive-stack':
                this.$emit('receive-stack', { key, index });
                return;
        }
    }
}

export default {
    name: 'DetailTable',
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                num: 'num',
                openTime: 'openTime',
                localPort: 'localPort',
                ip: 'ip',
                remotePort: 'remotePort',
                mode: 'mode',
                size: 'size',
                bytes: 'bytes',
                stacktrace: 'stacktrace',
            }),
        },
    },
    props: {
        list: {
            type: Array,
            required: true,
        },
        height: Number,
        width: Number,
    },
    components: {
        SheetsTable,
    },
    computed: {
        tableColumn() {
            return [
                { key: null, name: this.i18n.num, width: 50 },
                { key: 'timestamp', name: this.i18n.openTime, sort: true },
                { key: 'localport', name: this.i18n.localPort, sort: true },
                { key: 'host', name: this.i18n.ip, sort: true },
                { key: 'port', name: this.i18n.remotePort, sort: true },
                { key: 'mode', name: this.i18n.mode, sort: true },
                { key: 'bytes', name: this.i18n.size, sort: true },
                { key: 'stacktrace', name: this.i18n.stacktrace, width: 200 },
            ];
        },
    },
    created() {
        this.TEMPLATE_ROW = TEMPLATE_ROW_SOCKET_DETAIL;
        this.onClickTableRow = onClickStacktraceBtn.bind(this);
    },
};
</script>

<style lang="scss" scoped>
@import '~@entry/analysis/socket/styles/stacktrace-cell.scss';
.detail-table {
    @include stacktrace-cell;
}
</style>
