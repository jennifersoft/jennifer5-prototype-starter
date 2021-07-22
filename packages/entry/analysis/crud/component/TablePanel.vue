<template>
    <div class="table-panel">
        <div class="toolbar">
            <table-tool-bar
                @change-filter="filter => $emit('change-filter', filter)"
            ></table-tool-bar>
        </div>
        <table ref="grid" class="table normal nowrap">
            <thead>
                <tr>
                    <th width="50px">{{ i18n.num }}</th>
                    <th>{{ i18n.application }}</th>
                    <th>{{ i18n.tableCrud }}</th>
                    <th>{{ i18n.databaseFunction }}</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>

<script>
import jui from 'juijs-grid';
import Table from 'juijs-grid/src/components/table';
import XTable from 'juijs-grid/src/components/xtable';
import TableToolBar from './TableToolBar';
import { setSortEff } from '@common/utility';
import { printTableStr } from '../utility';
jui.use(Table, XTable);

export default {
    components: {
        TableToolBar,
    },
    inject: ['i18n'],
    props: {
        tableRows: {
            type: Array,
            required: false,
            default: () => [],
        },
        tableHeight: {
            type: Number,
            required: true,
        },
    },
    watch: {
        tableRows(data) {
            this.tableObj.update(
                data.map(row => {
                    return {
                        tableFormat: printTableStr(row.table, false),
                        funcFormat: row.func.join(', '),
                        ...row,
                    };
                })
            );
        },
        tableHeight(height) {
            this.tableObj.scrollHeight(height);
        },
    },
    data() {
        return {
            tableObj: null,
        };
    },
    mounted() {
        this.tableObj = jui.create('grid.xtable', this.$refs.grid, {
            fields: [null, 'service', 'tableFormat', 'funcFormat'],
            resize: true,
            sort: true,
            sortCache: true,
            sortLoading: true,
            scrollHeight: this.tableHeight,
            event: {
                sort: setSortEff,
            },
            tpl: {
                row: `<tr>
    <td align="right"><!= row.seq !></td>
    <td><!= service !></td>
    <td><!= tableFormat !></td>
    <td><!= funcFormat !></td>
</tr>`,
            },
        });
    },
};
</script>

<style lang="scss" scoped>
.table-panel {
    margin-top: 10px;
}
</style>
