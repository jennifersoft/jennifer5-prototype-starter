<template>
    <div class="db-conn-pool-table"
         :class="{ overflow: isOverflow }"
         :style="{ 'max-height': tableHeight + 'px' }">
        <table class="table simple headline hover" ref="table">
            <thead v-if="headerRows.length > 0">
                <tr>
                    <th width="180px" rowspan="3" class="time-col">
                        {{ i18n.time }}
                    </th>
                    <th v-for="row in headerRows"
                        class="level1"
                        :colspan="row.functions.length * row.metrics.length"
                        :title="row.oid">
                        {{ row.oid }}
                    </th>
                </tr>
                <tr>
                    <template v-for="row in headerRows">
                        <th v-for="(func, j) in row.functions"
                            class="level2"
                            :class="{ first: j === 0 }"
                            :colspan="row.metrics.length"
                            :title="func">
                            {{ func }}
                        </th>
                    </template>
                </tr>
                <tr>
                    <template v-for="row in headerRows">
                        <template v-for="(_, j) in row.functions">
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
                <tr v-for="row in list">
                    <td width="180px">{{ row.timeConverted }}</td>
                    <td v-for="cell in row.list.slice(1)" align="right">
                        {{ cell > -1 ? cell.toLocaleForAries() : '' }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {mapState, mapMutations} from '../store';
import {convertTimeText} from "@entry/analysis/dbmetrics/dbsearch";

const MIN_COL_WIDTH = 72;
export default {
    name: "DbConnPoolTable",
    inject: {
        i18n: {
            default: () => ({
                time: 'time',
            })
        }
    },
    props: {
        list: {
            type: Array,
            default: () => [],
        },
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
            conditionQueue: state => state.conditionQueue,
            filterCache: state => state.filterCache,
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
    },
    watch: {
        list(next) {
            this.headerRows = this.createHeaderRows();
            this.columnCount = this.conditionQueue.map(e => (e.metrics.length * e.pool.length))
                .reduce((a, b) => a + b, 0);
        },
        showStartTime: {
            handler(next, prev) {
                if (next !== prev) {
                    this.updateFilterCache({
                        ...this.filterCache,
                        showStartTime: next,
                    });
                    const { endTime, interval, showStartTime } = this.filterCache;
                    this.updateTableData(this.list.map(i => ({
                        ...i,
                        timeConverted: convertTimeText(
                            i.list[0],
                            endTime,
                            interval,
                            showStartTime
                        ),
                    })));
                }
            },
            immediate: false,
        }
    },
    data() {
        return {
            headerRows: [],
            columnCount: 0,
        }
    },
    methods: {
        ...mapMutations([
            'updateTableData',
            'updateFilterCache',
        ]),
        createHeaderRows() {
            return this.conditionQueue.map(e => {
                const { resource, pool, metrics } = e;
                return {
                    oid: resource.name,
                    functions: pool.map(p => p.label),
                    metrics: metrics.map(m => m.label),
                }
            });
        }
    },
    beforeMount() {
        this.MIN_COL_WIDTH = MIN_COL_WIDTH;
    },
}
</script>

<style lang="scss" scoped>
@import "~@entry/analysis/dbmetrics/styles/table-overflow.scss";
.db-conn-pool-table {
    @include table-overflow;
}
</style>