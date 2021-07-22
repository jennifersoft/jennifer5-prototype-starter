<template>
    <div class="summary-table">
        <x-table
            :table-type="'nowrap'"
            :table-effect="'stripeless'"
            :table-size="'large'"
            :scroll-height="tableHeight"
            :scroll-event="false"
            :select-row-effect="false"
            :row-height="35"
            :resize="true"
            :sort-cache="true"
            :columns="columns"
            :data="rows"
            :template-row="rowTemplate"
            @click="onClickTableRow"
            @scroll="onHideTooltip"
            @update="onHideTooltip"
        >
        </x-table>
        <div
            class="active-score-wrapper"
            :style="{ top: `${tooltipTop}px` }"
            v-if="showTooltip"
        >
            <active-score
                :fatal="tooltipData.fatal"
                :warn="tooltipData.warn"
                :info="tooltipData.info"
                :normal="tooltipData.normal"
            ></active-score>
        </div>
    </div>
</template>

<script>
import XTable from 'vue-sheets/src/components/xtable';
import ActiveScore from '../component/ActiveScore';
import { mapState } from '../vuex';

export default {
    inject: ['i18n', 'platform'],
    components: {
        XTable,
        ActiveScore,
    },
    props: {
        type: {
            type: String,
            required: true,
        },
    },
    computed: {
        ...mapState({
            filteredData: state => state.filteredData,
            totalCount: state => state.filteredData.length,
            tableHeight: state => state.tableHeight,
            scoreRanges: state => state.scoreRanges,
        }),
        rows() {
            const rowMap = {};

            this.filteredData.forEach(row => {
                const time = row.elapsedTime;
                const key = row[this.type];

                if (!rowMap[key]) {
                    rowMap[key] = {
                        info: 0,
                        warn: 0,
                        fatal: 0,
                        normal: 0,
                        count: 0,
                    };
                }

                if (time > this.scoreRanges.fatal) rowMap[key].fatal += 1;
                else if (time > this.scoreRanges.warn) rowMap[key].warn += 1;
                else if (time > this.scoreRanges.info) rowMap[key].info += 1;
                else rowMap[key].normal += 1;
                rowMap[key].count += 1;
            });

            return Object.keys(rowMap)
                .map(key => {
                    const data = rowMap[key];
                    return {
                        text: key !== '' ? key : `(${this.i18n.unknown})`,
                        countRate: (data.count / this.totalCount) * 100,
                        countFormat: data.count.toLocaleForAries(),
                        fatalRate: (data.fatal / data.count) * 100,
                        warnRate: (data.warn / data.count) * 100,
                        infoRate: (data.info / data.count) * 100,
                        normalRate: (data.normal / data.count) * 100,
                        ...data,
                    };
                })
                .sort((a, b) => b.count - a.count);
        },
    },
    data() {
        return {
            columns: [
                {
                    key: 'text',
                    name: this.i18n.name,
                    sort: true,
                },
                {
                    key: 'count',
                    name: this.i18n.activeServiceCount,
                    sort: true,
                },
                {
                    key: null,
                    name: this.i18n.rate,
                    sort: false,
                    width: 250,
                },
            ],
            rowTemplate: `
<tr>
    <td title="<!= text !>"><!= text !></td>
    <td>
        <div class="bar">
            <div class="graph"><i style="width: <!= countRate !>%"></i></div>
            <div class="text"><!= countFormat !></div>
        </div>
    </td>
    <td>
        <div class="stack">
            <! if(fatalRate > 0) { !><div class="fatal" style="width: <!= fatalRate !>%"></div><! } !>
            <! if(warnRate > 0) { !><div class="warn" style="width: <!= warnRate !>%"></div><! } !>
            <! if(infoRate > 0) { !><div class="info" style="width: <!= infoRate !>%"></div><! } !>
            <! if(normalRate > 0) { !><div class="normal" style="width: <!= normalRate !>%"></div><! } !>
        </div>
    </td>
</tr>
`,
            showTooltip: false,
            tooltipTop: 0,
            tooltipData: {
                fatal: 0,
                warn: 0,
                info: 0,
                normal: 0,
            },
        };
    },
    methods: {
        onClickTableRow(row, e) {
            const cls = e.target.className;
            if (['stack', 'fatal', 'warn', 'info', 'normal'].includes(cls)) {
                this.tooltipTop = e.pageY;
                this.tooltipData = {
                    fatal: row.data.fatal,
                    warn: row.data.warn,
                    info: row.data.info,
                    normal: row.data.normal,
                };
                this.showTooltip = true;
            }
        },
        onHideTooltip() {
            if (this.showTooltip) this.showTooltip = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.summary-table {
    @import '../themes.scss';
    @include themify($themes) {
        .active-score-wrapper {
            position: absolute;
            right: 43px;
            height: 24px;
            border-radius: 4px;
            padding: 0px 8px;
            background-color: themed('summary-table-tooltip-background-color');

            ::v-deep .active-score {
                color: themed('summary-table-tooltip-font-color');
                .total {
                    > strong {
                        color: themed('summary-table-tooltip-total-font-color');
                    }
                }
            }
        }

        ::v-deep tr {
            .bar {
                display: flex;

                > .graph {
                    flex: 8.5;
                    border-radius: 2px;
                    background-color: themed(
                        'summary-table-graph-background-color'
                    );
                    height: 13px;

                    > i {
                        display: inline-block;
                        border-radius: 2px;
                        height: 100%;
                        background-color: themed(
                            'summary-table-graph-bar-background-color'
                        );
                    }
                }

                > .text {
                    flex: 1.5;
                    padding-left: 8px;
                }
            }
        }
    }

    @import '../style/active-score-cell';
    @include themify($themes) {
        ::v-deep tr {
            .stack {
                height: 13px;
                cursor: pointer;

                > * {
                    display: inline-block;
                    height: 100%;

                    &:first-child {
                        border-top-left-radius: 2px;
                        border-bottom-left-radius: 2px;
                    }

                    &:last-child {
                        border-top-right-radius: 2px;
                        border-bottom-right-radius: 2px;
                    }

                    &.fatal {
                        background-color: themed(
                            'active-score-fatal-background-color'
                        );
                    }

                    &.warn {
                        background-color: themed(
                            'active-score-warn-background-color'
                        );
                    }

                    &.info {
                        background-color: themed(
                            'active-score-info-background-color'
                        );
                    }

                    &.normal {
                        background-color: themed(
                            'active-score-normal-background-color'
                        );
                    }
                }
            }
        }
    }
}
</style>
