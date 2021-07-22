<template>
    <div class="disk-usage-table"
         :class="{ overflow: isOverflow }"
         :style="{ 'max-height': tableHeight + 'px' }">
        <table class="table simple headline hover">
            <thead v-if="headerRows.length > 0 && tableData.length > 0">
                <tr>
                    <th width="180px" rowspan="3" class="time-col">
                        {{ i18n.time }}
                    </th>
                    <th v-for="row in headerRows"
                        class="level1"
                        :colspan="row.partitions.length * row.metrics.length"
                        :title="row.instance">
                        {{ row.instance }}
                    </th>
                </tr>
                <tr>
                    <template v-for="row in headerRows">
                        <th v-for="(parts, j) in row.partitions"
                            class="level2"
                            :class="{ first: j === 0 }"
                            :colspan="row.metrics.length"
                            :title="parts">
                            {{ parts }}
                        </th>
                    </template>
                </tr>
                <tr>
                    <template v-for="row in headerRows">
                        <template v-for="(_, j) in row.partitions">
                            <th v-for="metric in row.metrics"
                                class="level3"
                                :class="{ first: j === 0 }"
                                :title="metric">
                                {{ metric }}
                            </th>
                        </template>
                    </template>
                </tr>
            </thead>
            <tbody v-if="progress >= 1">
                <tr v-for="row in sortedRowData">
                    <td>{{ row[0] | timeFormat(viewByDate, showStartTime) }}</td>
                    <td v-for="cell in row.slice(1)">{{ cell }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {mapState} from '@entry/analysis/dbmetrics/disk/store';
import {convertTimeText} from "@entry/analysis/dbmetrics/dbsearch";
import {ClientUtilities} from "@common/legacy/ClientUtilities";

const MIN_COL_WIDTH = 72;
export default {
    name: "DiskUsageTable",
    inject: {
        i18n: {
            time: {
                default: 'time',
            }
        }
    },
    props: {
        tableWidth: {
            type: Number,
            required: true,
        },
        tableHeight: {
            type: Number,
            default: 200,
        }
    },
    computed: {
        ...mapState({
            tableData: state => state.tableData,
            conditionQueue: state => state.conditionQueue,
            viewByDate: state => state.filterCache.viewByDate,
            showStartTime: state => state.showStartTime,
            progress: state => state.progress,
        }),
        isOverflow() {
            const timeColumnWidth = 180;
            const borderWidth = 1;
            return (
                this.tableWidth - timeColumnWidth <
                (this.MIN_COL_WIDTH + borderWidth) * this.columnCount
            );
        },
        sortedRowData() {
            return this.tableData.sort((a, b) => (a[0] - b[0]));
        }

    },
    watch: {
        tableData(next) {
            this.headerRows = this.createHeaderRows();
            this.columnCount = this.conditionQueue.map(e => (e.metrics.length * e.partitions.length))
                .reduce((a, b) => a + b, 0);
        }
    },
    filters: {
        timeFormat: (timeStamp, viewByDate, showStartTime) => {
            const maxTime = viewByDate ? timeStamp + ClientUtilities.ONE_DAY : timeStamp + ClientUtilities.ONE_HOUR;
            const interval = viewByDate ? 'all' : ClientUtilities.ONE_HOUR;
            return convertTimeText(timeStamp, maxTime, interval, showStartTime);
        }
    },
    data() {
        return {
            headerRows: [],
            columnCount: 0,
        }
    },
    methods: {
        createHeaderRows() {
            return this.conditionQueue.map(e => {
                const { resource, partitions, metrics } = e;
                return {
                    instance: resource.shortName,
                    partitions: partitions.map(p => p.label),
                    metrics: metrics.map(m => m.label),
                }
            });
        },
    },
    beforeMount() {
        this.MIN_COL_WIDTH = MIN_COL_WIDTH;
    },
}
</script>

<style lang="scss" scoped>
@import "~@entry/analysis/dbmetrics/styles/table-overflow.scss";
.disk-usage-table {
    @include table-overflow;
}
</style>