<template>
    <div id="table-root" ref="root">
        <div
            id="applTable"
            class="xtable"
            v-show="serviceType === 'application'"
        >
            <table class="table simple headline hover">
                <thead>
                    <tr>
                        <th v-for="column in applicationColumns">
                            {{ column.name }}
                        </th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div
            id="sqltxTable"
            class="xtable"
            v-show="serviceType !== 'application'"
        >
            <table class="table simple headline hover">
                <thead>
                    <tr>
                        <th v-for="column in sqlExternalcallColumns">
                            {{ column.name }}
                        </th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</template>

<script>
import jui from 'juijs';
import XTableComp from 'juijs-grid/src/components/xtable';
import { downloadCsv, setSortEff } from '@common/utility';
import {
    StatisticsApplicationFields,
    StatisticsSqlTxFields,
} from '@common/definition';
import { convertTimeText } from '../../dbsearch';
import {
    INTERVAL_MAP,
    COMMON_COLUMNS,
    COMMON_COLUMN_CALLBACK,
} from '../metadata';

jui.use(XTableComp);

import {mapState} from '../store';

export default {
    name: 'DbServiceTable',
    props: {
        tableData: {
            type: Array,
            required: false,
            default: null,
        },
        height: {
            type: Number,
            required: true,
        }
    },
    watch: {
        tableData: function(newVal) {
            const activeTable = this.getActiveTable();
            activeTable.initColumns(this.serviceMetrics);
            activeTable.update(newVal.map(row => ({
                ...row,
                time: convertTimeText(
                    row.time,
                    this.endTime,
                    this.intervalType !== 'ALL'
                        ? INTERVAL_MAP[this.intervalType]
                        : 'all',
                    this.showStartTimeOnly
                )
            })));
            activeTable.scrollTop(0);
        },
        showStartTimeOnly(next) {
            const activeTable = this.getActiveTable();
            activeTable.initColumns(this.serviceMetrics);
            activeTable.update(this.tableData.map(row => ({
                ...row,
                time: convertTimeText(
                    row.time,
                    this.endTime,
                    this.intervalType !== 'ALL'
                        ? INTERVAL_MAP[this.intervalType]
                        : 'all',
                    next
                )
            })));
            activeTable.scrollTop(0);
        },
        serviceType: function() {
            setTimeout(() => {
                const activeTable = this.getActiveTable();
                activeTable.reset();
                activeTable.resize();
            }, 1);
        },
        height(next, prev) {
            if (next !== prev) this.resize();
        }
    },
    computed: {
        ...mapState({
            endTime: state => state.endTime.valueOf(),
            intervalType: state => state.intervalType,
            serviceType: state => state.serviceType,
            serviceMetrics: state =>
                ['time', 'name'].concat(state.serviceMetrics),
            showStartTimeOnly: state => state.showStartTimeOnly,
        }),
    },
    data: function() {
        return {
            width: window.innerWidth - 196,
            applicationColumns: COMMON_COLUMNS.concat(
                Object.keys(StatisticsApplicationFields).map(
                    COMMON_COLUMN_CALLBACK
                )
            ),
            sqlExternalcallColumns: COMMON_COLUMNS.concat(
                Object.keys(StatisticsSqlTxFields).map(COMMON_COLUMN_CALLBACK)
            ),
            applicationTable: null,
            sqlExternalcallTable: null,
        };
    },
    methods: {
        createRowTemplate(columns) {
            let tpl = '';

            columns.forEach((column, index) => {
                if (index > 1) {
                    tpl += `<td align='right'><!= ${column.key}.toLocaleForAries() !></td>`;
                } else {
                    tpl += `<td><!= ${column.key} !></td>`;
                }
            });

            return `<tr>${tpl}</tr>`;
        },
        createTableObject(selector, columns) {
            const xtable = jui.include('grid.xtable');

            const tableObj = xtable(selector, {
                fields: columns.map(column => column.key),
                csvNames: columns.map(column => column.name),
                resize: true,
                sort: true,
                scrollWidth: this.$refs.root.clientWidth,
                event: {
                    sort: function(column, e) {
                        setSortEff(column, e, true);
                    },
                },
                tpl: {
                    row: this.createRowTemplate(columns),
                },
            });

            tableObj.initColumns(['time', 'name']);

            return tableObj;
        },
        getActiveTable() {
            return this.serviceType === 'application'
                ? this.applicationTable
                : this.sqlExternalcallTable;
        },
        getActiveColumns() {
            return this.serviceType === 'application'
                ? this.applicationColumns
                : this.sqlExternalcallColumns;
        },
        exportData() {
            const columns = this.getActiveColumns().filter(column =>
                this.serviceMetrics.includes(column.key)
            );
            const data = this.getActiveTable().listData();

            downloadCsv(this.serviceType, {
                fields: columns.map(column => column.key),
                names: columns.map(column => column.name),
                rows: data,
            });
        },
        resize() {
            if (!!this.applicationTable && !!this.sqlExternalcallTable) {
                this.applicationTable.height(this.height);
                this.sqlExternalcallTable.height(this.height);
            }
        }
    },
    mounted() {
        if (
            this.applicationTable == null &&
            this.sqlExternalcallTable == null
        ) {
            this.applicationTable = this.createTableObject(
                '#applTable',
                this.applicationColumns
            );
            this.sqlExternalcallTable = this.createTableObject(
                '#sqltxTable',
                this.sqlExternalcallColumns
            );
        }
        this.resize();
    },
};
</script>

<style lang="scss" scoped>

</style>
