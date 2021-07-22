<template>
    <div
        class="db-metrics-table"
        :class="{ overflow: isOverflow }"
        :style="{ 'max-height': tableHeight + 'px' }"
    >
        <table ref="table" class="table simple headline hover">
            <thead ref="theadRef"></thead>
            <tbody>
                <tr v-for="(row, i) in filteredList" :key="i">
                    <td v-for="(cell, j) in row" :key="j">
                        {{
                            j > 0
                                ? cell > -1
                                    ? cell.toLocaleForAries()
                                    : ''
                                : convertTimeText(cell)
                        }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState, mapMutations } from '../store';
import { convertTimeText } from '@entry/analysis/dbmetrics/dbsearch';
import { getDayjs } from '@common/base';

const MIN_COL_WIDTH = 72;

export default {
    name: 'DbMetricsTable',
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                time: 'time',
            }),
        },
    },
    props: {
        list: {
            type: Array,
            default: [],
        },
        tableWidth: {
            type: Number,
            default: 0,
        },
        tableHeight: {
            type: Number,
            default: 200,
        },
    },
    watch: {
        list(next) {
            this.createTableHeader();
            this.columnCount = this.searchConditionQueue
                .map(e => e.resources.grouped)
                .map(e => Object.values(e).flat().length)
                .reduce((a, b) => a + b, 0);
            this.filteredList = this.getFilteredList();
        },
    },
    computed: {
        ...mapState({
            searchConditionQueue: state => state.searchConditionQueue,
            showStartTime: ({ filters }) => filters.showStartTime,
            searchCache: state => state.searchCache,
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
    data() {
        return {
            columnCount: 0,
            filteredList: this.list,
        };
    },
    methods: {
        ...mapMutations([
            'addTableColumn',
            'resetTableColumn',
        ]),
        createTableHeader() {
            this.resetTableColumn();
            const thead = [],
                tr1 = [],
                tr2 = [],
                tr3 = [];

            tr1.push(
                `<tr><th width="180px" rowspan="3" class="time-col">${this.i18n.time}</th>`
            );
            tr2.push('<tr>');
            tr3.push('<tr>');

            for (const item of this.searchConditionQueue) {
                const { resources, metric, resourceType, nameMap } = item;
                const { grouped } = resources;
                let isFirst = true;

                for (const sid in grouped) {
                    const domainName = nameMap.domain[sid];
                    const oidCount = grouped[sid].length;
                    if (oidCount === 0) continue;

                    tr1.push(
                        `<th colspan="${oidCount}" title="${metric.label}">${metric.label}</th>`
                    );
                    tr2.push(
                        `<th rowspan="${
                            resourceType === 'domain' ? 2 : 1
                        }" class="${
                            isFirst ? 'first' : ''
                        }" colspan="${oidCount}" title="${domainName}">${domainName}</th>`
                    );

                    if (resourceType === 'domain') {
                        this.addTableColumn(`${domainName} (${metric.label})`);
                    } else {
                        const tmpNameMap =
                            resourceType === 'instance'
                                ? nameMap.instance
                                : nameMap.business;

                        for (let j = 0; j < oidCount; j++) {
                            const oid = grouped[sid][j],
                                oidName =
                                    tmpNameMap[`${sid}:${oid}`] ||
                                    `OID(${oid})`;

                            tr3.push(
                                `<th class="${isFirst ? 'first' : ''}
                                    " title="${oidName}">${oidName}
                                    </th>`
                            );

                            this.addTableColumn(
                                `${oidName}/${domainName} (${metric.label})`
                            );
                        }
                    }

                    isFirst = false;
                }
            }

            tr3.push('</tr>');
            tr2.push('</tr>');
            tr1.push('</tr>');

            thead.push(tr1.join(''));
            thead.push(tr2.join(''));
            thead.push(tr3.join(''));

            this.$refs.theadRef.innerHTML = thead.join('');
        },
        convertTimeText(time) {
            const {
                time: { end },
                gatheringInterval,
            } = this.searchCache;
            return convertTimeText(
                time,
                end.valueOf(),
                gatheringInterval,
                this.showStartTime
            );
        },
        getFilteredList() {
            const interval = this.searchCache.gatheringInterval;
            const { from, to } = this.searchCache.operatingTime;

            return interval <= 60
                ? this.list.filter(e => {
                const time = getDayjs(e[0]);
                return time.hour() >= from && time.hour() < to;
            }) : this.list;
        },
    },
    beforeMount() {
        this.MIN_COL_WIDTH = MIN_COL_WIDTH;
    },
};
</script>

<style lang="scss" scoped>
@import '~@entry/analysis/dbmetrics/styles/table-overflow.scss';
.db-metrics-table {
    @include table-overflow;
}
</style>
