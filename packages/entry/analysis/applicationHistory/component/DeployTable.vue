<template>
    <table ref="grid" class="table borderless nowrap">
        <thead>
            <tr>
                <th>{{ i18n.changeTime }}</th>
                <th>{{ i18n.target }}</th>
                <th width="50%">{{ i18n.deployFile }}</th>
                <th>{{ i18n.size }}</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</template>

<script>
import jui from 'juijs-grid';
import Table from 'juijs-grid/src/components/table';
import XTable from 'juijs-grid/src/components/xtable';
import { setSortEff } from '@common/utility';
import BaseTable from './BaseTable';

jui.use(Table, XTable);

export default {
    inject: ['i18n'],
    mixins: [BaseTable],
    mounted() {
        const self = this;

        this.tableObj = jui.create('grid.xtable', this.$refs.grid, {
            fields: ['collectTime', 'instanceName', 'fileName', 'fileSize'],
            resize: true,
            sort: true,
            sortCache: true,
            sortLoading: true,
            scrollHeight: this.height,
            event: {
                sort: setSortEff,
                click: function(row) {
                    this.select(row.index);
                    self.$emit('change', row.rownum);
                },
            },
            tpl: {
                row: `<tr>
    <td><!= timeFormat !></td>
    <td><!= instanceName !></td>
    <td title="<!= fileName !>"><!= fileName !></td>
    <td align="right"><!= fileSizeFormat !></td>
</tr>`,
            },
        });
    },
};
</script>
